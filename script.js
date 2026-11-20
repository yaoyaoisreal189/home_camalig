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

  // 3. GOLD & BLACK CIRCUIT BOARD INTRO WITH "Info Tech Data" CPU + RETICLE
  function startGalaxyIntro() {
    const introOverlay = document.getElementById("intro-overlay");
    const canvas = document.getElementById("circuit-intro-canvas");
    const statusText = document.getElementById("intro-status-text");
    const progressFill = document.getElementById("intro-progress-fill");
    const progressPercent = document.getElementById("intro-progress-percent");
    const mainContent = document.getElementById("main-app-content");

    if (!introOverlay || !canvas) {
      startDegreeTypewriter();
      return;
    }

    const ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const INTRO_DURATION_MS = 2200;
    const startTime = performance.now();
    let completed = false;
    let animationActive = true;

    const traceCount = 34;
    const traces = Array.from({ length: traceCount }, (_, idx) => {
      const baseAngle = (idx / traceCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      const maxRadius = Math.max(canvas.width, canvas.height) * (0.48 + Math.random() * 0.16);
      const innerRadius = 68;
      const midRadius = innerRadius + (maxRadius - innerRadius) * (0.35 + Math.random() * 0.3);
      const bendOffset = (Math.random() - 0.5) * 0.24;

      return {
        baseAngle,
        bendAngle: baseAngle + bendOffset,
        innerRadius,
        midRadius,
        maxRadius,
        lineWidth: idx % 3 === 0 ? 2.6 : 1.5,
        pulseSpeed: 0.45 + Math.random() * 0.55,
        pulsePhase: Math.random(),
        hasPin: idx % 2 === 0
      };
    });

    function getPointOnTrace(trace, t, cx, cy) {
      const clampedT = Math.max(0, Math.min(1, t));
      let r, angle;

      if (clampedT < 0.55) {
        const localT = clampedT / 0.55;
        r = trace.maxRadius - (trace.maxRadius - trace.midRadius) * localT;
        angle = trace.baseAngle + (trace.bendAngle - trace.baseAngle) * Math.min(1, localT * 1.2);
      } else {
        const localT = (clampedT - 0.55) / 0.45;
        r = trace.midRadius - (trace.midRadius - trace.innerRadius) * localT;
        angle = trace.bendAngle + (trace.baseAngle - trace.bendAngle) * localT;
      }

      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r
      };
    }

    function drawIntroReticle(cx, cy, now) {
      const angle = now * 0.0018;
      const outerR = 138;
      const innerR = 96;

      ctx.save();
      ctx.translate(cx, cy);

      ctx.save();
      ctx.rotate(angle);
      ctx.strokeStyle = "rgba(217, 197, 160, 0.72)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([18, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(-angle * 1.4);
      ctx.strokeStyle = "rgba(166, 124, 82, 0.85)";
      ctx.lineWidth = 1.4;
      ctx.setLineDash([8, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "rgba(246, 224, 182, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-outerR - 22, 0);
      ctx.lineTo(-innerR + 12, 0);
      ctx.moveTo(innerR - 12, 0);
      ctx.lineTo(outerR + 22, 0);
      ctx.moveTo(0, -outerR - 22);
      ctx.lineTo(0, -innerR + 12);
      ctx.moveTo(0, innerR - 12);
      ctx.lineTo(0, outerR + 22);
      ctx.stroke();

      ctx.font = "bold 11px 'Fira Code', monospace";
      ctx.fillStyle = "rgba(246, 224, 182, 0.85)";
      ctx.fillText("SYS.RETICLE // LOCKED", outerR + 14, -8);

      ctx.restore();
    }

    function drawCircuitBoard(now, progressRatio) {
      ctx.fillStyle = "rgba(4, 4, 4, 0.28)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 24;
      const burstScale = completed ? 1 + (progressRatio - 1) * 1.8 : 1;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(burstScale, burstScale);
      ctx.translate(-cx, -cy);

      [115, 195, 285].forEach((ringR, i) => {
        ctx.strokeStyle = `rgba(166, 124, 82, ${0.14 - i * 0.03})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
      });

      for (const trace of traces) {
        const pOuter = getPointOnTrace(trace, 0, cx, cy);
        const pMid = getPointOnTrace(trace, 0.55, cx, cy);
        const pInner = getPointOnTrace(trace, 1, cx, cy);

        ctx.strokeStyle = completed
          ? "rgba(246, 224, 182, 0.75)"
          : "rgba(166, 124, 82, 0.36)";
        ctx.lineWidth = trace.lineWidth;
        ctx.beginPath();
        ctx.moveTo(pOuter.x, pOuter.y);
        ctx.lineTo(pMid.x, pMid.y);
        ctx.lineTo(pInner.x, pInner.y);
        ctx.stroke();

        if (trace.hasPin) {
          ctx.fillStyle = "#D9C5A0";
          ctx.beginPath();
          ctx.arc(pMid.x, pMid.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        const pulseT = ((now / 1000) * trace.pulseSpeed + trace.pulsePhase) % 1;
        const pulsePos = getPointOnTrace(trace, pulseT, cx, cy);

        const glow = ctx.createRadialGradient(pulsePos.x, pulsePos.y, 0, pulsePos.x, pulsePos.y, 12);
        glow.addColorStop(0, "rgba(255, 241, 206, 0.95)");
        glow.addColorStop(0.5, "rgba(217, 197, 160, 0.45)");
        glow.addColorStop(1, "rgba(217, 197, 160, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pulsePos.x, pulsePos.y, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      drawIntroReticle(cx, cy, now);

      const chipSize = 104;
      const chipHalf = chipSize / 2;

      ctx.fillStyle = "#D9C5A0";
      for (let i = -3; i <= 3; i++) {
        const offset = i * 12;
        ctx.fillRect(cx + offset - 2, cy - chipHalf - 9, 4, 8);
        ctx.fillRect(cx + offset - 2, cy + chipHalf + 1, 4, 8);
        ctx.fillRect(cx - chipHalf - 9, cy + offset - 2, 8, 4);
        ctx.fillRect(cx + chipHalf + 1, cy + offset - 2, 8, 4);
      }

      ctx.fillStyle = "#090909";
      ctx.strokeStyle = "#D9C5A0";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(cx - chipHalf, cy - chipHalf, chipSize, chipSize, 10);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "rgba(217, 197, 160, 0.55)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(cx - chipHalf + 10, cy - chipHalf + 10, chipSize - 20, chipSize - 20);

      ctx.font = "bold 11.5px 'Fira Code', monospace";
      ctx.fillStyle = "#F6E0B6";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Info Tech", cx, cy - 8);
      ctx.fillStyle = "#D9C5A0";
      ctx.font = "bold 11.5px 'Fira Code', monospace";
      ctx.fillText("Data", cx, cy + 9);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";

      ctx.restore();
    }

    function tick(now) {
      if (!animationActive) return;

      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / INTRO_DURATION_MS);
      const percentValue = Math.round(rawProgress * 100);

      if (progressFill) progressFill.style.width = `${percentValue}%`;
      if (progressPercent) progressPercent.textContent = `${percentValue}%`;

      drawCircuitBoard(now, rawProgress);

      if (rawProgress < 1) {
        requestAnimationFrame(tick);
      } else if (!completed) {
        completed = true;
        if (statusText) {
          statusText.textContent = "Success";
          statusText.classList.add("success");
        }

        setTimeout(() => {
          introOverlay.classList.add("exploded");
          if (mainContent) {
            mainContent.classList.add("pan-reveal");
          }
          startDegreeTypewriter();

          setTimeout(() => {
            animationActive = false;
            introOverlay.style.display = "none";
          }, 950);
        }, 450);
      }
    }

    requestAnimationFrame(tick);
  }

  // 4. MATRIX RAIN + AUTONOMOUS MOVING RETICLE BACKGROUND
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

  // 5. HOME DEGREE TYPEWRITER EFFECT
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

  startGalaxyIntro();

  // 6. INITIALIZE FAMILY & FRIENDS 8-PHOTO CASCADING CAROUSEL
  renderFamilyCarousel();

  // 7. CLICK TO ENLARGE GENERAL IMAGES FEATURE
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target.tagName === 'IMG' &&
      !target.closest('.modal-content') &&
      !target.closest('.diary-card') &&
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

// 8. SECTION TYPEWRITER HELPERS
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

// 9. APPLY SECTION SWITCH
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

// 10. THEME SWITCHING FUNCTION
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

// 11. 2-SECOND FADE IN / FADE OUT PAGE TRANSITION ENGINE
let isTransitioning = false;
let transitionFadeTimer = null;
let transitionDoneTimer = null;

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

  // Phase 1 (0ms -> 1000ms): Fade out into overlay
  overlay.style.transition = "opacity 1s ease";
  overlay.classList.add("active");

  // Swap section at 1000ms and Phase 2 (1000ms -> 2000ms): Fade back in
  transitionFadeTimer = setTimeout(() => {
    applySectionSwitch(sectionId);
    overlay.classList.remove("active");

    transitionDoneTimer = setTimeout(() => {
      isTransitioning = false;
    }, 1000);
  }, 1000);
}

// 12. ACHIEVEMENTS GALLERY DATA
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

// 13. FAMILY AND FRIENDS 8-PHOTO GALLERY & INDIVIDUAL ENLARGED SPLIT MODAL
const familyFriendsPhotos = [
  {
    id: 0,
    category: "Mother",
    title: "Mother — Mary Camalig",
    subtitle: "My First Teacher & Guiding Light",
    src: "./mother.jpe",
    phrase: "“A mother’s love is the quiet strength behind every dream I dare to chase.”",
    letter: "Dear Mama,\n\nThank you for your endless patience, sacrifices, and unconditional love. Through every late-night study session and every milestone I have reached, your encouragement has been my anchor. Everything I am today starts with the kindness and resilience you taught me."
  },
  {
    id: 1,
    category: "Father",
    title: "Father — Silang Camalig",
    subtitle: "My Pillar of Strength & Wisdom",
    src: "./father.jpe",
    phrase: "“Behind every confident step I take is a father who believed in me first.”",
    letter: "Dear Papa,\n\nThank you for always working hard for our family and teaching me the value of perseverance, humility, and integrity. No matter how challenging life gets, knowing you are always there gives me the courage to keep pushing forward."
  },
  {
    id: 2,
    category: "Sibling",
    title: "My Sibling",
    subtitle: "Lifelong Companion & Best Friend",
    src: "./sister.jpg",
    phrase: "“Side by side or miles apart, siblings are always connected by heart.”",
    letter: "To my sibling,\n\nFrom childhood laughter to growing up together, thank you for being my built-in teammate and confidant. No matter where our paths take us, I will always have your back just as you have always had mine."
  },
  {
    id: 3,
    category: "Friends",
    title: "<3",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friends 3.jpg",
    phrase: "“Good friends make even the most ordinary days feel like a celebration.”",
    letter: "Dear Friend 1,\n\nThank you for always bringing warmth, humor, and genuine care into our moments together. Whenever things get overwhelming at school or in life, talking and laughing with you reminds me to breathe and keep going."
  },
  {
    id: 4,
    category: "Friends",
    title: "Childhood and ",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friends 2.png",
    phrase: "“Real friendship inspires you to create, grow, and be unapologetically yourself.”",
    letter: "Dear Friend 2,\n\nThank you for encouraging my art, music, and ideas without hesitation. Being around you makes it easy to stay inspired and confident in the things I love doing."
  },
  {
    id: 5,
    category: "Friends",
    title: "",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 1.jpg",
    phrase: "“A true friend stays steady when everything else feels uncertain.”",
    letter: "Dear Friend 3,\n\nThank you for listening, understanding, and standing by me through busy schedules and tough weeks. Having someone as dependable and kind as you in my corner means more than words can say."
  },
  {
    id: 6,
    category: "Friends",
    title: "",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 4.jpg",
    phrase: "“The best stories are the ones we write together along the way.”",
    letter: "Dear Friend 4,\n\nThank you for every random walk, hangout, and story we’ve shared. Every memory with you adds color to my journey and gives me something to smile about whenever I look back."
  },
  {
    id: 7,
    category: "Friends",
    title: "",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 5.jpg",
    phrase: "“Friendship is one of life’s greatest gifts—rare, honest, and enduring.”",
    letter: "Dear Friend 5,\n\nThank you for the kindness, loyalty, and memories we’ve built together. No matter how much time passes or how busy life gets, I’m truly grateful for the friendship we share."
  }
  {
    id: 8,
    category: "Friends",
    title: "Childhood Friend",
    subtitle: "Click to view enlarged photo & letter",
    src: "./friend 6.jpg",
    phrase: "“Friendship is one of life’s greatest gifts—rare, honest, and enduring.”",
    letter: "Dear Bestfriend 5,\n\nThank you for the kindness, loyalty, and memories we’ve built together. No matter how much time passes or how busy life gets, I’m truly grateful for the friendship we share. And I hope someday we see each other again, we both are still doing well and still the best person we knew."
  }
  {
    id: 9,
    category: "Family Group Picture",
    title: "My whole guide and support from the day I was born",
    subtitle: "Click to view enlarged photo & letter",
    src: "./grp pic.png",
    phrase: "“Friendship is one of life’s greatest gifts—rare, honest, and enduring.”",
    letter: "Dear Family 5,\n\nFirst of all, I want to thank you for all love, patience, support, guidance, teachings and never ending care that you all given to me. I cannot name all efforts you have given me but I'am here to achieve my dreams and make you proud. I will make sure that every single thing that you all did for me, will be given back to you with love and respect. I hope you all in good health and always be safe. <3"
  }
];

let activeFamilyIndex = 0;

function renderFamilyCarousel() {
  const stage = document.getElementById("diary-carousel-stage");
  if (!stage) return;

  const total = familyFriendsPhotos.length;

  stage.innerHTML = familyFriendsPhotos.map((item, idx) => {
    let diff = idx - activeFamilyIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    let slotClass = "slot-hidden";
    if (diff === 0) slotClass = "slot-center";
    else if (diff === -1) slotClass = "slot-left-1";
    else if (diff === 1) slotClass = "slot-right-1";
    else if (diff === -2) slotClass = "slot-left-2";
    else if (diff === 2) slotClass = "slot-right-2";

    return `
      <div class="diary-card ${slotClass}" onclick="handleFamilyCardClick(${idx})">
        <span class="diary-card-badge">${item.category}</span>
        <img src="${item.src}" alt="${item.title}" class="no-enlarge" />
        <div class="diary-card-caption">
          <h4>${item.title}</h4>
          <span>${item.subtitle}</span>
        </div>
      </div>
    `;
  }).join("");

  const currentCat = familyFriendsPhotos[activeFamilyIndex].category;
  document.querySelectorAll('.diary-pill').forEach(pill => {
    const pillCat = pill.getAttribute('data-category');
    pill.classList.toggle('active', pillCat === currentCat);
  });
}

function selectFamilyCategory(category, btnEl) {
  document.querySelectorAll('.diary-pill').forEach(p => p.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  if (category === "all") {
    activeFamilyIndex = 0;
  } else {
    const foundIdx = familyFriendsPhotos.findIndex(item => item.category === category);
    if (foundIdx !== -1) {
      activeFamilyIndex = foundIdx;
    }
  }
  renderFamilyCarousel();
}

function stepFamilyCarousel(direction) {
  const total = familyFriendsPhotos.length;
  activeFamilyIndex = (activeFamilyIndex + direction + total) % total;
  renderFamilyCarousel();
}

function handleFamilyCardClick(index) {
  if (index !== activeFamilyIndex) {
    activeFamilyIndex = index;
    renderFamilyCarousel();
  }
  openFamilyModal(index);
}

function openFamilyModal(index) {
  const item = familyFriendsPhotos[index];
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

  modalEl.classList.add("active");
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}