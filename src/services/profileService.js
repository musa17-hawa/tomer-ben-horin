import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'profiles';

// Create a new profile
export const createProfile = async (profileData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...profileData };
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

// Get all profiles
export const getAllProfiles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting profiles:', error);
    throw error;
  }
};

// Get a single profile by ID
export const getProfileById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

// Update a profile
export const updateProfile = async (id, profileData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    return { id, ...profileData };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Delete a profile
export const deleteProfile = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}; 