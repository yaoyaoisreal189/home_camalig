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
      { src: "./school layout.jpeg", desc: "Ug-ugbo Member" },
      { src: "./Seminar 11.jpg", desc: "Seminar 1" },
      { src: "./Journ Sem 11.jpg", desc: "Seminar 2" }
    ],
    sideLinks: [
      { label: "🎨 Ug-ugbo layout", url: "https://canva.link/mn1aaj2p7lw5r5o" },
      { label: "DSPC January,2025", url: "https://www.facebook.com/share/p/18Zjjwexow/" },
      { label: "DSPC December,2025", url: "https://www.facebook.com/share/p/1KXLqFAWRJ/" },
      { label: "Vanguards Member 2025", url: "https://www.facebook.com/share/1L6Z9WCZ3V/" },
      { label: "DSPC Web Layout", url: "https://20grace1130.wixsite.com/news-web" }
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
  document.getElementById('modal-img').src = imgUrl;
  document.getElementById('modal-caption').textContent = caption;
  modal.classList.add('active');
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}
