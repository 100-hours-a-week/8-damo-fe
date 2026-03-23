export function getProfileImageUrl(
  userId: string,
  imagePath: string | null
): string | null {
  void userId;

  if (!imagePath) return null;

  const cdnUrl = process.env.NEXT_PUBLIC_S3_CDN;
  if (!cdnUrl) return null;

  return `https://${cdnUrl}/${imagePath}`;
}
