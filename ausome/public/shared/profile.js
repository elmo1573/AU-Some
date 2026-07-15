const PROFILE_KEY = "ausome_profile";

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  const next = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}

export function createProfile(partial = {}) {
  const now = new Date().toISOString();
  return {
    id: partial.id || `profile_${Date.now()}`,
    name: partial.name || "Explorer",
    avatar: partial.avatar || "🦊",
    username: partial.username,
    bio: partial.bio,
    email: partial.email,
    createdAt: partial.createdAt || now,
    updatedAt: now,
    modules: partial.modules || {},
  };
}

export function syncHubStateToProfile() {
  try {
    const hub = JSON.parse(localStorage.getItem("ausome_state") || "{}");
    if (!hub.profile) return loadProfile();

    const existing = loadProfile();
    const profile = createProfile({
      ...(existing || {}),
      name: hub.profile.nickname || hub.profile.username || existing?.name || "Explorer",
      avatar: hub.profile.avatar || existing?.avatar || "🦊",
      username: hub.profile.username || existing?.username,
      bio: hub.profile.bio || existing?.bio,
      email: hub.email || existing?.email,
      modules: existing?.modules || {},
    });
    saveProfile(profile);
    fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    }).catch(() => {});
    return profile;
  } catch {
    return loadProfile();
  }
}

export function syncProfileToHubState(profile) {
  if (!profile) return;
  try {
    const hub = JSON.parse(localStorage.getItem("ausome_state") || "{}");
    hub.profile = {
      nickname: profile.name,
      username: profile.username || profile.name,
      avatar: profile.avatar,
      bio: profile.bio || "",
    };
    localStorage.setItem("ausome_state", JSON.stringify(hub));
  } catch {
    // ignore
  }
}
