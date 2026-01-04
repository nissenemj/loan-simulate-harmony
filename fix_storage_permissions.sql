-- 1. Ensure the bucket is public (allows direct file downloads)
UPDATE storage.buckets
SET public = true
WHERE id = 'jaettavat';

-- 2. Allow anyone (including unauthenticated users) to list and read files in the 'jaettavat' bucket
-- We drop the policy first to avoid conflicts if you run this multiple times
DROP POLICY IF EXISTS "Public Access to Materials" ON storage.objects;

CREATE POLICY "Public Access to Materials"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'jaettavat' );

-- Verify the settings
SELECT id, name, public, created_at FROM storage.buckets WHERE id = 'jaettavat';
