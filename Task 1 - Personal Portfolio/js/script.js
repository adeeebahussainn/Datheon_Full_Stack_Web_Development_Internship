/* ===== Data (edit links here; "#" means a placeholder) ===== */
const SKILLS = {
  "Programming & Development": ["HTML5","CSS3","JavaScript","C++","Java","Python"],
  "Core IT Concepts": ["Object-Oriented Programming","Database Fundamentals","Data Structures & Algorithms","Information Technology"],
  "Tools & Platforms": ["Visual Studio Code","Git & GitHub","IntelliJ IDEA","Microsoft 365"],
  "Areas of Interest": ["Frontend Development","Cyber Security","Artificial Intelligence","Agentic AI","UI/UX Design"]
};
const PROJECTS = [
  {title:"TaskFlow — Productivity & Task Manager",short:"A task manager with filtering, search and saved data.",color:"var(--blue)",tech:["HTML","CSS","JavaScript"],view:"#",git:"#",
   points:["Create, edit, delete and complete tasks","Filter by category and search tasks","Saves your tasks with LocalStorage"]},
  {title:"Student Grade Tracker",short:"A Java application for managing student grades.",color:"var(--lav)",tech:["Java","OOP"],view:"#",git:"#",
   points:["Student grade management","Built with object-oriented design"]},
  {title:"Hotel Reservation System",short:"A console-based hotel booking application.",color:"var(--pink)",tech:["Java","OOP"],view:"#",git:"#",
   points:["Room management","Booking functionality","Uses core OOP concepts"]},
  {title:"Responsive Calculator",short:"A simple, clean calculator with a friendly interface.",color:"var(--mint)",tech:["HTML","CSS"],view:"#",git:"#",
   points:["Clean, user-friendly layout","Works on different screen sizes"]}
];
const CERTS = [
  {t:"Legacy Responsive Web Design V8",by:"freeCodeCamp",d:"2 Sep 2026",img:"freecodecamp-responsive-web-design",file:"freecodecamp-responsive-web-design.png",verify:"https://freecodecamp.org/certification/fcc-a8ae7e29-edb0-428e-b56f-89b4da413290/responsive-web-design"},
  {t:"Foundations of Prompt Engineering",by:"AWS Training & Certification",d:"7 Jul 2026",img:"aws-prompt-engineering",file:"aws-prompt-engineering.pdf"},
  {t:"Introduction to Generative AI",by:"Google Cloud (Simplilearn SkillUp)",d:"22 Dec 2025",img:"google-intro-generative-ai",file:"google-intro-generative-ai.pdf",code:"Certificate code 9621716"},
  {t:"Trust and Security with Google Cloud",by:"Google Cloud (Simplilearn SkillUp)",d:"30 Jun 2026",img:"google-trust-security",file:"google-trust-security.pdf",code:"Certificate code 10412806"},
  {t:"Cyber Security Job Simulation",by:"Deloitte, via Forage",d:"17 Jul 2026",img:"deloitte-cyber-simulation",file:"deloitte-cyber-simulation.pdf",code:"Enrolment code 4v8qDS"},
  {t:"Advisors & Consulting Services Job Simulation",by:"Mastercard, via Forage",d:"7 Jul 2026",img:"mastercard-simulation",file:"mastercard-simulation.pdf"},
  {t:"Introduction to Cyber Security",by:"AI-Explain You Science (AIEYS)",d:"16 Jul 2026",img:"aieys-intro-cyber-security",file:"aieys-intro-cyber-security.png"},
  {t:"Graphic Design",by:"DigiSkills Training Program",d:"14 Mar 2026",img:"digiskills-graphic-design",file:"digiskills-graphic-design.pdf",verify:"https://digiskills.pk/verify",code:"Certificate ID XQVXMJKMK"},
  {t:"UI/UX & Webflow",by:"DigiSkills Training Program",d:"20 Jul 2026",img:"digiskills-uiux-webflow",file:"digiskills-uiux-webflow.pdf",verify:"https://digiskills.pk/verify",code:"Certificate ID 8VKYS33MK"},
  {t:"Information Technology Fundamentals",by:"IBM SkillsBuild",d:"14 Jul 2026",img:"ibm-it-fundamentals",file:"ibm-it-fundamentals.pdf",verify:"https://www.credly.com/badges/2b69acf4-ad01-4361-a552-1fbae4b1084b"}
];
const IBM_COURSES = [["Computer Basics","ibm-computer-basics"],["Computer Networking Basics","ibm-networking-basics"],["Computing from Past to Present","ibm-computing-past-present"],["Security Basics","ibm-security-basics"],["Support Basics","ibm-support-basics"],["Support a Customer with a Network Issue","ibm-support-network-issue"],["Troubleshooting for Hardware, Networks, and Software","ibm-troubleshooting"],["Your Future in IT Support: The Job Landscape","ibm-it-support-landscape"]];
/* Set a form service URL (e.g. Formspree) to send messages for real. Leave empty to use the visitor's email app. */
const FORM_ENDPOINT = "";
const EMAIL = "adeebahhussainn@gmail.com";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

/* ===== Render skills & projects ===== */
const skillGrid = $("#skillGrid");
Object.entries(SKILLS).forEach(([cat, items]) => {
  const c = el("article", "card reveal", `<h3>${cat}</h3>`);
  const ul = el("ul", "chips"); items.forEach(i => ul.append(el("li", "", i))); c.append(ul); skillGrid.append(c);
});
const projGrid = $("#projGrid");
PROJECTS.forEach((p, i) => {
  const c = el("article", "card proj reveal");
  c.tabIndex = 0; c.setAttribute("role", "button"); c.setAttribute("aria-label", `Open details for ${p.title}`);
  c.innerHTML = `<div class="preview" style="background:${p.color}" aria-hidden="true">${p.title[0]}</div>
    <div class="proj-body"><h3>${p.title}</h3><p>${p.short}</p>
    <div class="badges">${p.tech.map(t => `<span class="badge">${t}</span>`).join("")}</div>
    <div class="proj-actions"><a class="btn primary" href="${p.view}" data-placeholder>View Project</a><a class="btn ghost" href="${p.git}" data-placeholder>GitHub</a></div></div>`;
  c.addEventListener("click", e => { if (!e.target.closest("a")) openModal(i, c); });
  c.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === c) { e.preventDefault(); openModal(i, c); } });
  projGrid.append(c);
});


/* ===== Render certifications ===== */
const certGrid = $("#certGrid");
CERTS.forEach(c => {
  const a = el("article", "card cert reveal");
  a.innerHTML = `<a class="cert-img" href="assets/certificates/${c.file}" target="_blank" rel="noopener" aria-label="Open certificate: ${c.t}"><img src="assets/images/certs/${c.img}.jpg" alt="${c.t} certificate from ${c.by}" loading="lazy"></a>
    <h3>${c.t}</h3><p>${c.by} · ${c.d}</p>${c.code ? `<p class="code">${c.code}</p>` : ""}
    <a class="link" href="assets/certificates/${c.file}" target="_blank" rel="noopener">View certificate</a>${c.verify ? ` <a class="link" href="${c.verify}" target="_blank" rel="noopener">Verify online</a>` : ""}`;
  certGrid.append(a);
});
const ibm = el("article", "card cert reveal", `<h3>More IBM SkillsBuild courses</h3><p>IBM SkillsBuild · 12–14 Jul 2026</p><ul class="ibm">${IBM_COURSES.map(([n, f]) => `<li><a href="assets/certificates/${f}.pdf" target="_blank" rel="noopener">${n}</a></li>`).join("")}</ul>`);
certGrid.append(ibm);

/* ===== Placeholder links: explain instead of going nowhere ===== */
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-placeholder]");
  if (a && a.getAttribute("href") === "#") { e.preventDefault(); alert("This link is a placeholder. Add the real URL in js/script.js or index.html."); }
});

/* ===== Theme toggle (saved in localStorage) ===== */
const root = document.documentElement, themeBtn = $("#themeBtn");
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.setAttribute("aria-pressed", t === "dark");
  themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  try { localStorage.setItem("theme", t); } catch (e) {}
}
setTheme(root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

/* ===== Mobile menu ===== */
const burger = $("#burger"), links = $("#links");
function menu(open) { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
burger.addEventListener("click", () => menu(!links.classList.contains("open")));
links.addEventListener("click", e => { if (e.target.closest("a")) menu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { menu(false); closeModal(); } });

/* ===== Active nav link + reveal on scroll ===== */
const navLinks = $$(".links a");
const spy = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => spy.observe(s));
const rev = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); rev.unobserve(en.target); } }), { threshold: .12 });
$$(".reveal").forEach(r => rev.observe(r));

/* ===== Project modal (focus is trapped and restored) ===== */
const modal = $("#modal"); let lastFocus = null;
function openModal(i, opener) {
  const p = PROJECTS[i]; lastFocus = opener;
  $("#mTitle").textContent = p.title; $("#mDesc").textContent = p.short;
  $("#mList").innerHTML = p.points.map(x => `<li>${x}</li>`).join("");
  $("#mTech").innerHTML = p.tech.map(t => `<span class="badge">${t}</span>`).join("");
  $("#mView").href = p.view; $("#mGit").href = p.git;
  modal.hidden = false; requestAnimationFrame(() => modal.classList.add("show")); $("#mClose").focus();
}
function closeModal() {
  if (modal.hidden) return;
  modal.classList.remove("show"); setTimeout(() => { modal.hidden = true; }, 250); if (lastFocus) lastFocus.focus();
}
$("#mClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
modal.addEventListener("keydown", e => {
  if (e.key !== "Tab") return;
  const f = $$("button,a[href]", modal), first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ===== Resume: tell the visitor if the PDF hasn't been added yet ===== */
$$("[data-resume]").forEach(a => a.addEventListener("click", async e => {
  try { const r = await fetch(a.href, { method: "HEAD" }); if (!r.ok) throw 0; }
  catch (err) { if (location.protocol !== "file:") { e.preventDefault(); alert("The resume PDF hasn't been added yet. Put your file at assets/resume.pdf."); } }
}));

/* ===== Contact form validation ===== */
const form = $("#form"), status = $("#status");
const rules = {
  name: v => v.trim().length >= 2 || "Enter your full name.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Enter a valid email address, like name@example.com.",
  subject: v => v.trim().length >= 3 || "Enter a subject of at least 3 characters.",
  message: v => v.trim().length >= 10 || "Write a message of at least 10 characters."
};
function check(f) {
  const r = rules[f.name](f.value), wrap = f.closest(".field");
  wrap.classList.toggle("bad", r !== true); $(".err", wrap).textContent = r === true ? "" : r; f.setAttribute("aria-invalid", r !== true);
  return r === true;
}
$$("input,textarea", form).forEach(f => f.addEventListener("blur", () => check(f)));
form.addEventListener("submit", async e => {
  e.preventDefault(); status.textContent = "";
  const fields = $$("input,textarea", form), ok = fields.map(check).every(Boolean);
  if (!ok) { fields.find(f => f.getAttribute("aria-invalid") === "true").focus(); return; }
  const d = Object.fromEntries(new FormData(form));
  if (FORM_ENDPOINT) {
    try {
      const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) });
      if (!r.ok) throw 0; status.textContent = "Message sent. Thank you!"; form.reset();
    } catch (err) { status.textContent = "The message could not be sent. Please email me directly."; }
  } else {
    /* No backend configured: open the visitor's email app instead of pretending to send. */
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.message + "\n\n" + d.name + " (" + d.email + ")")}`;
    status.textContent = "Your email app should open with the message ready to send.";
  }
});

/* ===== Back to top + footer year ===== */
const toTop = $("#toTop");
addEventListener("scroll", () => { toTop.hidden = scrollY < 500; }, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0 }));
$("#year").textContent = new Date().getFullYear();
