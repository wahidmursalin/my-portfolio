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


function toggleChat() {
  const chatBox = document.getElementById("chatBox");
  if (!chatBox) return;
  chatBox.style.display = (chatBox.style.display === "none" || chatBox.style.display === "") ? "flex" : "none";
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMsg();
  }
}

async function sendMsg() {
  const inputField = document.getElementById("userInput");
  const messageText = inputField.value.trim();
  if (!messageText) return;

  // ইউজারের মেসেজ স্ক্রিনে দেখানো
  appendMessage(messageText, "user-message");
  inputField.value = "";

  // বটের থিংকিং স্টেট তৈরি করা
  const thinkingId = appendMessage("Thinking...", "bot-message");

  try {
    // আমাদের লোকাল নোড সার্ভারে (server.js) রিকোয়েস্ট পাঠানো হচ্ছে
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messageText // আমাদের server.js এই 'message' কি-টি এক্সপেক্ট করে
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // server.js থেকে রিটার্ন করা 'reply' স্ক্রিনে দেখানো হচ্ছে
    if (data.reply) {
      document.getElementById(thinkingId).innerText = data.reply;
    } else if (data.error) {
      document.getElementById(thinkingId).innerText = "Error: " + data.error;
    } else {
      document.getElementById(thinkingId).innerText = "No response received from Server.";
    }

  } catch (error) {
    console.error("Error Details:", error);
    document.getElementById(thinkingId).innerText = "Error: " + error.message;
  }
}

// চ্যাটে মেসেজ অ্যাপেন্ড করার ফাংশন
function appendMessage(text, className) {
  const messageContainer = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  const messageId = "msg-" + Date.now();
  
  messageDiv.id = messageId;
  messageDiv.className = `message ${className}`;
  messageDiv.innerText = text;
  
  messageContainer.appendChild(messageDiv);
  messageContainer.scrollTop = messageContainer.scrollHeight; 
  
  return messageId;
}

