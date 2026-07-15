const dashboard = document.getElementById("view-dashboard");

if (dashboard) {
  const update = () => {
    const state = typeof getState === "function" ? getState() : {};
    const profile = state.profile || {};
    const name = profile.nickname || profile.username || state.fullName || "";
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    document.getElementById("dashGreeting").textContent = name ? `${greeting}, ${name}` : "Your dashboard";
    document.getElementById("dashDate").textContent = new Intl.DateTimeFormat("en", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  };

  dashboard.querySelectorAll(".mood-emoji").forEach((button) => {
    button.addEventListener("click", () => {
      dashboard.querySelectorAll(".mood-emoji").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      document.getElementById("moodResult").textContent = `${button.dataset.label} has been selected for today.`;
    });
  });

  new MutationObserver(() => {
    if (dashboard.classList.contains("active")) update();
  }).observe(dashboard, { attributes: true, attributeFilter: ["class"] });

  update();
}
