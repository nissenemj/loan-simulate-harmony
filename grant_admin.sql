-- Run this in your Supabase SQL Editor to grant admin rights to the user
-- This script looks up the user ID by email and adds the 'admin' role

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'nissenemj@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.users.id 
    AND role = 'admin'
);

-- Verify the result
SELECT u.email, r.role 
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id
WHERE u.email = 'nissenemj@gmail.com';
