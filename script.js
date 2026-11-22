//theme toggle
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function currentTheme() {
  return root.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function updateToggle() {
  const dark = currentTheme() === "dark";
  themeBtn.textContent = dark ? "Light mode" : "Dark mode";
  themeBtn.setAttribute("aria-pressed", String(dark));
}
try {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
} catch (e) {}

themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
  updateToggle();
});
updateToggle();

//projects
const projects = [
  { id: 1, title: "Weather Dashboard", description: "Shows a five-day forecast with a clean, responsive layout.", tech: ["HTML", "CSS", "JavaScript"], year: 2026, link: "https://github.com/your-username/weather-dashboard" },
  { id: 2, title: "Todo List", description: "A task manager that saves your tasks between visits.", tech: ["HTML", "JavaScript"], year: 2025, link: "https://github.com/your-username/todo-list" },
  { id: 3, title: "Recipe Finder", description: "Search recipes by ingredient and filter by cooking time.", tech: ["JavaScript", "CSS"], year: 2025, link: "https://github.com/your-username/recipe-finder" },
  { id: 4, title: "CSS Grid Gallery", description: "A photo gallery that reflows from one to three columns.", tech: ["HTML", "CSS"], year: 2026, link: "https://github.com/your-username/grid-gallery" },
  { id: 5, title: "Quiz App", description: "A multiple-choice quiz with scoring and a results screen.", tech: ["HTML", "CSS", "JavaScript"], year: 2026, link: "https://github.com/your-username/quiz-app" },
  { id: 6, title: "Expense Tracker", description: "Track spending by category and see running totals.", tech: ["JavaScript", "Git"], year: 2025, link: "https://github.com/your-username/expense-tracker" }
];

const grid = document.getElementById("project-grid");
if (grid) {
  const searchInput = document.getElementById("search");
  const techSelect = document.getElementById("tech-filter");
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty-message");

  //fill in
  [...new Set(projects.flatMap(p => p.tech))].sort().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    techSelect.append(opt);
  });

  function createCard(p) {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h2");
    title.textContent = p.title;

    const desc = document.createElement("p");
    desc.textContent = p.description;

    const chips = document.createElement("ul");
    chips.className = "chips";
    p.tech.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      chips.append(li);
    });

    const year = document.createElement("p");
    year.className = "muted";
    year.textContent = "Year: " + p.year;

    const link = document.createElement("a");
    link.className = "btn btn-small";
    link.href = p.link;
    link.rel = "noopener";
    link.textContent = "View project";
    link.setAttribute("aria-label", "View project: " + p.title);

    card.append(title, desc, chips, year, link);
    return card;
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const tech = techSelect.value;

  
    const results = projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(query) ||
        p.tech.some(t => t.toLowerCase().includes(query));
      const matchesTech = tech === "all" || p.tech.includes(tech);
      return matchesSearch && matchesTech;
    });

    grid.replaceChildren(...results.map(createCard));
    emptyEl.hidden = results.length > 0;
    countEl.textContent = results.length + (results.length === 1 ? " project" : " projects") + " shown";
  }

  searchInput.addEventListener("input", render);
  techSelect.addEventListener("change", render);
  render();
}

//contact form validation 
const form = document.getElementById("contact-form");
if (form) {
  const successEl = document.getElementById("form-success");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + "-error");
    errorEl.textContent = message;
    const input = document.getElementById(fieldId);
    if (input) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
    return message === "";
  }

  //each returns true if valid
  const checks = [
    () => setError("name", form.elements.name.value.trim().length >= 3 ? "" : "Enter at least 3 characters."),
    () => setError("email", emailPattern.test(form.email.value.trim()) ? "" : "Enter a valid email, like name@example.com."),
    () => setError("subject", form.subject.value ? "" : "Choose a subject."),
    () => setError("message", form.message.value.trim().length >= 20 ? "" : "Write at least 20 characters."),
    () => setError("source", form.source.value ? "" : "Select how you heard about me."),
    () => setError("consent", form.consent.checked ? "" : "You must agree before sending.")
  ];

  form.addEventListener("submit", event => {
    event.preventDefault();
    successEl.hidden = true;

  
    const results = checks.map(check => check());
    if (results.includes(false)) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]') || form.querySelector("#source-error");
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    successEl.textContent = "Thanks, " + form.elements.name.value.trim() + "! Your message was validated and is ready to send.";
    successEl.hidden = false;
    successEl.focus();
    form.reset();
  });
}
