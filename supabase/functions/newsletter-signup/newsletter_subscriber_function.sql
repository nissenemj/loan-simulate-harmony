
-- SQL function for inserting a newsletter subscriber
CREATE OR REPLACE FUNCTION public.insert_newsletter_subscriber(
  p_email TEXT,
  p_name TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.newsletter_subscribers (email, name)
  VALUES (p_email, p_name);
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Email already subscribed' USING ERRCODE = '23505';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
