/* =========================================================
   SAFDAR ALI — Space-Themed Script (script.js)
   3D universe background + scroll linked camera + UI
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- Navigation Scroll & Menu Toggle ---------------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  // Add scroll class to navbar
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
      navToggle.classList.toggle("active", isOpen);
    });

    // Close menu when links are clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Scroll Progress Tracker ---------------- */
  const progressEl = document.getElementById("progress");
  const scrollTip = document.querySelector(".scroll-tip");
  let scrollProgress = 0;
  let smoothScrollProgress = 0;

  window.addEventListener("scroll", () => {
    if (scrollTip) {
      scrollTip.classList.toggle("hidden", window.scrollY > 50);
    }
  });

  /* ---------------- Scroll Reveal Observer ---------------- */
  const revealEls = document.querySelectorAll(".content");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------- Interactive Cursor Glow ---------------- */
  const glow = document.getElementById("cursorGlow");
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (isFinePointer && glow) {
    window.addEventListener("mousemove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  } else if (glow) {
    glow.style.display = "none";
  }

  /* ---------------- Coordinate Tracker ---------------- */
  const coordEl = document.getElementById("coordinates");
  if (coordEl) {
    window.addEventListener("mousemove", (e) => {
      const raVal = ((e.clientX / window.innerWidth) * 360 - 180).toFixed(4);
      const decVal = ((1 - e.clientY / window.innerHeight) * 180 - 90).toFixed(4);
      coordEl.textContent = `RA: ${raVal}° / DEC: ${decVal}°`;
    });
  }

  /* ---------------- Project Modals ---------------- */
  const projectsData = {
    "fingertip-freedom": {
      tag: "Computer Vision & Python",
      title: "Fingertip Freedom — Professional Edition",
      desc: "A hand-gesture virtual mouse built with Python, OpenCV, and MediaPipe hand-landmark tracking, wrapped in a themed Tkinter/ttkbootstrap desktop app. Supports cursor movement plus gesture shortcuts for click, minimize, maximize, alt-tab, screenshot, and volume control. Features a live camera feed inside the app itself, an FPS tracker, and gesture history logs.",
      github: "https://github.com/safdar0007"
    },
    "pharmacy-mgmt": {
      tag: "Flask & SQL Backend",
      title: "Pharmacy Management System",
      desc: "A pharmacy management web app built with Python (Flask), HTML, CSS, JavaScript, and a SQL database. Designed to streamline inventory listings, stock alert flags, user credential authentication, and CRUD transactions. Users can securely add, edit, or delete items and query stock logs dynamically.",
      github: "https://github.com/safdar0007"
    },
    "cafe-mgmt": {
      tag: "PHP & MySQL Full-Stack",
      title: "Cafe Management System",
      desc: "A full-stack cafe management system with an interactive HTML, CSS, and JavaScript frontend sitting on top of a robust PHP and MySQL database. Streamlines ordering, live billing receipt generation, menu database queries, inventory records, and staff management operations. Hardened for SQL integration and security bugs.",
      github: "https://github.com/safdar0007"
    }
  };

  const modalOverlay = document.getElementById("projectModal");
  const modalTag = document.getElementById("modalTag");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalGithub = document.getElementById("modalGithub");

  window.openProjectModal = function (projectId) {
    const data = projectsData[projectId];
    if (!data || !modalOverlay) return;

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalGithub.href = data.github;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable scroll when modal is open
  };

  window.closeProjectModal = function (event) {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scroll
    }
  };

  // Close modal with Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("active")) {
      window.closeProjectModal();
    }
  });

  /* ---------------- 3D Canvas Background (Three.js) ---------------- */
  const canvas = document.getElementById("universe");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02030a);
  scene.fog = new THREE.FogExp2(0x02030a, 0.018);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));
  const mainLight = new THREE.PointLight(0xffffff, 45, 100);
  mainLight.position.set(5, 4, 10);
  scene.add(mainLight);

  /* Planet Core & Wireframe Overlay */
  const planetGeo = new THREE.SphereGeometry(2.7, 64, 64);
  const planetMat = new THREE.MeshStandardMaterial({
    color: 0x151925,
    metalness: 0.85,
    roughness: 0.23
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  planet.position.set(3, 0, -3);
  scene.add(planet);

  const wireGeo = new THREE.SphereGeometry(2.82, 32, 32);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x9ca4c4,
    wireframe: true,
    transparent: true,
    opacity: 0.13
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.copy(planet.position);
  scene.add(wire);

  /* Orbit Rings */
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(3.3 + i * 0.55, 0.012, 8, 180);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.13
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(planet.position);
    ring.rotation.x = Math.PI / 2 + i * 0.25;
    ring.rotation.y = i * 0.35;
    scene.add(ring);
    rings.push(ring);
  }

  /* Distant Starfield (5000 particles) */
  const STAR_COUNT = 5000;
  const starPos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    starPos[i * 3]     = (Math.random() - 0.5) * 160;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 160;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.035,
    transparent: true,
    opacity: 0.7
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* Orbital Data Particles */
  const DATA_COUNT = 350;
  const dataPos = new Float32Array(DATA_COUNT * 3);
  for (let i = 0; i < DATA_COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 6 + Math.random() * 9;
    dataPos[i * 3]     = Math.cos(a) * r;
    dataPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    dataPos[i * 3 + 2] = Math.sin(a) * r;
  }
  const dataGeo = new THREE.BufferGeometry();
  dataGeo.setAttribute("position", new THREE.BufferAttribute(dataPos, 3));
  const dataMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.07,
    transparent: true,
    opacity: 0.5
  });
  const dataParticles = new THREE.Points(dataGeo, dataMat);
  scene.add(dataParticles);

  /* Mouse & Touch Interaction Parallax Variables */
  let mouseX = 0, mouseY = 0;
  
  function handleMove(clientX, clientY) {
    mouseX = (clientX / window.innerWidth) - 0.5;
    mouseY = (clientY / window.innerHeight) - 0.5;
  }

  window.addEventListener("mousemove", (e) => {
    handleMove(e.clientX, e.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  /* Window Resizing */
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    // Only resize WebGL canvas if width actually changes, ignoring mobile browser collapsible address bar height events
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });

  /* Animation Render Loop */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animate() {
    requestAnimationFrame(animate);

    // Compute scroll progress on every frame (bypasses mobile browser event-throttling lag on touch scroll)
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;

    // Smoothly ease the scroll progress target
    if (!prefersReducedMotion) {
      smoothScrollProgress += (scrollProgress - smoothScrollProgress) * 0.075;
    } else {
      smoothScrollProgress = scrollProgress;
    }

    // Update progress bar width smoothly
    if (progressEl) {
      progressEl.style.width = (smoothScrollProgress * 100) + "%";
    }

    if (!prefersReducedMotion) {
      planet.rotation.y += 0.0015;
      planet.rotation.x += 0.0004;
      wire.rotation.y = planet.rotation.y;
      wire.rotation.x = planet.rotation.x;
      rings.forEach((ring, i) => {
        ring.rotation.z += 0.0007 * (i + 1);
      });
      stars.rotation.y = smoothScrollProgress * 0.15;
      stars.rotation.x = smoothScrollProgress * 0.05;
      dataParticles.rotation.y += 0.0004;

      // Scroll linked camera position calculations
      const targetX = Math.sin(smoothScrollProgress * Math.PI * 2) * 4;
      const targetY = Math.cos(smoothScrollProgress * Math.PI * 2) * 2;
      const targetZ = 12 - smoothScrollProgress * 8;

      camera.position.x += (targetX + mouseX * 1.5 - camera.position.x) * 0.025;
      camera.position.y += (targetY - mouseY * 1.2 - camera.position.y) * 0.025;
      camera.position.z += (targetZ - camera.position.z) * 0.025;
      camera.rotation.z = Math.sin(smoothScrollProgress * Math.PI * 2) * 0.05;

      // Move planet core with scrolling progress smoothly
      planet.position.x = 3 - smoothScrollProgress * 8;
      planet.position.y = Math.sin(smoothScrollProgress * Math.PI * 2) * 3;
      planet.position.z = -3 + smoothScrollProgress * 4;

      wire.position.copy(planet.position);
      rings.forEach((ring) => ring.position.copy(planet.position));
    }

    renderer.render(scene, camera);
  }
  
  animate();

})();
