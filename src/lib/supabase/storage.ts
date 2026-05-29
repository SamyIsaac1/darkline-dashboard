import { supabase } from '@/lib/supabase/client'

export const ATTACHMENTS_BUCKET = 'darkline'

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export function buildAttachmentPath(orderId: string, fileName: string): string {
  const id = crypto.randomUUID()
  return `${orderId}/${id}-${sanitizeFileName(fileName)}`
}

export async function uploadOrderAttachment(
  orderId: string,
  file: File
): Promise<string> {
  const path = buildAttachmentPath(orderId, file.name)
  const { error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(path, file, { upsert: false })

  if (error) throw error
  return path
}

export async function deleteOrderAttachment(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .remove([path])

  if (error) throw error
}

export async function getOrderAttachmentUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrl(path, 3600)

  if (error) throw error
  return data.signedUrl
}

export function isImageMimeType(mimeType: string | null): boolean {
  return mimeType?.startsWith('image/') ?? false
}
