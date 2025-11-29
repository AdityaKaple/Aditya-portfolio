const body = document.body;
const toggleInput = document.getElementById("theme-toggle");
const backToTop = document.getElementById("back-to-top");
const navLinks = document.querySelectorAll(".nav-link");

// ===== Dark / Light toggle with localStorage =====
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.setAttribute("data-theme", "dark");
  if (toggleInput) toggleInput.checked = true;
}

if (toggleInput) {
  toggleInput.addEventListener("change", () => {
    const newTheme = toggleInput.checked ? "dark" : "light";
    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

// ===== Apple-style fade-in for hero + sections =====
window.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("animate-in");
    }, i * 180);
  });
});

// ===== IntersectionObserver for cards (float + underline animate) =====
const cards = document.querySelectorAll(".card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible", "animate-in");
      }
    });
  },
  { threshold: 0.2 }
);

cards.forEach((card) => observer.observe(card));

// ===== Subtle parallax on hero content =====
const heroContent = document.querySelector(".hero-content");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY || window.pageYOffset;

  if (heroContent) {
    const offset = scrollY * 0.06; // subtle movement
    heroContent.style.transform = `translateY(${offset}px)`;
  }

  // Back to top visibility
  if (backToTop) {
    if (scrollY > 220) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
  }

  // Update active nav links based on section
  updateActiveNavLink();
});

// ===== Back to top click =====
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== Dynamic spotlight following mouse =====
document.addEventListener("pointermove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.body.style.setProperty("--spot-x", `${x}%`);
  document.body.style.setProperty("--spot-y", `${y}%`);
});

// ===== Scroll spy for navbar (active link) =====
function updateActiveNavLink() {
  const sections = [
    { id: "about", link: document.querySelector('a[href="#about"]') },
    { id: "contact", link: document.querySelector('a[href="#contact"]') },
  ];

  const scrollPos = window.scrollY || window.pageYOffset;
  const viewportHeight = window.innerHeight;

  sections.forEach((section) => {
    const el = document.getElementById(section.id);
    if (!el || !section.link) return;

    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top + scrollPos;
    const offsetBottom = offsetTop + el.offsetHeight;

    const middle = scrollPos + viewportHeight / 2;

    if (middle >= offsetTop && middle <= offsetBottom) {
      navLinks.forEach((l) => l.classList.remove("active-link"));
      section.link.classList.add("active-link");
    }
  });
}
// ===== Contact Form: Web3Forms submit + success toast =====
const contactForm = document.querySelector(".contact-form");
const toastEl = document.getElementById("toast");
const toastMsgEl = document.getElementById("toast-message");

function showToast(message) {
  if (!toastEl || !toastMsgEl) return;
  toastMsgEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Button loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showToast("Message sent successfully!");
        contactForm.reset();
      } else {
        showToast("Something went wrong. Please try again.");
      }
    } catch (error) {
      showToast("Network error. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
