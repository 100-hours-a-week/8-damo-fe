export function generateClientMessageId(
  lightningId: string,
  userId: string
): string {
  const createdAt = new Date().toISOString();
  const uuid = crypto.randomUUID();
  return `${lightningId}:${userId}:${createdAt}:${uuid}`;
}
