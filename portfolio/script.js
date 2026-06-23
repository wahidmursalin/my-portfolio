// ============================================
// Topbar background on scroll
// ============================================
const topbar = document.getElementById("topbar");
function handleTopbarScroll(){
  topbar.classList.toggle("is-scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", handleTopbarScroll);

// ============================================
// Nav active link on scroll (scroll-spy)
// ============================================
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main > section");

function setActiveLink(){
  let current = sections[0];
  const offset = 140;
  sections.forEach(sec => {
    if(window.scrollY + offset >= sec.offsetTop){
      current = sec;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
  });
}
window.addEventListener("scroll", setActiveLink);

// ============================================
// Mobile menu toggle
// ============================================
const menuBtn = document.getElementById("menuBtn");
const navLinksEl = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  navLinksEl.classList.toggle("is-open");
});
navLinks.forEach(link => {
  link.addEventListener("click", () => navLinksEl.classList.remove("is-open"));
});

// ============================================
// Scroll-reveal animation (IntersectionObserver)
// ============================================
const revealEls = document.querySelectorAll("[data-reveal]");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(prefersReduced){
  revealEls.forEach(el => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ============================================
// Animated stat counters
// ============================================
const counters = document.querySelectorAll("[data-count]");

function animateCounter(el){
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if(progress < 1){
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(tick);
}

if(prefersReduced){
  counters.forEach(el => { el.textContent = el.dataset.count; });
} else {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => counterObserver.observe(el));
}

// ============================================
// Contact form (front-end only demo)
// ============================================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formStatus.textContent = "Message sent — I'll get back to you within a day or two.";
  contactForm.reset();
});

// ============================================
// Footer year
// ============================================
document.getElementById("year").textContent = new Date().getFullYear();

// ============================================
// Init
// ============================================
window.addEventListener("DOMContentLoaded", () => {
  handleTopbarScroll();
  setActiveLink();
});
// =========================
// CHAT OPEN / CLOSE
// =========================
function toggleChat(){
  const box = document.getElementById("chatBox");
  if(!box) return;

  if(box.style.display === "block"){
    box.style.display = "none";
  } else {
    box.style.display = "block";
  }
}

// =========================
// BOT LOGIC
// =========================
function botReply(msg){
  msg = msg.toLowerCase();

  if(msg.includes("hello")) return "Hi 👋 How can I help you?";
  if(msg.includes("portfolio")) return "Thanks for visiting my portfolio 🚀";
  if(msg.includes("project")) return "Check my GitHub 💻";
  if(msg.includes("contact")) return "You can email me anytime 📩";

  return "I’ll get back to you soon 👍";
}

// =========================
// SEND MESSAGE
// =========================
function sendMsg(){
  const input = document.getElementById("userInput");
  const messages = document.getElementById("messages");

  if(!input || !messages) return;

  let msg = input.value.trim();
  if(msg === "") return;

  // USER MESSAGE
  const userDiv = document.createElement("div");
  userDiv.className = "user";
  userDiv.innerText = "You: " + msg;
  messages.appendChild(userDiv);

  input.value = "";

  messages.scrollTop = messages.scrollHeight;

  // BOT REPLY (delay)
  setTimeout(() => {
    const botDiv = document.createElement("div");
    botDiv.className = "bot";
    botDiv.innerText = botReply(msg);
    messages.appendChild(botDiv);

    messages.scrollTop = messages.scrollHeight;
  }, 600);
}

// =========================
// ENTER KEY SUPPORT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");

  if(input){
    input.addEventListener("keydown", (e) => {
      if(e.key === "Enter"){
        sendMsg();
      }
    });
  }
});
