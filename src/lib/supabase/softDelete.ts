export function softDeleteFields() {
  const deletedAt = new Date().toISOString()
  return { deleted: true, deleted_at: deletedAt }
}
