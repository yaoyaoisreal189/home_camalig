document.addEventListener("DOMContentLoaded", () => {
  const cursorDot = document.getElementById("cursor-dot");
  const cursorFollower = document.getElementById("cursor-follower");

  // 1. CUSTOM TRAILING CURSOR
  window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    if (cursorFollower) {
      cursorFollower.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
  });

  // 2. LIVE DIGITAL CLOCK & DATE
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');
    
    const timeString = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
    const timeEl = document.getElementById("clock-time");
    if (timeEl) timeEl.textContent = timeString;

    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    const dateEl = document.getElementById("clock-date");
    if (dateEl) dateEl.textContent = dateString;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 3. MATRIX RAIN BACKGROUND
  function setupMatrixRain(canvasId, fontSize = 16) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "0101010101BSITERPPARSEXMLSQLJAVAHTMLCSSJS<>/{}[]=$#@!";
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));

    function draw() {
      ctx.fillStyle = "rgba(18, 5, 15, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.85 ? "#F6E0B6" : "#A6BCC9";
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    setInterval(draw, 40);
  }

  setupMatrixRain("home-matrix-canvas", 16);

  // 4. HOME DEGREE TYPEWRITER EFFECT
  const degreeText = "BACHELOR OF SCIENCE AND INFORMATION TECHNOLOGY MAJOR IN ENTERPRISE RESOURCE PLANNING TRACK";
  const typingElement = document.getElementById("typing-degree");
  let charIndex = 0;

  function typeText() {
    if (typingElement && charIndex < degreeText.length) {
      typingElement.textContent += degreeText.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 30);
    }
  }
  setTimeout(typeText, 400);

  // 5. CLICK TO ENLARGE GENERAL IMAGES FEATURE
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target.tagName === 'IMG' &&
      !target.closest('.modal-content') &&
      !target.classList.contains('btn-icon') &&
      !target.classList.contains('no-enlarge')
    ) {
      const src = target.getAttribute('src');
      const alt = target.getAttribute('alt') || 'Enlarged Image Preview';
      if (src) {
        openSingleModal(src, alt);
      }
    }

    // Close theme menu if clicking outside
    if (!target.closest('.theme-switcher-dropdown')) {
      const menu = document.getElementById('theme-menu');
      if (menu) menu.classList.remove('active');
    }
  });
});

// 6. THEME SWITCHING FUNCTION
function toggleThemeMenu() {
  const menu = document.getElementById('theme-menu');
  if (menu) menu.classList.toggle('active');
}

function setTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  const nameSpan = document.getElementById('current-theme-name');
  if (nameSpan) {
    nameSpan.textContent = themeName.toUpperCase();
  }
  toggleThemeMenu();
}

// 7. SECTION SWITCHING ENGINE
function switchSection(sectionId) {
  const sections = document.querySelectorAll('.view-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const clockBox = document.getElementById('home-digital-clock');

  sections.forEach(sec => sec.classList.remove('active'));
  navLinks.forEach(link => {
    if (!link.closest('.theme-switcher-dropdown')) {
      link.classList.remove('active');
    }
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Show/Hide Digital Clock based on whether Home is active
  if (clockBox) {
    if (sectionId === 'home-section') {
      clockBox.classList.remove('hidden');
    } else {
      clockBox.classList.add('hidden');
    }
  }

  if (sectionId === 'home-section') navLinks[0].classList.add('active');
  if (sectionId === 'about-section') {
    navLinks[1].classList.add('active');
    startCareerTyping();
  }
  if (sectionId === 'achievements-section') navLinks[2].classList.add('active');

  if (sectionId === 'hobbies-section') {
    startHobbiesTyping();
  }
}

let careerTyped = false;
function startCareerTyping() {
  const careerText = "Aspiring UI/UX Designer dedicated to crafting intuitive, aesthetically modern digital experiences.";
  const element = document.getElementById("typing-career");
  if (!element || careerTyped) return;

  element.textContent = "";
  let i = 0;
  careerTyped = true;

  function type() {
    if (i < careerText.length) {
      element.textContent += careerText.charAt(i);
      i++;
      setTimeout(type, 30);
    }
  }
  type();
}

let hobbiesTyped = false;
function startHobbiesTyping() {
  const hobbyText = "MY HOBBIES & CREATIVE PASSIONS";
  const element = document.getElementById("typing-hobbies");
  if (!element || hobbiesTyped) return;

  element.textContent = "";
  let i = 0;
  hobbiesTyped = true;

  function type() {
    if (i < hobbyText.length) {
      element.textContent += hobbyText.charAt(i);
      i++;
      setTimeout(type, 45);
    }
  }
  type();
}

// 8. ACHIEVEMENTS GALLERY DATA
const achievementsData = {
  "elem-edu": {
    title: "Lubas Elementary School — Educational Achievements",
    mode: "carousel",
    items: [
      { src: "./cert 1.jpg", desc: "Elementary Educational Achievement 1" },
      { src: "./cert 2.jpg", desc: "Elementary Educational Achievement 2" },
      { src: "./cert 3.jpg", desc: "Elementary Educational Achievement 3" },
      { src: "./cert 4.jpg", desc: "Elementary Educational Achievement 4" }
    ]
  },
  "elem-extra": {
    title: "Lubas Elementary School — Extra-curricular Achievements",
    mode: "grid",
    items: [
      { src: "./district 10.jpeg", desc: "Elementary Extra-curricular 1" },
      { src: "./drawing.jpeg", desc: "Elementary Extra-curricular 2" }
    ]
  },
  "jhs-edu": {
    title: "La Trinidad National Highschool — Educational Achievements",
    mode: "carousel",
    items: [
      { src: "./cert 1.jpg", desc: "JHS Educational Achievement 1" },
      { src: "./cert 2.jpg", desc: "JHS Educational Achievement 2" },
      { src: "./cert 3.jpg", desc: "JHS Educational Achievement 3" },
      { src: "./cert 4.jpg", desc: "JHS Educational Achievement 4" },
      { src: "./pfp.jpeg", desc: "JHS Educational Achievement 5" }
    ]
  },
  "jhs-extra": {
    title: "La Trinidad National Highschool — Extra-curricular Achievements",
    mode: "carousel",
    items: [
      { src: "./Talaw.jpg", desc: "JHS Extra-curricular 1" },
      { src: "./talawcert.jpg", desc: "JHS Extra-curricular 2" },
      { src: "./district 10.jpeg", desc: "JHS Extra-curricular 3" },
      { src: "./mural.png", desc: "JHS Extra-curricular 4" },
      { src: "./singing contest.jpg", desc: "JHS Extra-curricular 5" },
      { src: "./cooking comp.jpg", desc: "JHS Extra-curricular 6" },
      { src: "./drawing.jpeg", desc: "JHS Extra-curricular 7" },
      { src: "./painting.jpeg", desc: "JHS Extra-curricular 8" },
      { src: "./guitar.jpeg", desc: "JHS Extra-curricular 9" },
      { src: "./singing.jpg", desc: "JHS Extra-curricular 10" }
    ]
  },
  "shs-edu": {
    title: "King's Colleges of the Philippines — Educational Achievements",
    mode: "extended-carousel",
    items: [
      { src: "./cert 1.jpg", desc: "SHS Educational Achievement 1" },
      { src: "./cert 2.jpg", desc: "SHS Educational Achievement 2" },
      { src: "./cert 3.jpg", desc: "SHS Educational Achievement 3" },
      { src: "./cert 4.jpg", desc: "SHS Educational Achievement 4" },
      { src: "./pfp.jpeg", desc: "SHS Educational Achievement 5" }
    ],
    sideButtons: [
      { label: "CSS Certificates", action: "openAchievementModal('shs-css-certs')" },
      { label: "TRI-Q Research Project", action: "openAchievementModal('shs-triq')" },
      { label: "Work Immersion", action: "openAchievementModal('shs-immersion')" }
    ]
  },
  "shs-css-certs": {
    title: "Senior Highschool — CSS Certificates",
    mode: "carousel",
    parentKey: "shs-edu",
    items: [
      { src: "./cert 1.jpg", desc: "CSS Certificate 1" },
      { src: "./cert 2.jpg", desc: "CSS Certificate 2" },
      { src: "./cert 3.jpg", desc: "CSS Certificate 3" },
      { src: "./cert 4.jpg", desc: "CSS Certificate 4" },
      { src: "./pfp.jpeg", desc: "CSS Certificate 5" }
    ]
  },
  "shs-triq": {
    title: "Senior Highschool — TRI-Q Research Project",
    mode: "tri-project",
    parentKey: "shs-edu",
    items: [
      { src: "./cert 1.jpg", desc: "TRI-Q Project Photo 1" },
      { src: "./cert 2.jpg", desc: "TRI-Q Project Photo 2" },
      { src: "./cert 3.jpg", desc: "TRI-Q Project Photo 3" }
    ],
    fileLinks: [
      { label: "📄 TRI-Q Research Paper", url: "./tri-q-research-paper.pdf" },
      { label: "📄 Extended Abstract", url: "./extended-abstract.pdf" }
    ]
  },
  "shs-immersion": {
    title: "Senior Highschool — Work Immersion",
    mode: "carousel",
    parentKey: "shs-edu",
    items: [
      { src: "./cert 4.jpg", desc: "Work Immersion Photo" }
    ]
  },
  "shs-extra": {
    title: "King's Colleges of the Philippines — Extra-curricular Achievements",
    mode: "extended-carousel",
    items: [
      { src: "./intrams 11.JPG", desc: "SHS Extra-curricular 1" },
      { src: "./medal.jpg", desc: "SHS Extra-curricular 2" },
      { src: "./school concert.jpg", desc: "SHS Extra-curricular 3" },
      { src: "./singing contest.jpg", desc: "SHS Extra-curricular 4" },
      { src: "./mural.png", desc: "SHS Extra-curricular 5" },
      { src: "./cooking comp.jpg", desc: "SHS Extra-curricular 6" },
      { src: "./drawing.jpeg", desc: "SHS Extra-curricular 7" },
      { src: "./painting.jpeg", desc: "SHS Extra-curricular 8" },
      { src: "./phtography.jpeg", desc: "SHS Extra-curricular 9" },
      { src: "./skating.jpg", desc: "SHS Extra-curricular 10" },
      { src: "./guitar.jpeg", desc: "SHS Extra-curricular 11" }
    ],
    sideLinks: [
      { label: "🎨 Ug-ugbo layout", url: "https://www.canva.com" }
    ]
  },
  "college-edu": {
    title: "University of the Cordilleras — Educational Achievements",
    mode: "carousel",
    items: [
      { src: "./cert 3.jpg", desc: "College Educational Achievement" }
    ]
  },
  "college-extra": {
    title: "University of the Cordilleras — Extra-curricular Achievements",
    mode: "carousel",
    items: [
      { src: "./school concert.jpg", desc: "College Extra-curricular Achievement" }
    ]
  }
};

let currentAchKey = null;
let currentSlideIndex = 0;

function openAchievementModal(categoryKey) {
  const data = achievementsData[categoryKey];
  if (!data) return;

  currentAchKey = categoryKey;
  currentSlideIndex = 0;

  const modalBox = document.getElementById("ach-modal-box");
  if (modalBox) {
    if (data.mode === "extended-carousel" || data.mode === "tri-project") {
      modalBox.classList.add("extended-modal");
    } else {
      modalBox.classList.remove("extended-modal");
    }
  }

  document.getElementById("ach-modal-title").textContent = data.title;
  renderAchievementModalContent();
  document.getElementById("achievement-gallery-modal").classList.add("active");
}

function renderAchievementModalContent() {
  const data = achievementsData[currentAchKey];
  const bodyEl = document.getElementById("ach-modal-body");
  if (!data || !bodyEl) return;

  const backToParentHtml = data.parentKey
    ? `<div class="submodal-top-bar"><button class="submodal-back-btn" onclick="openAchievementModal('${data.parentKey}')">&#8592; Back</button></div>`
    : "";

  if (data.mode === "carousel") {
    const item = data.items[currentSlideIndex];
    const showNav = data.items.length > 1;
    bodyEl.innerHTML = `
      ${backToParentHtml}
      <div class="carousel-wrapper">
        <img src="${item.src}" alt="Achievement Photo" />
        <p class="photo-description">${item.desc}</p>
        ${showNav ? `
          <div class="carousel-controls">
            <button class="carousel-nav-btn" onclick="changeAchievementSlide(-1)">&#8592; PREV</button>
            <span class="carousel-counter">${currentSlideIndex + 1} / ${data.items.length}</span>
            <button class="carousel-nav-btn" onclick="changeAchievementSlide(1)">NEXT &#8594;</button>
          </div>
        ` : ""}
      </div>
    `;
  } else if (data.mode === "extended-carousel") {
    const item = data.items[currentSlideIndex];
    const showNav = data.items.length > 1;

    let sideHtml = "";
    if (data.sideButtons) {
      sideHtml = data.sideButtons.map(btn => `<button class="side-action-btn" onclick="${btn.action}">${btn.label}</button>`).join("");
    }
    if (data.sideLinks) {
      sideHtml += data.sideLinks.map(link => `<a href="${link.url}" target="_blank" class="side-action-btn">${link.label}</a>`).join("");
    }

    bodyEl.innerHTML = `
      <div class="extended-modal-layout">
        <div class="carousel-wrapper">
          <img src="${item.src}" alt="Achievement Photo" />
          <p class="photo-description">${item.desc}</p>
          ${showNav ? `
            <div class="carousel-controls">
              <button class="carousel-nav-btn" onclick="changeAchievementSlide(-1)">&#8592; PREV</button>
              <span class="carousel-counter">${currentSlideIndex + 1} / ${data.items.length}</span>
              <button class="carousel-nav-btn" onclick="changeAchievementSlide(1)">NEXT &#8594;</button>
            </div>
          ` : ""}
        </div>
        <div class="extended-side-panel">
          <span class="side-panel-label">Highlights & Projects</span>
          ${sideHtml}
        </div>
      </div>
    `;
  } else if (data.mode === "tri-project") {
    const cardsHtml = data.items.map(item => `
      <div class="tri-photo-item">
        <img src="${item.src}" alt="TRI-Q Project Photo" />
        <p class="photo-description">${item.desc}</p>
      </div>
    `).join("");

    const linksHtml = (data.fileLinks || []).map(link => `
      <a href="${link.url}" target="_blank" class="project-file-btn">${link.label}</a>
    `).join("");

    bodyEl.innerHTML = `
      ${backToParentHtml}
      <div class="tri-photo-grid">${cardsHtml}</div>
      <div class="project-links-row">${linksHtml}</div>
    `;
  } else {
    const cardsHtml = data.items.map(item => `
      <div class="dual-photo-item">
        <img src="${item.src}" alt="Achievement Photo" />
        <p class="photo-description">${item.desc}</p>
      </div>
    `).join("");

    bodyEl.innerHTML = `<div class="dual-photo-grid">${cardsHtml}</div>`;
  }
}

function changeAchievementSlide(direction) {
  const data = achievementsData[currentAchKey];
  if (!data) return;
  const total = data.items.length;
  currentSlideIndex = (currentSlideIndex + direction + total) % total;
  renderAchievementModalContent();
}

function openSingleModal(imgUrl, caption) {
  const modal = document.getElementById('single-modal');
  document.getElementById('modal-img').src = imgUrl;
  document.getElementById('modal-caption').textContent = caption;
  modal.classList.add('active');
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}