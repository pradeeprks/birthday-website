/* =========================================================
   CUSTOMIZE ME — only these lines need to change
   ========================================================= */
const HER_NAME = "Saru Bala K";
const LOVE_START_DATE = "2026-03-27 00:00:00"; // format: "YYYY-MM-DD HH:mm:ss"
const BIRTHDAY_DATE = "2026-07-27 00:00:00"; // her birthday — format: "YYYY-MM-DD HH:mm:ss"
const SITE_PASSWORD = "2707"; // 4-digit password she needs to enter to unlock the site

/* =========================================================
   SETUP
   ========================================================= */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("her-name").textContent = HER_NAME;

  initLockScreen();
  initTypedGreeting();
  initAOS();
  createStars(90);
  createFloatingHearts(32);
  initLoveCounter();
  initBirthdayCountdown();
  initEnterButton();
  initCustomCursor();
  initParallax();
});

/* =========================================================
   PASSWORD LOCK SCREEN — 4-digit gate before the gift reveals
   ========================================================= */
function initLockScreen() {
  const lockScreen = document.getElementById("lock-screen");
  const form = document.getElementById("lock-form");
  const digitsWrap = document.getElementById("lock-digits");
  const errorEl = document.getElementById("lock-error");
  const digits = Array.from(document.querySelectorAll(".lock-digit"));

  if (!lockScreen || !form || !digits.length) return;

  // Already unlocked earlier this session? Skip straight to the site.
  if (sessionStorage.getItem("giftUnlocked") === "true") {
    unlock();
    return;
  }

  digits[0].focus();

  digits.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "").slice(0, 1);
      if (input.value && index < digits.length - 1) {
        digits[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        digits[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/[^0-9]/g, "");
      pasted.slice(0, digits.length).split("").forEach((char, i) => {
        if (digits[i]) digits[i].value = char;
      });
      const nextEmpty = digits.find((d) => !d.value);
      (nextEmpty || digits[digits.length - 1]).focus();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = digits.map((d) => d.value).join("");

    if (entered.length < digits.length) {
      showError("Please enter all 4 digits.");
      return;
    }

    if (entered === SITE_PASSWORD) {
      sessionStorage.setItem("giftUnlocked", "true");
      unlock();
    } else {
      showError("That's not quite right — try again.");
      digitsWrap.classList.remove("is-shake");
      requestAnimationFrame(() => digitsWrap.classList.add("is-shake"));
      digits.forEach((d) => (d.value = ""));
      digits[0].focus();
    }
  });

  function showError(message) {
    errorEl.textContent = message;
  }

  function unlock() {
    lockScreen.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
    if (!prefersReducedMotion && typeof confetti !== "undefined") {
      confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 28,
        origin: { y: 0.4 },
        colors: ["#FF5EA8", "#B388FF", "#FFD6EC", "#ffffff"],
        scalar: 0.85,
      });
    }
    setTimeout(() => lockScreen.remove(), 700);
  }
}

/* =========================================================
   TYPED.JS — greeting typing animation
   Automatically switches from "Advance Happy Birthday" to
   "Happy Birthday" once it's actually her birthday.
   ========================================================= */
function isTodayHerBirthday() {
  const target = new Date(BIRTHDAY_DATE.replace(" ", "T"));
  if (isNaN(target.getTime())) return false;
  const now = new Date();
  return now.getMonth() === target.getMonth() && now.getDate() === target.getDate();
}

function initTypedGreeting() {
  const isBdayToday = isTodayHerBirthday();
  const greetingLine = isBdayToday ? "Happy Birthday" : "Advance Happy Birthday";

  // Also update the wish line beneath her name to match
  const wishEl = document.getElementById("hero-wish-line");
  if (wishEl) {
    wishEl.innerHTML = isBdayToday
      ? "Happy Birthday, Saru ❤️<br />Today is all about celebrating you."
      : "Advance Happy Birthday, Saru ❤️<br />Counting down the days to celebrate you.";
  }

  if (prefersReducedMotion || typeof Typed === "undefined") {
    document.getElementById("typed-text").textContent = `${greetingLine} My Love ❤️`;
    return;
  }

  new Typed("#typed-text", {
    strings: [greetingLine, "My Love ❤️"],
    typeSpeed: 50,
    backSpeed: 26,
    backDelay: 1400,
    startDelay: 200,
    loop: true,
    smartBackspace: true,
  });
}

/* =========================================================
   AOS — scroll fade-up animations
   ========================================================= */
function initAOS() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 1000,
    once: true,
    disable: prefersReducedMotion,
  });
}

/* =========================================================
   TWINKLING STARS — generated once, pure CSS animation
   ========================================================= */
function createStars(count) {
  const layer = document.getElementById("stars");
  if (!layer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = (Math.random() * 2.2 + 1).toFixed(2); // 1px - 3.2px
    const top = (Math.random() * 100).toFixed(2);
    const left = (Math.random() * 100).toFixed(2);
    const duration = (Math.random() * 3 + 2).toFixed(2); // 2s - 5s
    const delay = (Math.random() * 4).toFixed(2);
    const minOpacity = (Math.random() * 0.25 + 0.1).toFixed(2);
    const maxOpacity = (Math.random() * 0.4 + 0.6).toFixed(2);

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    star.style.setProperty("--star-min", minOpacity);
    star.style.setProperty("--star-max", maxOpacity);

    fragment.appendChild(star);
  }

  layer.appendChild(fragment);
}

/* =========================================================
   FLOATING HEARTS — generated once, pure CSS animation
   ========================================================= */
function createFloatingHearts(count) {
  const layer = document.getElementById("hearts");
  if (!layer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = "❤";
    heart.setAttribute("aria-hidden", "true");

    const size = (Math.random() * 18 + 10).toFixed(1); // 10px - 28px
    const left = (Math.random() * 100).toFixed(2);
    const duration = (Math.random() * 10 + 10).toFixed(2); // 10s - 20s
    const delay = (Math.random() * 15).toFixed(2);
    const opacity = (Math.random() * 0.4 + 0.25).toFixed(2);
    const drift = `${(Math.random() * 120 - 60).toFixed(0)}px`;

    heart.style.fontSize = `${size}px`;
    heart.style.left = `${left}%`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `-${delay}s`; /* negative delay = already mid-flight on load */
    heart.style.setProperty("--heart-opacity", opacity);
    heart.style.setProperty("--drift", drift);

    fragment.appendChild(heart);
  }

  layer.appendChild(fragment);
}

/* =========================================================
   LOVE COUNTER — updates every second, animates on change
   ========================================================= */
function initLoveCounter() {
  const startDate = new Date(LOVE_START_DATE.replace(" ", "T"));

  if (isNaN(startDate.getTime())) {
    console.warn("LOVE_START_DATE is not a valid date. Please use format YYYY-MM-DD HH:mm:ss");
    return;
  }

  const els = {
    years: document.getElementById("count-years"),
    months: document.getElementById("count-months"),
    days: document.getElementById("count-days"),
    hours: document.getElementById("count-hours"),
    minutes: document.getElementById("count-minutes"),
    seconds: document.getElementById("count-seconds"),
  };

  const previous = { years: null, months: null, days: null, hours: null, minutes: null, seconds: null };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function bump(el) {
    if (prefersReducedMotion || !el) return;
    el.classList.remove("bump");
    // Restart animation on next frame
    requestAnimationFrame(() => el.classList.add("bump"));
  }

  function calculateDiff(now) {
    // Calendar-accurate breakdown: years/months via date math, remainder in days/h/m/s
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }
    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    if (hours < 0) {
      hours += 24;
      days -= 1;
    }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return { years, months, days, hours, minutes, seconds };
  }

  function tick() {
    const now = new Date();

    if (now < startDate) {
      // Future start date: show all zeros gracefully
      els.years.textContent = 0;
      els.months.textContent = 0;
      els.days.textContent = 0;
      els.hours.textContent = "00";
      els.minutes.textContent = "00";
      els.seconds.textContent = "00";
      return;
    }

    const diff = calculateDiff(now);

    if (diff.years !== previous.years) {
      els.years.textContent = diff.years;
      bump(els.years);
      previous.years = diff.years;
    }
    if (diff.months !== previous.months) {
      els.months.textContent = diff.months;
      bump(els.months);
      previous.months = diff.months;
    }
    if (diff.days !== previous.days) {
      els.days.textContent = diff.days;
      bump(els.days);
      previous.days = diff.days;
    }
    if (diff.hours !== previous.hours) {
      els.hours.textContent = pad(diff.hours);
      bump(els.hours);
      previous.hours = diff.hours;
    }
    if (diff.minutes !== previous.minutes) {
      els.minutes.textContent = pad(diff.minutes);
      bump(els.minutes);
      previous.minutes = diff.minutes;
    }
    if (diff.seconds !== previous.seconds) {
      els.seconds.textContent = pad(diff.seconds);
      bump(els.seconds);
      previous.seconds = diff.seconds;
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* =========================================================
   BIRTHDAY COUNTDOWN — days/hours/min/sec until her birthday
   Automatically flips into a celebration state on the day itself.
   ========================================================= */
function initBirthdayCountdown() {
  const target = new Date(BIRTHDAY_DATE.replace(" ", "T"));

  if (isNaN(target.getTime())) {
    console.warn("BIRTHDAY_DATE is not a valid date. Please use format YYYY-MM-DD HH:mm:ss");
    return;
  }

  const els = {
    days: document.getElementById("bday-days"),
    hours: document.getElementById("bday-hours"),
    minutes: document.getElementById("bday-minutes"),
    seconds: document.getElementById("bday-seconds"),
    heading: document.getElementById("bday-heading"),
    sub: document.getElementById("bday-sub"),
    grid: document.querySelector(".bday-grid"),
    footnote: document.querySelector(".bday-footnote"),
  };

  if (!els.days || !els.hours || !els.minutes || !els.seconds) return;

  const previous = { days: null, hours: null, minutes: null, seconds: null };
  let celebrationFired = false;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function bump(el) {
    if (prefersReducedMotion || !el) return;
    el.classList.remove("bump");
    requestAnimationFrame(() => el.classList.add("bump"));
  }

  function getNextOccurrence(now) {
    // If the birthday date has already passed this year, roll it forward one year
    let next = new Date(target);
    if (next.getTime() <= now.getTime()) {
      next.setFullYear(next.getFullYear() + 1);
    }
    return next;
  }

  function enterCelebrationMode() {
    if (els.heading) els.heading.textContent = "🎉 Happy Birthday, Saru Bala! 🎉";
    if (els.sub) els.sub.innerHTML = "Today is your day — hope it's as wonderful as you are.";
    if (els.grid) els.grid.style.display = "none";
    if (els.footnote) els.footnote.textContent = "I'm so lucky to celebrate you today 💕";

    if (!celebrationFired) {
      celebrationFired = true;
      fireConfetti();
    }
  }

  function exitCelebrationMode() {
    if (els.heading) els.heading.textContent = "🎂 Advance Happy Birthday, Saru Bala!";
    if (els.sub) els.sub.innerHTML = 'Your special day <strong>July 27</strong> is almost here — here\'s the countdown:';
    if (els.grid) els.grid.style.display = "";
    if (els.footnote) els.footnote.textContent = "Get ready to celebrate the most amazing person I know 💕";
    celebrationFired = false;
  }

  function tick() {
    const now = new Date();

    if (isTodayHerBirthday()) {
      enterCelebrationMode();
      return;
    }

    exitCelebrationMode();

    const next = getNextOccurrence(now);
    let diffMs = next.getTime() - now.getTime();

    if (diffMs < 0) diffMs = 0;

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days !== previous.days) {
      els.days.textContent = pad(days);
      bump(els.days);
      previous.days = days;
    }
    if (hours !== previous.hours) {
      els.hours.textContent = pad(hours);
      bump(els.hours);
      previous.hours = hours;
    }
    if (minutes !== previous.minutes) {
      els.minutes.textContent = pad(minutes);
      bump(els.minutes);
      previous.minutes = minutes;
    }
    if (seconds !== previous.seconds) {
      els.seconds.textContent = pad(seconds);
      bump(els.seconds);
      previous.seconds = seconds;
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* =========================================================
   ENTER BUTTON — ripple, confetti, smooth scroll
   ========================================================= */
function initEnterButton() {
  const btn = document.getElementById("enter-btn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    spawnRipple(btn, e);
    fireConfetti();

    const target = document.getElementById("counter");
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  });
}

function spawnRipple(button, event) {
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";

  const size = Math.max(rect.width, rect.height) * 1.2;
  const x = (event.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
  const y = (event.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

function fireConfetti() {
  if (prefersReducedMotion || typeof confetti === "undefined") return;

  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 32,
    origin: { y: 0.7 },
    colors: ["#FF5EA8", "#B388FF", "#FFD6EC", "#ffffff"],
    scalar: 0.9,
  });
}

/* =========================================================
   CUSTOM CURSOR — glowing dot + trailing sparkle
   ========================================================= */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const trail = document.getElementById("cursor-trail");
  if (!dot || !trail) return;

  // Skip on touch devices / when reduced motion is requested
  if (window.matchMedia("(hover: none)").matches) return;

  let trailX = window.innerWidth / 2;
  let trailY = window.innerHeight / 2;
  let targetX = trailX;
  let targetY = trailY;

  window.addEventListener("pointermove", (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateTrail() {
    trailX += (targetX - trailX) * 0.18;
    trailY += (targetY - trailY) * 0.18;
    trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateTrail);
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(animateTrail);
  }
}

/* =========================================================
   SUBTLE PARALLAX — background blobs react to mouse movement
   ========================================================= */
function initParallax() {
  if (prefersReducedMotion || typeof gsap === "undefined") return;
  if (window.matchMedia("(hover: none)").matches) return;

  const blobs = document.querySelectorAll(".blob");
  if (!blobs.length) return;

  window.addEventListener("pointermove", (e) => {
    const xRatio = e.clientX / window.innerWidth - 0.5;
    const yRatio = e.clientY / window.innerHeight - 0.5;

    blobs.forEach((blob, index) => {
      const strength = (index + 1) * 10; // each blob reacts a little differently
      gsap.to(blob, {
        x: xRatio * strength,
        y: yRatio * strength,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  });
}
