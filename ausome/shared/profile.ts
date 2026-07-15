export const PROFILE_STORAGE_KEY = "ausome_profile";

export type ModuleId = "focus" | "math" | "language" | "sensory";

export type AusomeProfile = {
  id: string;
  name: string;
  avatar: string;
  username?: string;
  bio?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  modules: Partial<Record<ModuleId, Record<string, unknown>>>;
};

export function createProfile(partial?: Partial<AusomeProfile>): AusomeProfile {
  const now = new Date().toISOString();
  return {
    id: partial?.id || `profile_${Date.now()}`,
    name: partial?.name || "Explorer",
    avatar: partial?.avatar || "🦊",
    username: partial?.username,
    bio: partial?.bio,
    email: partial?.email,
    createdAt: partial?.createdAt || now,
    updatedAt: now,
    modules: partial?.modules || {},
  };
}
