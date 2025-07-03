// Slider functionality
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

setInterval(nextSlide, 6000);

// Mobile menu functionality
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

function toggleMobileMenu() {
  mobileMenu.classList.toggle("active");
}

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
}

mobileMenuBtn.addEventListener("click", toggleMobileMenu);
mobileMenuClose.addEventListener("click", closeMobileMenu);

// Close mobile menu when clicking on nav links
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    closeMobileMenu();
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Scroll progress indicator
function updateScrollProgress() {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;

  scrollIndicator.style.transform = `scaleX(${scrollPercent})`;
}

// Header background on scroll
function updateHeaderOnScroll() {
  const header = document.querySelector("header");
  const scrollTop = window.pageYOffset;

  if (scrollTop > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "none";
  }
}

// Fade in animation on scroll
const observerOptions = {
  threshold: 0.2,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// (수정) 애니메이션 적용 대상을 새로운 클래스에 맞게 변경
document
  .querySelectorAll(
    ".feature-section, .history-section, .contact-section, .timeline-item, .social-card"
  )
  .forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

// Parallax effect for hero section
function updateParallax() {
  const scrollTop = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroHeight = hero.offsetHeight;

  if (scrollTop < heroHeight) {
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide) => {
      slide.style.transform = `translateY(${scrollTop * 0.5}px)`;
    });
  }
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu
  if (e.key === "Escape") {
    closeMobileMenu();
  }
});

// Performance optimization: throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
  updateScrollProgress();
  updateHeaderOnScroll();
  updateParallax();
}, 16); // ~60fps

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Add initial animations
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(50px)";

    setTimeout(() => {
      heroContent.style.transition = "all 1s ease-out";
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 500);
  }

  // Preload next slide images
  slides.forEach((slide, index) => {
    if (index > 0) {
      const bgImage = slide.style.backgroundImage;
      const imageUrl = bgImage.slice(
        bgImage.indexOf('url("') + 5,
        bgImage.lastIndexOf('")')
      );
      const img = new Image();
      img.src = imageUrl;
    }
  });
});
