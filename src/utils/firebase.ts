
import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Your web app's Firebase configuration
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

// Helper function for uploading images
export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log("Starting image upload process...");
    
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    const imageRef = storageRef(storage, `blog/${filename}`);
    
    console.log(`Uploading file: ${file.name} as ${filename}`);
    
    // Upload the file
    const snapshot = await uploadBytes(imageRef, file);
    console.log("Upload successful:", snapshot);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef);
    console.log("Download URL generated:", downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error in uploadImage function:', error);
    throw error;
  }
}

export default app;
