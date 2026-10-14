// Sidebar scrollspy for case study pages
const sections = document.querySelectorAll(".case-section[id]");
const sidebarLinks = document.querySelectorAll(".case-sidebar a");

if (sections.length && sidebarLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sidebarLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Rotating tagline (homepage)
const rotatorEl = document.querySelector(".rotator-text");
if (rotatorEl) {
  const words = JSON.parse(rotatorEl.dataset.words || "[]");
  let i = 0;
  const span = document.createElement("span");
  span.className = "rotator-word";
  rotatorEl.appendChild(span);

  function showWord(index) {
    span.textContent = words[index];
    requestAnimationFrame(() => span.classList.add("is-visible"));
  }

  if (words.length) {
    showWord(0);
    setInterval(() => {
      span.classList.remove("is-visible");
      setTimeout(() => {
        i = (i + 1) % words.length;
        showWord(i);
      }, 400);
    }, 2600);
  }
}

// Flow toggles (buttons that swap a visible image/video panel)
document.querySelectorAll(".flow-toggle").forEach((toggle) => {
  const buttons = toggle.querySelectorAll(".flow-toggle-buttons button");
  const panels = toggle.querySelectorAll(".flow-toggle-panel");

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      panels[i].classList.add("is-active");
      const video = panels[i].querySelector("video");
      if (video) video.load();
    });
  });
});

// Carousel
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const dotsWrap = carousel.querySelector(".carousel-dots");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
});

// Lightbox for images & videos
const lightboxOverlay = document.createElement("div");
lightboxOverlay.className = "lightbox-overlay";
lightboxOverlay.innerHTML = '<div class="lightbox-content"></div>';
const lightboxClose = document.createElement("button");
lightboxClose.className = "lightbox-close";
lightboxClose.setAttribute("aria-label", "Close");
lightboxClose.textContent = "✕";
document.body.appendChild(lightboxOverlay);
document.body.appendChild(lightboxClose);

function openLightbox(sourceEl) {
  const content = lightboxOverlay.querySelector(".lightbox-content");
  content.innerHTML = "";
  if (sourceEl.tagName === "IMG") {
    const img = document.createElement("img");
    img.src = sourceEl.currentSrc || sourceEl.src;
    img.alt = sourceEl.alt || "";
    content.appendChild(img);
  } else if (sourceEl.tagName === "VIDEO") {
    const video = document.createElement("video");
    video.src = sourceEl.currentSrc || sourceEl.src;
    video.controls = true;
    video.autoplay = true;
    content.appendChild(video);
  }
  lightboxOverlay.classList.add("is-open");
  lightboxClose.style.display = "block";
}

function closeLightbox() {
  lightboxOverlay.classList.remove("is-open");
  lightboxClose.style.display = "none";
  const content = lightboxOverlay.querySelector(".lightbox-content");
  content.innerHTML = "";
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest(".lightbox-trigger");
  if (trigger) {
    e.preventDefault();
    openLightbox(trigger);
  }
});

lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) closeLightbox();
});
lightboxClose.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
