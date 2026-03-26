import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: {
      ja: "ユーザー",
      en: "User",
    },
    plural: {
      ja: "ユーザー",
      en: "Users",
    },
  },
  admin: {
    useAsTitle: "email",
    group: {
      ja: "運用管理",
      en: "Operations",
    },
    description: {
      ja: "管理画面にログインするユーザーを管理します。",
      en: "Manage users who can sign in to the admin panel.",
    },
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
