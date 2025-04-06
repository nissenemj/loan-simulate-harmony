
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxxjC5LJq-GGKFCn4hQN4HyMaIZeIVGzE",
  authDomain: "velkavapaus.firebaseapp.com",
  projectId: "velkavapaus",
  storageBucket: "velkavapaus.appspot.com",
  messagingSenderId: "1076577688427",
  appId: "1:1076577688427:web:7dd5335f8ad767c3768899",
  measurementId: "G-CHLB8SE40Z"
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
console.log("Initializing Firebase Storage...");
export const storage = getStorage(app);
console.log("Firebase Storage initialized");

export default app;
