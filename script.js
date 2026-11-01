document.addEventListener("DOMContentLoaded", () => {
  const cursorDot = document.getElementById("cursor-dot");
  const cursorFollower = document.getElementById("cursor-follower");

  // ---------------- 1. CUSTOM TRAILING CURSOR (0.5s DELAY) ----------------
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

  // ---------------- 2. MATRIX CODE RAIN (25% OPACITY) ----------------
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

        if (Math.random() > 0.85) {
          ctx.fillStyle = "#F6E0B6";
        } else {
          ctx.fillStyle = "#A6BCC9";
        }

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

  // ---------------- 3. TYPEWRITER CODE ANIMATION ----------------
  const degreeText = "BACHELOR OF SCIENCE AND INFORMATION TECHNOLOGY MAJOR IN ENTERPRISE RESOURCE PLANNING TRACK";
  const typingElement = document.getElementById("typing-degree");
  let charIndex = 0;

  function typeText() {
    if (charIndex < degreeText.length) {
      typingElement.textContent += degreeText.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 35); // Typing speed in ms
    }
  }

  // Start typewriter effect shortly after pan entrance
  setTimeout(typeText, 400);
});