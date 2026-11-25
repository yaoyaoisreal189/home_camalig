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

  // 2. LIVE DIGITAL CLOCK & DATE (+ Cyber Portrait HUD Time)
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const hudTimeEl = document.getElementById("hud-live-time");
    if (hudTimeEl) {
      hudTimeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${minutes}:${seconds}`;
    }

    hours = hours % 12;
    hours = hours ? hours : 12;
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

  // 3. MATRIX RAIN + AUTONOMOUS MOVING RETICLE BACKGROUND
  function setupMatrixAndReticle(canvasId, fontSize = 16) {
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
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));

    const reticle = {
      x: canvas.width * 0.5,
      y: canvas.height * 0.5,
      targetX: canvas.width * 0.7,
      targetY: canvas.height * 0.35,
      angle: 0,
      radius: 56
    };

    function drawReticle() {
      const dx = reticle.targetX - reticle.x;
      const dy = reticle.targetY - reticle.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 18) {
        reticle.targetX = 120 + Math.random() * (canvas.width - 240);
        reticle.targetY = 120 + Math.random() * (canvas.height - 240);
      } else {
        reticle.x += dx * 0.025;
        reticle.y += dy * 0.025;
      }

      reticle.angle += 0.025;

      ctx.save();
      ctx.translate(reticle.x, reticle.y);

      ctx.save();
      ctx.rotate(reticle.angle);
      ctx.strokeStyle = "rgba(217, 197, 160, 0.75)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, reticle.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(-reticle.angle * 1.5);
      ctx.strokeStyle = "rgba(166, 124, 82, 0.85)";
      ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, reticle.radius * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "rgba(217, 197, 160, 0.65)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-reticle.radius - 16, 0);
      ctx.lineTo(-14, 0);
      ctx.moveTo(14, 0);
      ctx.lineTo(reticle.radius + 16, 0);
      ctx.moveTo(0, -reticle.radius - 16);
      ctx.lineTo(0, -14);
      ctx.moveTo(0, 14);
      ctx.lineTo(0, reticle.radius + 16);
      ctx.stroke();

      ctx.fillStyle = "#D9C5A0";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "11px 'Fira Code', monospace";
      ctx.fillStyle = "rgba(217, 197, 160, 0.8)";
      ctx.fillText(`SCAN [${Math.round(reticle.x)},${Math.round(reticle.y)}]`, reticle.radius + 12, -10);

      ctx.restore();
    }

    function draw() {
      ctx.fillStyle = "rgba(10, 8, 12, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      const currentCols = Math.floor(canvas.width / fontSize);
      if (currentCols !== drops.length) {
        drops = Array.from({ length: currentCols }, (_, idx) => drops[idx] || Math.floor(Math.random() * -50));
      }

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

      drawReticle();
    }
    setInterval(draw, 40);
  }

  setupMatrixAndReticle("home-matrix-canvas", 16);

  // 4. HOME DEGREE TYPEWRITER EFFECT (Starts immediately without intro)
  function startDegreeTypewriter() {
    const degreeText = "BACHELOR OF SCIENCE AND INFORMATION TECHNOLOGY MAJOR IN ENTERPRISE RESOURCE PLANNING TRACK";
    const typingElement = document.getElementById("typing-degree");
    if (!typingElement) return;
    typingElement.textContent = "";
    let charIndex = 0;

    function typeText() {
      if (charIndex < degreeText.length) {
        typingElement.textContent += degreeText.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 28);
      }
    }
    typeText();
  }

  startDegreeTypewriter();

  // 5. INITIALIZE FAMILY & FRIENDS RIBBON GALLERY
  renderFamilyGallery("all", 0);

  // 6. CLICK TO ENLARGE GENERAL IMAGES FEATURE
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target.tagName === 'IMG' &&
      !target.closest('.modal-content') &&
      !target.closest('.bento-photo-slot') &&
      !target.classList.contains('btn-icon') &&
      !target.classList.contains('no-enlarge')
    ) {
      const src = target.getAttribute('src');
      const alt = target.getAttribute('alt') || 'Enlarged Image Preview';
      if (src) {
        openSingleModal(src, alt);
      }
    }

    if (!target.closest('.theme-switcher-dropdown')) {
      const menu = document.getElementById('theme-menu');
      if (menu) menu.classList.remove('active');
    }
  });
});

// 7. SECTION TYPEWRITER HELPERS
let careerTypingTimer = null;
let hobbiesTypingTimer = null;

function runSectionTypewriters(sectionId) {
  if (sectionId === "about-section") {
    const el = document.getElementById("typing-career");
    if (el) {
      clearTimeout(careerTypingTimer);
      const text = "Aspiring BSIT — Enterprise Resource Planning Specialist | Blending Technology, Creativity & Discipline";
      el.textContent = "";
      let idx = 0;
      function stepCareer() {
        if (idx < text.length) {
          el.textContent += text.charAt(idx);
          idx++;
          careerTypingTimer = setTimeout(stepCareer, 24);
        }
      }
      stepCareer();
    }
  } else if (sectionId === "hobbies-section") {
    const el = document.getElementById("typing-hobbies");
    if (el) {
      clearTimeout(hobbiesTypingTimer);
      const text = "CREATIVE OUTLETS & HOBBIES";
      el.textContent = "";
      let idx = 0;
      function stepHobbies() {
        if (idx < text.length) {
          el.textContent += text.charAt(idx);
          idx++;
          hobbiesTypingTimer = setTimeout(stepHobbies, 32);
        }
      }
      stepHobbies();
    }
  }
}

// 8. APPLY SECTION SWITCH
function applySectionSwitch(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return;

  document.querySelectorAll(".view-section").forEach((sec) => {
    sec.classList.remove("active");
  });
  targetSection.classList.add("active");

  const activeNavTarget = sectionId === "hobbies-section" ? "about-section" : sectionId;
  document.querySelectorAll(".nav-link").forEach((btn) => {
    const onclickAttr = btn.getAttribute("onclick") || "";
    btn.classList.toggle("active", onclickAttr.includes(`'${activeNavTarget}'`));
  });

  const clockBox = document.getElementById("home-digital-clock");
  if (clockBox) {
    clockBox.classList.toggle("hidden", sectionId !== "home-section");
  }

  runSectionTypewriters(sectionId);
}

// 9. THEME SWITCHING FUNCTION
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

// 10. 2-SECOND THEME-SYNCED HUD TRANSITION WITH 50% OPACITY MOVING RETICLE
let isTransitioning = false;
let transitionFadeTimer = null;
let transitionDoneTimer = null;
let transitionRafId = null;

function getThemeAccentColor() {
  const styles = getComputedStyle(document.body);
  return styles.getPropertyValue('--gilded-champagne').trim() || '#D9C5A0';
}

function startTransitionReticleCanvas(durationMs) {
  const canvas = document.getElementById("transition-galaxy-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const accent = getThemeAccentColor();
  const start = performance.now();

  const reticle = {
    x: canvas.width * 0.5,
    y: canvas.height * 0.5,
    tx: canvas.width * 0.72,
    ty: canvas.height * 0.35,
    angle: 0,
    radius: 64
  };

  if (transitionRafId) cancelAnimationFrame(transitionRafId);

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dx = reticle.tx - reticle.x;
    const dy = reticle.ty - reticle.y;
    if (Math.hypot(dx, dy) < 20) {
      reticle.tx = 140 + Math.random() * Math.max(120, canvas.width - 280);
      reticle.ty = 120 + Math.random() * Math.max(120, canvas.height - 240);
    } else {
      reticle.x += dx * 0.05;
      reticle.y += dy * 0.05;
    }
    reticle.angle += 0.045;

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.translate(reticle.x, reticle.y);

    ctx.save();
    ctx.rotate(reticle.angle);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, reticle.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(-reticle.angle * 1.4);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, reticle.radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-reticle.radius - 18, 0);
    ctx.lineTo(-14, 0);
    ctx.moveTo(14, 0);
    ctx.lineTo(reticle.radius + 18, 0);
    ctx.moveTo(0, -reticle.radius - 18);
    ctx.lineTo(0, -14);
    ctx.moveTo(0, 14);
    ctx.lineTo(0, reticle.radius + 18);
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 11px 'Fira Code', monospace";
    ctx.fillText(`RETICLE [${Math.round(reticle.x)}, ${Math.round(reticle.y)}]`, reticle.radius + 14, -10);

    ctx.restore();

    if (elapsed < durationMs) {
      transitionRafId = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  transitionRafId = requestAnimationFrame(frame);
}

function switchSection(sectionId) {
  const currentActive = document.querySelector('.view-section.active');
  if (isTransitioning || (currentActive && currentActive.id === sectionId)) return;

  const overlay = document.getElementById("page-transition-overlay");
  if (!overlay) {
    applySectionSwitch(sectionId);
    return;
  }

  isTransitioning = true;
  clearTimeout(transitionFadeTimer);
  clearTimeout(transitionDoneTimer);

  overlay.style.transition = "opacity 1s ease";
  overlay.classList.add("active");
  startTransitionReticleCanvas(2000);

  transitionFadeTimer = setTimeout(() => {
    applySectionSwitch(sectionId);
    overlay.classList.remove("active");

    transitionDoneTimer = setTimeout(() => {
      isTransitioning = false;
    }, 1000);
  }, 1000);
}

// 11. ACHIEVEMENTS GALLERY DATA
const achievementsData = {
  "elem-edu": {
    title: "Lubas Elementary School — Educational Achievements",
    mode: "carousel",
    items: [
      { src: "./daycare accomplishment.jpg", desc: "Accomplished Daycare" },
      { src: "./Awards 2.jpg", desc: "Accomplished Preschool with Award" },
      { src: "./awards.jpg", desc: "Ranked Top 2 in Grade 1 and Top 10 consistently from Grades 2–6" },
      { src: "./diploma 1.jpg", desc: "Diploma-Elementary Graduate Year 2014-2020" }
    ]
  },
  "elem-extra": {
    title: "Lubas Elementary School — Extra-curricular Achievements",
    mode: "grid",
    items: [
      { src: "./cooking comp.jpg", desc: "Grade 6-Cooking Contest (4th place)" },
      { src: "./DAL.jpg", desc: "Strawberry Festival Drum and Lyre-Flag" },
      { src: "./singing contest.jpg", desc: "Daycare-1st Place Singing Contest Preschool-3rd Place Singing Contest" }
    ]
  },
  "jhs-edu": {
    title: "La Trinidad National Highschool — Educational Achievements",
    mode: "carousel",
    items: [
      { src: "./grade 8.jpg", desc: "Consistent Honor Student from Grade 7-10 = Grade 8 Honor Student" },
      { src: "./honor medals.png", desc: "Grade 7,9,10 Honor Student" },
      { src: "./grd 10.jpg", desc: "Grade 10 Graduation" },
      { src: "./Acad excel.jpg", desc: "Academic Excellence Award" },
      { src: "./diploma 2.jpg", desc: "Diploma-Junior Highschool Graduate 2020-2024" }
    ]
  },
  "jhs-extra": {
    title: "La Trinidad National Highschool — Extra-curricular Achievements",
    mode: "carousel",
    items: [
      { src: "./journ 9.jpeg", desc: "District School Press Conference-4th in Cartooning" },
      { src: "./cert 4.jpg", desc: "Certificate of Participation-District School Press Conference" },
      { src: "./district 9.jpeg", desc: "District-Table Tennis 2023" },
      { src: "./mural.png", desc: "Strawberry Festival Mural Painting Contest-7th Place" },
      { src: "./Talaw.jpg", desc: "Talaw Dance Competition representing La Trinidad National Highschool 2023" },
      { src: "./talawcert.jpg", desc: "Talaw Dance Certificate of Recognition" },
      { src: "./cert 3.jpg", desc: "Campus Journalism Seminar-Workshop Certificate 2022" },
      { src: "./cert 1.jpg", desc: "Campus Journalism Seminar-Workshop Certificate 2023" },
      { src: "./cert 2.jpg", desc: "Certificate of Appreciation as a Member of Technical Working Committee" },
      { src: "./district 10.jpeg", desc: "District-Table Tennis 2024" }
    ]
  },
  "shs-edu": {
    title: "King's Colleges of the Philippines — Educational Achievements",
    mode: "extended-carousel",
    items: [
      { src: "./family grad pic.png", desc: "Senior Highschool Graduation" },
      { src: "./with honors 11.jpg", desc: "Senior Highschool(Grade 11)-With Honors" },
      { src: "./grd 11 honor.jpg", desc: "Grade 11 Honor Certificate" },
      { src: "./grd 12 honor.jpg", desc: "Grade 12 Honor Certificate" },
      { src: "./special award.jpg", desc: "Special Award Certificate" },
      { src: "./diploma 3.jpg", desc: "Diploma- Senio Highschool Graduate 2024-2026" },
      { src: "./NC2.jpg", desc: "NC II Certificate of Competency" }
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
      { src: "./1.jpg", desc: "CSS Certificate 1" },
      { src: "./2.jpg", desc: "CSS Certificate 2" },
      { src: "./3.jpg", desc: "CSS Certificate 3" },
      { src: "./4.png", desc: "CSS Certificate 4" },
      { src: "./5.jpg", desc: "CSS Certificate 5" }
    ]
  },
  "shs-triq": {
    title: "Senior Highschool — TRI-Q Research Project",
    mode: "tri-project",
    parentKey: "shs-edu",
    items: [
      { src: "./process 1.jpeg", desc: "TRI-Q Project Process" },
      { src: "./process 2.jpeg", desc: "TRI-Q Project Process" },
      { src: "./process 3.jpeg", desc: "TRI-Q Project Testing" }
    ],
    fileLinks: [
      { label: "📄 TRI-Q Research Paper", url: "https://canva.link/nq9cea2132heoch" },
      { label: "📄 Extended Abstract", url: "https://canva.link/djbyvh3gnmzweq3" }
    ]
  },
  "shs-immersion": {
    title: "Senior Highschool — Work Immersion",
    mode: "carousel",
    parentKey: "shs-edu",
    items: [
      { src: "./immersion grp photo.png", desc: "Work Immersion Group Photo" },
      { src: "./WI.jpeg", desc: "Work Immersion Photo with Pines International Academy staffs" },
      { src: "./immersion 1.jpg", desc: "Work Immersion Photo" },
      { src: "./completion.jpg", desc: "Certificate of Completion given by Kings Colleges of the Philippines" },
      { src: "./completion 2.jpg", desc: "Certificate of Completion given by Pines International Academy" }
    ]
  },
  "shs-extra": {
    title: "King's Colleges of the Philippines — Extra-curricular Achievements",
    mode: "extended-carousel",
    items: [
      { src: "./intrams 11.JPG", desc: "Intramurals in Kings Colleges of the Philippines(KCP)-Table Tennis" },
      { src: "./3rd place tabletennis.png", desc: "3rd Place Intramurals-Table Tennis" },
      { src: "./bspc 11.jpg", desc: "Barangay Schools Press Conference Journalism-Layout Web Artist" },
      { src: "./bspc 1st.jpg", desc: "1st Place in Barangay Schools Press Conference-Web Layouting" },
      { src: "./dspc 11.jpg", desc: "Division Schools Press Conference Best Performing Secondary School-5th Place" },
      { src: "./dspc 12.jpeg", desc: "9th Place Division Schools Press Conference" },
      { src: "./club.jpg", desc: "Certificate of Appreciation" },
      { src: "./school concert.jpg", desc: "Grade 11 Concert in Kings Colleges of the Philippines" },
      { src: "./Trophy.jpg", desc: "Intramural Champion-Grade 12" },
      { src: "./school layout.jpeg", desc: "Ug-ugbo Member" },
      { src: "./Seminar 11.jpg", desc: "Seminar 1" },
      { src: "./Journ Sem 11.jpg", desc: "Seminar 2" }
    ],
    sideLinks: [
      { label: "🎨 Ug-ugbo layout", url: "https://canva.link/mn1aaj2p7lw5r5o" },
      { label: "DSPC January 2025", url: "https://www.facebook.com/share/p/18Zjjwexow/" },
      { label: "DSPC December 2025", url: "https://www.facebook.com/share/p/1KXLqFAWRJ/" },
      { label: "Vanguards Member 2025", url: "https://www.facebook.com/share/1L6Z9WCZ3V/" },
      { label: "DSPC Web Layout", url: "https://20grace1130.wixsite.com/news-web" },
      { label: "Intramural Champion Grade 12", url: "https://www.facebook.com/100070915232476/posts/919408283766338/?mibextid=rS40aB7S9Ucbxw6v" }
    ]
  },
  "college-edu": {
    title: "University of the Cordilleras — Educational Achievements",
    mode: "carousel",
    items: [
      { src: "./blank.jpe", desc: "Will be updated soon" }
    ]
  },
  "college-extra": {
    title: "University of the Cordilleras — Extra-curricular Achievements",
    mode: "carousel",
    items: [
      { src: "./blank.jpe", desc: "will be updated soon" }
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
  if (!modal) return;
  document.getElementById('modal-img').src = imgUrl;
  document.getElementById('modal-caption').textContent = caption;
  modal.classList.add('active');
}

// 12. FAMILY AND FRIENDS STAGGERED RIBBON GALLERY & SPLIT MODAL
const familyFriendsPhotos = [
  {
    id: 0,
    category: "Mother",
    title: "Mother — Mary Camalig",
    subtitle: "My First Teacher & Guiding Light",
    src: "./mother.jpe",
    phrase: "“A mother’s love is the quiet strength behind every dream I dare to chase.”",
    letter: "Dear Mama,\n\nThank you for bringing me into this world and giving me the chance to experience all the beauty and joy that life has to offer. From my earliest memories to this very day, you have been right by my side, guiding me as I grew up and helping me become someone capable of standing on my own two feet. Even now that I am learning to navigate life independently, I feel your constant love and care—knowing that you will always be there and will never truly let go gives me so much strength. I see and deeply appreciate every single sacrifice you have made for us. Thank you for working so hard just to make sure we always had a meal on the table every single day. I am endlessly grateful for every peso you spent to send me to school and invest in my education, as well as for the unwavering support you gave me every time I wanted to join a new sport. You never held me back; instead, you cheered me on and made sure I had what I needed to chase my passions. As I continue working toward my dreams, please know that you are my biggest motivation. When I succeed, I promise to give back everything I can so that you can finally rest, relax, and enjoy life to the fullest. More than anything, I want to make you proud and show you that you raised a daughter who would do anything for you. I love you so much, Mom. Thank you for everything."
  },
  {
    id: 1,
    category: "Father",
    title: "Father — Silang Camalig",
    subtitle: "My Pillar of Strength & Wisdom",
    src: "./father.png",
    phrase: "“Behind every confident step I take is a father who believed in me first.”",
    letter: "Dear Papa,\n\nThank you for bringing me into this world and giving me the chance to experience all the good that life has to offer. As I have grown up and learned how to stand on my own two feet, having you by my side has meant everything to me. Even now that I am becoming more independent, I still feel your quiet strength, protection, and care—knowing you are always watching out for me and never truly letting go gives me so much comfort and confidence. I see and deeply appreciate all the hard work and sacrifices you have made just to make sure we had food on the table every single day. Thank you for every peso you worked hard to earn so I could go to school and build my future, and for always supporting me whenever I wanted to join a sport. Your encouragement and belief in me have pushed me to always give my best. You are a huge part of why I strive so hard to achieve my dreams. When I become successful, I promise to give back everything I can so that you can finally rest, take it easy, and enjoy life to the fullest. Above all, I want to make you proud and show you that you raised a daughter who would do anything for you. I love you so much, Dad. Thank you for everything you have done and continue to do for me."
  },
  {
    id: 2,
    category: "Sibling",
    title: "Sister — Emerald Camalig",
    subtitle: "Lifelong Companion & Best Friend",
    src: "./sister.jpg",
    phrase: "“Side by side or miles apart, siblings are always connected by heart.”",
    letter: "To my makulit 2.me,\n\nFrom childhood laughter to growing up together, thank you for being my built-in teammate, confidant and curing my loneliness No matter where our paths take us, I will always have your back just as you have always had mine."
  },
  {
    id: 3,
    category: "Friends",
    title: "Senior Highschool bestfriends",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friends 3.jpg",
    phrase: "“Good friends make even the most ordinary days feel like a celebration.”",
    letter: "Dear Senior High friends,\n\nThank you for always bringing warmth, humor, and genuine care into our moments together. Whenever things get overwhelming at school or in life, talking and laughing with you reminds me to breathe and keep going."
  },
  {
    id: 4,
    category: "Friends",
    title: "Craziest Friends Ever",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friends 2.png",
    phrase: "“Real friendship inspires you to create, grow, and be unapologetically yourself.”",
    letter: "Dear friends,\n\nThank you for every understanding and acceptance for who I am as a friend. Being around ya'll makes it easy to stay inspired and confident in the things I love doing."
  },
  {
    id: 5,
    category: "Friends",
    title: "BESTfrrrrrienddd",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 1.jpg",
    phrase: "“A true friend stays steady when everything else feels uncertain.”",
    letter: "Dear parey,\n\nThank you for listening, understanding, and standing by me through busy schedules and tough weeks. Having someone as dependable and kind as you in my corner means more than words can say."
  },
  {
    id: 6,
    category: "Friends",
    title: "Bestfriend since Elementary",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 4.jpg",
    phrase: "“The best stories are the ones we talked about everyday.”",
    letter: "Sup bro,\n\nThank you for teaching me what a friend really is, adventures, food trips and story we’ve shared. Every memory with you adds color to my journey and gives me something to smile about whenever I look back."
  },
  {
    id: 7,
    category: "Friends",
    title: "College friends!!!",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 5.jpg",
    phrase: "“How I love the way we rock our frustrations out!!!”",
    letter: "EIWHAAAA,\n\nThank you for being my friends in college! Without you guys, I might be alone every school days. I really thank you for apporocahing me 'cause I really don't know how to start a convo. I wish we can still continue our band 𑣲𝄞Syntax Error𑣲𝄞."
  },
  {
    id: 8,
    category: "Friends",
    title: "Childhood Bestfriend",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 6.jpg",
    phrase: "“Friendship is one of life’s greatest gifts—rare, honest, and enduring.”",
    letter: "Dear Bestfriend,\n\nThank you for being my bestfriend whom I share most of my best memories even though most of it are just laughing out loud without any care where and singing out loud like crazy at the rooftop. No matter how much time passes or how busy life gets, I’m truly grateful for the friendship we share. And I hope someday we see each other again, we both are still doing well and still the best person we knew."
  },
  {
    id: 9,
    category: "Family Group Picture",
    title: "My whole guide and support from the day I was born",
    subtitle: "Click to view enlarged photo & letter",
    src: "./grp pic.png",
    phrase: "“Before the world ever knew my name, my family gave me the roots to stand tall and the wings to dream.”",
    letter: "Dear Family,\n\nFirst of all, I want to thank you for all love, patience, support, guidance, teachings and never ending care that you all given to me. I cannot name all efforts you have given me but I'am here to achieve my dreams and make you proud. I will make sure that every single thing that you all did for me, will be given back to you with love and respect. I hope you all in good health and always be safe. <3"
  }
];

let currentFamilyCategory = "all";
let currentFamilyPage = 0;
const FAMILY_SLOTS_PER_PAGE = 4;

function applyOrientationClass(imgEl) {
  const slot = imgEl.closest(".bento-photo-slot");
  if (!slot || !imgEl.naturalWidth || !imgEl.naturalHeight) return;

  if (imgEl.naturalWidth > imgEl.naturalHeight) {
    slot.classList.add("is-landscape");
    slot.classList.remove("is-portrait");
  } else {
    slot.classList.add("is-portrait");
    slot.classList.remove("is-landscape");
  }
}

function renderFamilyGallery(category = currentFamilyCategory, page = currentFamilyPage) {
  const grid = document.getElementById("editorial-bento-grid");
  const prevBtn = document.getElementById("diary-prev-btn");
  const nextBtn = document.getElementById("diary-next-btn");
  const indicator = document.getElementById("diary-page-indicator");
  if (!grid) return;

  currentFamilyCategory = category;

  const filtered = category === "all"
    ? familyFriendsPhotos
    : familyFriendsPhotos.filter(item => item.category === category);

  const totalPages = Math.max(1, Math.ceil(filtered.length / FAMILY_SLOTS_PER_PAGE));
  currentFamilyPage = Math.max(0, Math.min(page, totalPages - 1));

  const startIdx = currentFamilyPage * FAMILY_SLOTS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + FAMILY_SLOTS_PER_PAGE);

  if (indicator) indicator.textContent = `${currentFamilyPage + 1} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentFamilyPage === 0;
  if (nextBtn) nextBtn.disabled = currentFamilyPage >= totalPages - 1;

  grid.innerHTML = pageItems.map((item) => `
    <div class="bento-photo-slot is-portrait" onclick="openFamilyModal(${item.id})">
      <span class="diary-card-badge">${item.category}</span>
      <img
        src="${item.src}"
        alt="${item.title}"
        class="no-enlarge"
        onload="applyOrientationClass(this)"
      />
      <div class="diary-card-caption">
        <h4>${item.title}</h4>
        <span>${item.subtitle}</span>
      </div>
    </div>
  `).join("");
}

function stepFamilyPage(direction) {
  renderFamilyGallery(currentFamilyCategory, currentFamilyPage + direction);
}

function selectFamilyCategory(category, btnEl) {
  document.querySelectorAll('.diary-pill').forEach(p => p.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderFamilyGallery(category, 0);
}

function openFamilyModal(index) {
  const item = familyFriendsPhotos.find(p => p.id === index) || familyFriendsPhotos[index];
  if (!item) return;

  const titleEl = document.getElementById("family-modal-title");
  const mediaEl = document.getElementById("family-modal-media");
  const phraseEl = document.getElementById("family-modal-phrase");
  const paraEl = document.getElementById("family-modal-paragraph");
  const modalEl = document.getElementById("family-modal");

  if (!titleEl || !mediaEl || !phraseEl || !paraEl || !modalEl) return;

  titleEl.textContent = item.title;
  phraseEl.textContent = item.phrase;
  paraEl.textContent = item.letter;
  mediaEl.innerHTML = `<img src="${item.src}" alt="${item.title}" class="single-enlarged no-enlarge" />`;

  const textContainer = modalEl.querySelector(".family-modal-text");
  if (textContainer) textContainer.scrollTop = 0;

  modalEl.classList.add("active");
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}