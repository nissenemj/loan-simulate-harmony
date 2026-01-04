import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// The bucket name in Supabase Storage
const BUCKET_NAME = 'files';

export interface FileMetadata {
  name: string;
  url: string;
  path: string;
  size?: number;
  contentType?: string;
}

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 */
export const uploadImage = async (file: File): Promise<string> => {
  console.log("Starting image upload to Supabase...");

  const fileExtension = file.name.split('.').pop();
  const filename = `${uuidv4()}.${fileExtension}`;
  const filePath = `blog/${filename}`;

  console.log(`Uploading file: ${file.name} as ${filename}`);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  console.log("Download URL generated:", urlData.publicUrl);
  return urlData.publicUrl;
};

/**
 * Uploads any file type to Supabase Storage.
 */
export const uploadFile = async (
  file: File,
  folder: string = 'files'
): Promise<{ url: string; name: string; size: number; type: string; path: string }> => {
  console.log(`Starting file upload to folder ${folder}...`);

  const originalName = file.name;
  const safeFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `${uuidv4()}-${safeFileName}`;
  const filePath = `${folder}/${uniqueFileName}`;

  console.log(`Uploading file: ${originalName} as ${uniqueFileName}`);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error('Error uploading file to Supabase:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    name: originalName,
    size: file.size,
    type: file.type,
    path: data.path,
  };
};

/**
 * Lists all files in a given folder from Supabase Storage.
 */
export const listFiles = async (folder: string = 'files', bucket: string = BUCKET_NAME): Promise<FileMetadata[]> => {
  console.log(`Listing files from bucket: ${bucket}, folder: ${folder}`);

  const { data: files, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (error) {
    console.error('Error listing files from Supabase:', error);
    throw error;
  }

  if (!files || files.length === 0) {
    return [];
  }

  const filesWithMetadata: FileMetadata[] = files
    .filter(file => file.name) // Filter out any empty entries
    .map(file => {
      // For root folder, path is just filename. For subfolders, folder/filename.
      const fullPath = folder ? `${folder}/${file.name}` : file.name;
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fullPath);

      // Extract original file name (if it follows our naming convention)
      const nameParts = file.name.split('-');
      if (nameParts.length > 1 && /^[0-9a-f]{8}-[0-9a-f]{4}/.test(nameParts[0])) {
        nameParts.shift(); // Remove the UUID part if it looks like a UUID
      }
      const originalName = nameParts.join('-') || file.name;

      return {
        name: originalName,
        url: urlData.publicUrl,
        path: fullPath,
        size: file.metadata?.size,
        contentType: file.metadata?.mimetype,
      };
    });

  return filesWithMetadata;
};

/**
 * Deletes a file from Supabase Storage.
 */
export const deleteFile = async (path: string): Promise<boolean> => {
  console.log(`Deleting file at path: ${path}`);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error(`Error deleting file ${path}:`, error);
    throw error;
  }

  console.log(`File deleted successfully: ${path}`);
  return true;
};

/**
 * Lists all files in the shared 'jaettavat' bucket.
 * This is used for the public materials page.
 */
export const listSharedMaterials = async (): Promise<FileMetadata[]> => {
  console.log("Listing shared materials from 'jaettavat' bucket...");
  // Bucket is 'jaettavat', folder is root ('')
  return listFiles('', 'jaettavat');
};
