document.addEventListener("DOMContentLoaded", () => {
  const cursorDot = document.getElementById("cursor-dot");
  const cursorFollower = document.getElementById("cursor-follower");

  // 1. CUSTOM TRAILING CURSOR (0.5s DELAY)
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

  // 2. MATRIX RAIN BACKGROUND
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

  // 3. HOME DEGREE TYPEWRITER EFFECT
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

  // 4. CLICK TO ENLARGE ALL IMAGES FEATURE
  document.addEventListener("click", (e) => {
    const target = e.target;
    // Don't enlarge if clicking inside a modal or clicking tiny icon buttons inside modal buttons
    if (target.tagName === 'IMG' && !target.closest('.modal-content') && !target.classList.contains('btn-icon')) {
      const src = target.getAttribute('src');
      const alt = target.getAttribute('alt') || 'Enlarged Image Preview';
      if (src) {
        openSingleModal(src, alt);
      }
    }
  });
});

// 5. SECTION SWITCHING ENGINE
function switchSection(sectionId) {
  const sections = document.querySelectorAll('.view-section');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(sec => sec.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update navbar active state
  if (sectionId === 'home-section') navLinks[0].classList.add('active');
  if (sectionId === 'about-section') navLinks[1].classList.add('active');

  // Trigger Typing Animation when entering Hobbies
  if (sectionId === 'hobbies-section') {
    startHobbiesTyping();
  }
}

// 6. HOBBIES TYPEWRITER EFFECT
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

// 7. MODAL POPUP ENGINE
function openSingleModal(imgUrl, caption) {
  const modal = document.getElementById('single-modal');
  document.getElementById('modal-img').src = imgUrl;
  document.getElementById('modal-caption').textContent = caption;
  modal.classList.add('active');
}

function openFourModal() {
  document.getElementById('four-modal').classList.add('active');
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}