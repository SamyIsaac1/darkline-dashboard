-- Create private bucket for order attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'darkline',
  'darkline',
  false,
  5242880,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can manage order attachments
CREATE POLICY "Authenticated users can upload order attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'darkline');

CREATE POLICY "Authenticated users can view order attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'darkline');

CREATE POLICY "Authenticated users can delete order attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'darkline');
