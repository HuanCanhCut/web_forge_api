/**
 * Resolves a storage path into a full public URL.
 *
 * - If `path` is already an absolute URL (http/https), it is returned as-is.
 * - Otherwise, it is joined with the R2 public base URL from env.
 * - Returns `null` when `path` is falsy.
 */
export function resolveStorageUrl(path: string | null | undefined): string | null {
    if (!path) return null

    const isUrl = /^(https?:)?\/\//.test(path)

    return isUrl ? path : `${process.env.R2_PUBLIC_URL}/${path}`
}
