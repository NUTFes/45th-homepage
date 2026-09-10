const DEFAULT_SITE_URL = "https://www.nutfes.net/";

export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
