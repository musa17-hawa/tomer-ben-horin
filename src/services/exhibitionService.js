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

const COLLECTION_NAME = 'exhibitions';

// Create a new exhibition
export const createExhibition = async (exhibitionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...exhibitionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...exhibitionData };
  } catch (error) {
    console.error('Error creating exhibition:', error);
    throw error;
  }
};

// Get all exhibitions
export const getAllExhibitions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting exhibitions:', error);
    throw error;
  }
};

// Get a single exhibition by ID
export const getExhibitionById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting exhibition:', error);
    throw error;
  }
};

// Update an exhibition
export const updateExhibition = async (id, exhibitionData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...exhibitionData,
      updatedAt: new Date().toISOString()
    });
    return { id, ...exhibitionData };
  } catch (error) {
    console.error('Error updating exhibition:', error);
    throw error;
  }
};

// Delete an exhibition
export const deleteExhibition = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    throw error;
  }
};

// Get exhibitions by status
export const getExhibitionsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting exhibitions by status:', error);
    throw error;
  }
};

// Get exhibitions by gallery ID
export const getExhibitionsByGallery = async (galleryId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('galleryId', '==', galleryId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting exhibitions by gallery:', error);
    throw error;
  }
};