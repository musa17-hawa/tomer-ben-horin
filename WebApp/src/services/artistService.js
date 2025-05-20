import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const ARTISTS_COLLECTION = 'users';

// ===== الحصول على الفنانين =====

// الحصول على جميع الفنانين
export const getAllArtists = async () => {
  try {
    console.log("Attempting to fetch artists from collection:", ARTISTS_COLLECTION);
    
    const artistsCollection = collection(db, ARTISTS_COLLECTION);
    const snapshot = await getDocs(artistsCollection);
    
    console.log("Firestore response - docs count:", snapshot.docs.length);
    console.log("Raw Firestore docs:", snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    if (snapshot.empty) {
      console.log("No artists found in Firestore!");
      return [];
    }
    
    const artists = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Processing doc:", doc.id, data);
      
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        profileImage: data.image || null,
        location: data.place || '',
        website: data.link || '',
        // Add any other fields you need
      };
    });
    
    console.log("Transformed artists:", artists);
    return artists;
    
  } catch (error) {
    console.error("Error getting artists:", error);
    throw error;
  }
};

// الحصول على فنان واحد باستخدام المعرف
export const getArtistById = async (artistId) => {
  try {
    const artistRef = doc(db, ARTISTS_COLLECTION, artistId);
    const artistDoc = await getDoc(artistRef);
    
    if (artistDoc.exists()) {
      const data = artistDoc.data();
      return {
        id: artistDoc.id,
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        profileImage: data.image || null,
        location: data.place || '',
        website: data.link || '',
        // Add any other fields you need
      };
    } else {
      throw new Error("Artist not found");
    }
  } catch (error) {
    console.error("Error getting artist:", error);
    throw error;
  }
};

// البحث عن فنانين حسب الاسم
export const searchArtistsByName = async (name) => {
  try {
    const artistsCollection = collection(db, ARTISTS_COLLECTION);
    const snapshot = await getDocs(artistsCollection);
    
    // نظرًا لأن Firestore لا يدعم البحث بالنص الكامل بشكل مباشر،
    // نقوم بتنفيذ عملية التصفية على جانب العميل
    const filteredArtists = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          profileImage: data.image || null,
          location: data.place || '',
          website: data.link || '',
          // Add any other fields you need
        };
      })
      .filter(artist => 
        artist.name && artist.name.toLowerCase().includes(name.toLowerCase())
      );
      
    return filteredArtists;
  } catch (error) {
    console.error("Error searching artists:", error);
    throw error;
  }
};

// ===== إضافة فنان جديد =====
export const addArtist = async (artistData) => {
  try {
    // التحقق من وجود البيانات الإلزامية
    if (!artistData.name || !artistData.email) {
      throw new Error("Name and email are required");
    }
    
    // تحويل البيانات إلى التنسيق المستخدم في مجموعة users
    const userDocData = {
      name: artistData.name,
      email: artistData.email,
      bio: artistData.bio || '',
      image: artistData.profileImage || '',
      place: artistData.location || '',
      link: artistData.website || '',
      group: artistData.group || '',
      subject: artistData.subject || '',
      // يمكن إضافة حقول أخرى حسب الحاجة
    };
    
    const artistsCollection = collection(db, ARTISTS_COLLECTION);
    const docRef = await addDoc(artistsCollection, userDocData);
    
    return {
      id: docRef.id,
      ...artistData
    };
  } catch (error) {
    console.error("Error adding artist:", error);
    throw error;
  }
};

// ===== تحديث بيانات فنان =====
export const updateArtist = async (artistId, updatedData) => {
  try {
    const artistRef = doc(db, ARTISTS_COLLECTION, artistId);
    
    // تحويل البيانات إلى التنسيق المستخدم في مجموعة users
    const dataToUpdate = {
      name: updatedData.name,
      email: updatedData.email,
      bio: updatedData.bio || '',
      image: updatedData.profileImage || '',
      place: updatedData.location || '',
      link: updatedData.website || '',
      group: updatedData.group || '',
      subject: updatedData.subject || '',
      // يمكن إضافة حقول أخرى حسب الحاجة
    };
    
    await updateDoc(artistRef, dataToUpdate);
    
    // إعادة البيانات المحدثة
    const updatedArtist = await getArtistById(artistId);
    return updatedArtist;
  } catch (error) {
    console.error("Error updating artist:", error);
    throw error;
  }
};

// ===== حذف فنان =====
export const deleteArtist = async (artistId) => {
  try {
    // أولاً نتحقق مما إذا كان الفنان لديه صورة
    const artist = await getArtistById(artistId);
    
    // حذف الصورة من التخزين إذا كانت موجودة
    if (artist.profileImage) {
      try {
        const imageRef = ref(storage, artist.profileImage);
        await deleteObject(imageRef);
      } catch (imageError) {
        console.warn("Could not delete profile image:", imageError);
        // استمر في حذف الفنان حتى لو فشل حذف الصورة
      }
    }
    
    // حذف وثيقة الفنان من Firestore
    const artistRef = doc(db, ARTISTS_COLLECTION, artistId);
    await deleteDoc(artistRef);
    
    return { success: true, id: artistId };
  } catch (error) {
    console.error("Error deleting artist:", error);
    throw error;
  }
};

// ===== رفع صورة شخصية =====
export const uploadProfileImage = async (artistId, imageFile) => {
  try {
    // إنشاء مسار فريد للصورة
    const storageRef = ref(storage, `artist-profiles/${artistId}/${Date.now()}_${imageFile.name}`);
    
    // رفع الملف
    await uploadBytes(storageRef, imageFile);
    
    // الحصول على URL للصورة المرفوعة
    const imageUrl = await getDownloadURL(storageRef);
    
    // تحديث الفنان بعنوان URL للصورة الجديدة في حقل image
    const artistRef = doc(db, ARTISTS_COLLECTION, artistId);
    await updateDoc(artistRef, { image: imageUrl });
    
    return imageUrl;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};