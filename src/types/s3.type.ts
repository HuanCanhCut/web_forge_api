export const S3_FOLDERS = ['avatars', 'courses', 'lessons'] as const
export const S3_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'] as const

export type S3Folder = (typeof S3_FOLDERS)[number]
export type S3ContentType = (typeof S3_CONTENT_TYPES)[number]
