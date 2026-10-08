// Public files need the same build-time prefix as Next's generated assets.
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
export const assetPath = (path: string) => `${basePath}${path}`;
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://normand-karol-mendoza.hale-hare-6315.chatgpt.site").replace(/\/$/, "");
