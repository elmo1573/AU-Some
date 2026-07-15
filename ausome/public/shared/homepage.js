const home = document.getElementById("view-home");

if (home) {
  const main = document.querySelector("main");
  main.id = "main-content";
  main.tabIndex = -1;

  const skip = document.createElement("a");
  skip.className = "home-skip";
  skip.href = "#main-content";
  skip.textContent = "Skip to main content";
  document.body.prepend(skip);

  const hero = home.querySelector(".hero");
  const out = document.getElementById("heroLoggedOut");
  const inside = document.getElementById("heroLoggedIn");

  [out, inside].forEach((box) => {
    const label = document.createElement("p");
    label.className = "home-eyebrow";
    label.textContent = "Support on your terms";
    box.prepend(label);
  });

  const buttons = out.querySelector(".hero-buttons");
  const signup = buttons.querySelector('[data-view="signup"]');
  const login = buttons.querySelector('[data-view="login"]');
  buttons.append(signup, login);

  const note = document.createElement("aside");
  note.className = "home-note";
  note.setAttribute("aria-label", "What to expect");
  note.innerHTML = `
    <h2>Designed around your pace</h2>
    <ul>
      <li>Clear choices without unnecessary steps</li>
      <li>Calm visuals with limited movement</li>
      <li>Support available when you choose it</li>
    </ul>
  `;
  hero.append(note);

  const title = home.querySelector(":scope > h2");
  title.removeAttribute("style");
  title.textContent = "Choose where to begin";

  const intro = document.createElement("p");
  intro.className = "home-intro";
  intro.textContent = "Each area has one clear purpose. You can explore them in any order and return here whenever you need.";
  title.after(intro);

  home.querySelectorAll(".feature-card").forEach((card) => {
    const image = card.querySelector(".feature-icon img");
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `${card.querySelector("h3").textContent}: ${card.querySelector("p").textContent}`);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });

  const guide = document.createElement("aside");
  guide.className = "home-guide";
  guide.innerHTML = `
    <div>
      <strong>You are in control</strong>
      <p>Pause, leave, or switch activities whenever you need.</p>
    </div>
    <div>
      <strong>Need help deciding?</strong>
      <p>The AU Assistant button stays available in the bottom corner.</p>
    </div>
  `;
  home.append(guide);
}
