const links = [
  { id: "dashboard", href: "/", label: "Home", icon: "home" },
  { id: "connect", href: "/connect", label: "Connect Sphere", icon: "people" },
  { id: "games", href: "/games", label: "Games", icon: "game" },
  { id: "assistant", href: "/assistant", label: "Assistant", icon: "chat" },
  { id: "settings", href: "/?view=settings", label: "Settings", icon: "settings" },
];

const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10v10h13V10M9.5 20v-6h5v6"></path></svg>',
  people: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.5"></circle><path d="M2.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6M14 15c3.8-.8 6.3 1 7 4"></path></svg>',
  game: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 8h9a5 5 0 0 1 4.8 6.4l-1 3.3a2.5 2.5 0 0 1-4.1 1.1L14.3 17H9.7l-1.9 1.8a2.5 2.5 0 0 1-4.1-1.1l-1-3.3A5 5 0 0 1 7.5 8Z"></path><path d="M7 11v4M5 13h4"></path><circle cx="17" cy="12" r=".6"></circle><circle cx="15.5" cy="14" r=".6"></circle></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-4.5 3v-3H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"></path><path d="M8 10h8M8 13h5"></path></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"></path></svg>',
  logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"></path></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"></path></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
};

function safe(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function user() {
  try {
    const hub = JSON.parse(localStorage.getItem("ausome_state") || "{}");
    const profile = JSON.parse(localStorage.getItem("ausome_profile") || "null");
    const name =
      (hub.profile && (hub.profile.nickname || hub.profile.username)) ||
      profile?.name ||
      "Guest";
    return { name, loggedIn: Boolean(hub.loggedIn) };
  } catch {
    return { name: "Guest", loggedIn: false };
  }
}

function current(active, id) {
  return active === id ? ' aria-current="page"' : "";
}

function sidebar(active, loggedIn) {
  const items = links.map((item) => `
    <a class="site-sidebar-item${active === item.id ? " active" : ""}" href="${item.href}" data-nav="${item.id}"${current(active, item.id)}>
      <span class="site-sidebar-icon">${icons[item.icon]}</span>
      <span>${item.label}</span>
    </a>
  `).join("");

  return `
    <div class="site-sidebar-head">
      <div>
        <p>AU-SOME</p>
        <span>Navigation</span>
      </div>
      <button class="site-sidebar-close" id="siteSidebarClose" type="button" aria-label="Close menu">${icons.close}</button>
    </div>
    <div class="site-sidebar-links">${items}</div>
    <div class="site-sidebar-spacer"></div>
    <button class="site-sidebar-item site-logout" id="siteSidebarLogout" type="button">
      <span class="site-sidebar-icon">${icons.logout}</span>
      <span>${loggedIn ? "Log out" : "Clear saved data"}</span>
    </button>
  `;
}

function top(active) {
  const info = user();
  const name = safe(info.name);
  const first = safe(info.name.trim().charAt(0).toUpperCase() || "G");
  const primary = links.slice(0, 4).map((item) => `
    <a class="site-primary-link${active === item.id ? " active" : ""}" href="${item.href}"${current(active, item.id)}>${item.label}</a>
  `).join("");

  return `
    <header class="site-topnav">
      <div class="site-topnav-inner">
        <div class="site-topnav-left">
          <button class="site-hamburger" id="siteHamburger" type="button" aria-label="Open navigation menu" aria-controls="siteSidebar" aria-expanded="false">${icons.menu}</button>
          <a class="site-brand" href="/" aria-label="AU-SOME home">
            <span class="site-brand-logo" aria-hidden="true">AU</span>
            <span class="site-brand-copy">
              <span class="site-brand-title">AU-SOME</span>
              <span class="site-brand-subtitle">Support platform</span>
            </span>
          </a>
        </div>
        <nav class="site-primary" aria-label="Primary navigation">${primary}</nav>
        <div class="site-topnav-right">
          <a class="site-profile-btn${active === "settings" ? " active" : ""}" id="siteProfileBtn" href="/?view=settings" aria-label="Open settings for ${name}"${current(active, "settings")}>
            <span class="site-profile-avatar" aria-hidden="true">${first}</span>
            <span class="site-profile-copy">
              <span>${name}</span>
              <small>Profile & settings</small>
            </span>
          </a>
        </div>
      </div>
    </header>
    <div class="site-overlay" id="siteOverlay"></div>
    <nav class="site-sidebar" id="siteSidebar" aria-label="Main navigation" aria-hidden="true">${sidebar(active, info.loggedIn)}</nav>
  `;
}

function bindNav() {
  const menu = document.getElementById("siteSidebar");
  const overlay = document.getElementById("siteOverlay");
  const trigger = document.getElementById("siteHamburger");
  const close = document.getElementById("siteSidebarClose");
  const logout = document.getElementById("siteSidebarLogout");

  function openMenu() {
    menu.classList.add("open");
    overlay.classList.add("show");
    document.body.classList.add("site-menu-open");
    menu.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    close.focus();
  }

  function closeMenu(focus = false) {
    menu.classList.remove("open");
    overlay.classList.remove("show");
    document.body.classList.remove("site-menu-open");
    menu.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
    if (focus) trigger.focus();
  }

  trigger.addEventListener("click", () => {
    menu.classList.contains("open") ? closeMenu(true) : openMenu();
  });
  close.addEventListener("click", () => closeMenu(true));
  overlay.addEventListener("click", () => closeMenu(true));

  menu.querySelectorAll("a.site-sidebar-item").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) closeMenu(true);
    if (event.key !== "Tab" || !menu.classList.contains("open")) return;

    const items = [...menu.querySelectorAll('a[href], button:not([disabled])')];
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  logout.addEventListener("click", () => {
    if (typeof window.onSiteLogout === "function") {
      window.onSiteLogout();
      return;
    }
    if (confirm("Log out and clear saved profile data?")) {
      localStorage.removeItem("ausome_state");
      localStorage.removeItem("ausome_profile");
      window.location.href = "/";
    }
  });

  document.getElementById("siteProfileBtn")?.addEventListener("click", (event) => {
    if (typeof window.onSiteProfile === "function") {
      event.preventDefault();
      window.onSiteProfile();
    }
  });
}

export function mountSiteNav(activePage) {
  const root = document.getElementById("site-nav-root");
  if (!root) return;
  root.innerHTML = top(activePage);
  bindNav();
}

export function refreshChildName() {
  const info = user();
  const name = document.querySelector(".site-profile-copy > span");
  const avatar = document.querySelector(".site-profile-avatar");
  const profile = document.getElementById("siteProfileBtn");
  const logout = document.querySelector("#siteSidebarLogout > span:last-child");

  if (name) name.textContent = info.name;
  if (avatar) avatar.textContent = info.name.trim().charAt(0).toUpperCase() || "G";
  if (profile) profile.setAttribute("aria-label", `Open settings for ${info.name}`);
  if (logout) logout.textContent = info.loggedIn ? "Log out" : "Clear saved data";
}

window.refreshSiteNav = refreshChildName;

const page = document.body.dataset.page;
if (page) mountSiteNav(page);
