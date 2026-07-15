import {
  AusomeProfile,
  PROFILE_STORAGE_KEY,
  ModuleId,
  createProfile,
} from "./profile";

export { createProfile };

export function loadProfile(): AusomeProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AusomeProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: AusomeProfile) {
  const next = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function loadModuleData<T>(module: ModuleId, fallback: T): T {
  const profile = loadProfile();
  const data = profile?.modules?.[module];
  if (!data || typeof data !== "object") return fallback;
  return { ...fallback, ...(data as T) };
}

export function saveModuleData(module: ModuleId, data: Record<string, unknown>) {
  const profile = loadProfile() || createProfile();
  profile.modules[module] = data;
  if (data.childName && typeof data.childName === "string") {
    profile.name = data.childName;
  }
  if (data.name && typeof data.name === "string") {
    profile.name = data.name;
  }
  return saveProfile(profile);
}

export async function syncProfileToApi(profile: AusomeProfile) {
  try {
    await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
  } catch {
    // offline is fine — localStorage is the cache
  }
}

export async function hydrateProfileFromApi(): Promise<AusomeProfile | null> {
  try {
    const res = await fetch("/api/profiles");
    const list = (await res.json()) as AusomeProfile[];
    if (!Array.isArray(list) || list.length === 0) return loadProfile();

    const local = loadProfile();
    const match = local
      ? list.find((p) => p.id === local.id) || list[0]
      : list[0];

    const merged: AusomeProfile = {
      ...createProfile(match),
      ...match,
      modules: { ...match.modules, ...(local?.modules || {}) },
    };
    saveProfile(merged);
    return merged;
  } catch {
    return loadProfile();
  }
}

export function migrateLegacyKeys() {
  if (loadProfile()) return loadProfile();

  try {
    const hub = JSON.parse(localStorage.getItem("ausome_state") || "{}");
    if (hub.profile?.username || hub.profile?.nickname) {
      const profile = createProfile({
        name: hub.profile.nickname || hub.profile.username || "Explorer",
        avatar: hub.profile.avatar || "🦊",
        username: hub.profile.username,
        bio: hub.profile.bio,
        email: hub.email,
      });
      return saveProfile(profile);
    }
  } catch {
    // ignore
  }

  return null;
}
