
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// In a real application, these values would be stored in environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "velkavapaus-app.firebaseapp.com",
  projectId: "velkavapaus-app",
  storageBucket: "velkavapaus-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(firebaseApp);

// Initialize Storage
export const storage = getStorage(firebaseApp);

/**
 * IMPORTANT: In a production environment, you should:
 * 1. Store Firebase config in environment variables
 * 2. Implement proper security rules in Firebase console
 * 3. Set up Firebase Authentication providers in Firebase console
 * 4. Configure proper CORS settings for storage
 */
