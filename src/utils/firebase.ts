
import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, listAll, getMetadata, deleteObject } from 'firebase/storage';
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

// Helper function for uploading any file type
export const uploadFile = async (file: File, folder: string = 'files'): Promise<{url: string, name: string, size: number, type: string, path: string}> => {
  try {
    console.log(`Starting file upload process to folder ${folder}...`);
    
    // Generate a unique filename while preserving the original filename
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || '';
    const safeFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace unsafe characters
    const uniqueFileName = `${uuidv4()}-${safeFileName}`;
    const filePath = `${folder}/${uniqueFileName}`;
    const fileRef = storageRef(storage, filePath);
    
    console.log(`Uploading file: ${originalName} as ${uniqueFileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(fileRef, file);
    console.log("Upload successful:", snapshot);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    console.log("Download URL generated:", downloadURL);
    
    // Get metadata
    const metadata = await getMetadata(fileRef);
    
    return {
      url: downloadURL,
      name: originalName,
      size: file.size,
      type: file.type,
      path: filePath
    };
  } catch (error) {
    console.error('Error in uploadFile function:', error);
    throw error;
  }
}

// Get list of files in a folder
export const listFiles = async (folder: string = 'files'): Promise<Array<{name: string, url: string, path: string, size?: number, contentType?: string}>> => {
  try {
    console.log(`Listing files from folder: ${folder}`);
    
    const folderRef = storageRef(storage, folder);
    const fileList = await listAll(folderRef);
    
    const filesWithMetadata = await Promise.all(fileList.items.map(async (itemRef) => {
      try {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        const fullPath = itemRef.fullPath;
        
        // Extract original file name from the path (if it follows our naming convention)
        const nameParts = itemRef.name.split('-');
        nameParts.shift(); // Remove the UUID part
        const originalName = nameParts.join('-');
        
        return {
          name: originalName || itemRef.name,
          url,
          path: fullPath,
          size: metadata.size,
          contentType: metadata.contentType
        };
      } catch (error) {
        console.error(`Error getting metadata for file ${itemRef.name}:`, error);
        return {
          name: itemRef.name,
          url: '',
          path: itemRef.fullPath
        };
      }
    }));
    
    return filesWithMetadata.filter(file => file.url); // Only return files with valid URLs
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Delete a file
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    console.log(`Deleting file at path: ${path}`);
    
    const fileRef = storageRef(storage, path);
    await deleteObject(fileRef);
    
    console.log(`File deleted successfully: ${path}`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${path}:`, error);
    throw error;
  }
}

export default app;
