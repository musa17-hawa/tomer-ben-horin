import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'galleries';

// Create a new gallery
export const createGallery = async (galleryData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...galleryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...galleryData };
  } catch (error) {
    console.error('Error creating gallery:', error);
    throw error;
  }
};

// Get all galleries
export const getAllGalleries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting galleries:', error);
    throw error;
  }
};

// Get a single gallery by ID
export const getGalleryById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting gallery:', error);
    throw error;
  }
};

// Update a gallery
export const updateGallery = async (id, galleryData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...galleryData,
      updatedAt: new Date().toISOString()
    });
    return { id, ...galleryData };
  } catch (error) {
    console.error('Error updating gallery:', error);
    throw error;
  }
};

// Delete a gallery
export const deleteGallery = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting gallery:', error);
    throw error;
  }
};