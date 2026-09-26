/* =========================================================
   ENGLISH PATHSHALA — JAVASCRIPT
   SaaS Interactions, Real-Time Filter, Lead Capture
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const WHATSAPP_PHONE = "917003876568";

  /* =======================================================
     1. MOBILE NAVIGATION
     ======================================================= */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function openMobileMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add("open");
    menuToggle.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav link
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  /* =======================================================
     2. UNIVERSAL MODAL SYSTEM
     ======================================================= */
  function openModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;
    modalEl.classList.add("active");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("active");
    modalEl.setAttribute("aria-hidden", "true");

    const anyActive = document.querySelector(".modal.active");
    if (!anyActive) {
      document.body.classList.remove("modal-open");
    }
  }

  // Handle all modal close triggers
  document.querySelectorAll(".modal").forEach(modal => {
    modal.querySelectorAll("[data-modal-close], .modal-close").forEach(btn => {
      btn.addEventListener("click", () => closeModal(modal));
    });
  });

  // Close active modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach(m => closeModal(m));
    }
  });

  /* =======================================================
     3. INTERACTIVE TARGET SCORE PLANNER
     ======================================================= */
  const planExamBtns = document.querySelectorAll(".plan-exam-btn");
  const plannerScoresContainer = document.getElementById("plannerScores");
  const outDuration = document.getElementById("outDuration");
  const outMocks = document.getElementById("outMocks");
  const outBatch = document.getElementById("outBatch");
  const plannerCTA = document.getElementById("plannerCTA");

  const examData = {
    ielts: {
      name: "IELTS Academic",
      scores: [
        { label: "Band 6.5", duration: "3 - 4 Weeks", mocks: "6 Full Mock Tests", batch: "Evening (7:30 PM)" },
        { label: "Band 7.0", duration: "4 - 6 Weeks", mocks: "8 Full Mock Tests", batch: "Evening (7:30 PM)" },
        { label: "Band 7.5", duration: "6 - 8 Weeks", mocks: "10 Full Mock Tests", batch: "Weekend Intensive (10 AM)" },
        { label: "Band 8.0+", duration: "8 Weeks", mocks: "12 Full Mocks + 1-on-1", batch: "1-on-1 Private Mentorship" }
      ]
    },
    pte: {
      name: "PTE Academic",
      scores: [
        { label: "65+ (Proficient)", duration: "3 - 4 Weeks", mocks: "6 AI Software Mocks", batch: "Weekday Evening (7:30 PM)" },
        { label: "79+ (Superior)", duration: "4 - 6 Weeks", mocks: "10 AI Software Mocks", batch: "Weekend Intensive (10 AM)" },
        { label: "85+ (Near Perfect)", duration: "6 - 8 Weeks", mocks: "12 AI Mocks + Rhythm Drills", batch: "1-on-1 Private Mentorship" }
      ]
    },
    oet: {
      name: "OET Healthcare",
      scores: [
        { label: "Grade B (350+)", duration: "4 - 6 Weeks", mocks: "8 Clinical Case Letters", batch: "Late Evening Batch (9:00 PM)" },
        { label: "Grade A (450+)", duration: "6 - 8 Weeks", mocks: "12 Clinical Consultations", batch: "Weekend Intensive (Shift-friendly)" }
      ]
    },
    celpip: {
      name: "CELPIP General",
      scores: [
        { label: "CLB 7 - 8", duration: "3 - 4 Weeks", mocks: "6 Express Entry Mocks", batch: "Weekday Evening (7:30 PM)" },
        { label: "CLB 9 - 10+", duration: "5 - 7 Weeks", mocks: "10 Express Entry Mocks", batch: "Weekend Intensive (10 AM)" }
      ]
    }
  };

  let currentExamKey = "ielts";
  let currentScoreIdx = 2; // Default Band 7.5

  function updatePlannerUI() {
    const data = examData[currentExamKey];
    if (!data) return;

    if (currentScoreIdx >= data.scores.length) {
      currentScoreIdx = data.scores.length - 1;
    }

    const activeScore = data.scores[currentScoreIdx];
    if (outDuration) outDuration.textContent = activeScore.duration;
    if (outMocks) outMocks.textContent = activeScore.mocks;
    if (outBatch) outBatch.textContent = activeScore.batch;

    if (plannerCTA) {
      plannerCTA.onclick = (e) => {
        const courseSelect = document.getElementById("course");
        if (courseSelect) {
          for (let i = 0; i < courseSelect.options.length; i++) {
            if (courseSelect.options[i].value.toLowerCase().includes(data.name.split(" ")[0].toLowerCase())) {
              courseSelect.selectedIndex = i;
              break;
            }
          }
        }
      };
    }
  }

  function renderScoreButtons() {
    if (!plannerScoresContainer) return;
    plannerScoresContainer.innerHTML = "";
    const data = examData[currentExamKey];
    if (!data) return;

    data.scores.forEach((s, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `plan-score-btn ${idx === currentScoreIdx ? "active" : ""}`;
      btn.textContent = s.label;
      btn.addEventListener("click", () => {
        currentScoreIdx = idx;
        plannerScoresContainer.querySelectorAll(".plan-score-btn").forEach((b, i) => {
          b.classList.toggle("active", i === idx);
        });
        updatePlannerUI();
      });
      plannerScoresContainer.appendChild(btn);
    });

    updatePlannerUI();
  }

  planExamBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const exam = btn.dataset.exam;
      if (!exam || !examData[exam]) return;

      currentExamKey = exam;
      planExamBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentScoreIdx = Math.min(currentScoreIdx, examData[exam].scores.length - 1);
      renderScoreButtons();
    });
  });

  // Initial render of Score Planner
  if (plannerScoresContainer) {
    renderScoreButtons();
  }

  /* =======================================================
     4. SAAS INTERACTIVE COURSE FILTER TABS
     ======================================================= */
  const filterTabs = document.querySelectorAll(".filter-tab");
  const courseCards = document.querySelectorAll(".course-card");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter || "all";

      // Update active tab state
      filterTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Filter course cards
      courseCards.forEach(card => {
        const categories = (card.dataset.category || "").split(" ");
        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* =======================================================
     5. COURSE DETAILS MODAL
     ======================================================= */
  const modalCourseTitle = document.getElementById("modalCourseTitle");
  const modalDuration = document.getElementById("modalDuration");
  const modalScore = document.getElementById("modalScore");
  const modalAcceptance = document.getElementById("modalAcceptance");
  const modalFeaturesList = document.getElementById("modalFeaturesList");
  const modalDirectWA = document.getElementById("modalDirectWA");
  const modalCTA = document.getElementById("modalCTA");
  const courseButtons = document.querySelectorAll(".course-btn");

  courseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const courseName = btn.dataset.course || "English Test Prep";
      const duration = btn.dataset.duration || "4 - 8 Weeks";
      const score = btn.dataset.score || "Target Band";
      const acceptance = btn.dataset.acceptance || "Accepted worldwide.";
      const featuresRaw = btn.dataset.features || "";

      if (modalCourseTitle) modalCourseTitle.textContent = `${courseName} Preparation`;
      if (modalDuration) modalDuration.textContent = duration;
      if (modalScore) modalScore.textContent = score;
      if (modalAcceptance) modalAcceptance.textContent = acceptance;

      if (modalFeaturesList) {
        modalFeaturesList.innerHTML = "";
        const features = featuresRaw.split("|").filter(Boolean);
        features.forEach(f => {
          const li = document.createElement("li");
          li.textContent = f;
          modalFeaturesList.appendChild(li);
        });
      }

      if (modalDirectWA) {
        const msg = `Hello English Pathshala, I am interested in your ${courseName} course (${score}). Please share batch timings and demo class details.`;
        modalDirectWA.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
      }

      openModal("courseModal");
    });
  });

  if (modalCTA) {
    modalCTA.addEventListener("click", () => {
      const currentCourse = modalCourseTitle ? modalCourseTitle.textContent.replace(" Preparation", "") : "";
      closeModal(document.getElementById("courseModal"));

      const courseSelect = document.getElementById("course");
      if (courseSelect && currentCourse) {
        for (let i = 0; i < courseSelect.options.length; i++) {
          if (courseSelect.options[i].value.toLowerCase().includes(currentCourse.toLowerCase())) {
            courseSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  }

  /* =======================================================
     6. FAQ ACCORDION (SMOOTH CSS ROTATION)
     ======================================================= */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          const otherBtn = other.querySelector(".faq-q");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =======================================================
     7. LEGAL MODALS (Privacy & Terms)
     ======================================================= */
  const openPrivacyBtn = document.getElementById("openPrivacyBtn");
  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener("click", () => openModal("privacyModal"));
  }

  const openTermsBtn = document.getElementById("openTermsBtn");
  if (openTermsBtn) {
    openTermsBtn.addEventListener("click", () => openModal("termsModal"));
  }

  /* =======================================================
     8. FORM HANDLERS (HERO & CONTACT FORMS)
     ======================================================= */
  function saveLeadToStorage(data) {
    try {
      const stored = JSON.parse(localStorage.getItem("ep_leads") || "[]");
      stored.push({
        ...data,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("ep_leads", JSON.stringify(stored));
    } catch (e) {
      // Storage fallback
    }
  }

  function submitDemoLead(leadData, formattedMessage) {
    saveLeadToStorage(leadData);

    const waURL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(formattedMessage)}`;

    const successWALink = document.getElementById("successWALink");
    if (successWALink) {
      successWALink.href = waURL;
    }

    openModal("successModal");
    window.open(waURL, "_blank", "noopener,noreferrer");
  }

  // Hero Quick Demo Form
  const heroDemoForm = document.getElementById("heroDemoForm");
  if (heroDemoForm) {
    heroDemoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("heroName")?.value.trim() || "";
      const phone = document.getElementById("heroPhone")?.value.trim() || "";
      const course = document.getElementById("heroCourse")?.value || "";
      const slot = document.getElementById("heroSlot")?.value || "Flexible";
      const goal = document.getElementById("heroGoal")?.value.trim() || "Not specified";

      if (name.length < 2) {
        alert("Please enter your full name.");
        return;
      }

      const cleanDigits = phone.replace(/\D/g, "");
      if (cleanDigits.length < 7 || cleanDigits.length > 15) {
        alert("Please enter a valid phone or WhatsApp number.");
        return;
      }

      if (!course) {
        alert("Please select your target exam.");
        return;
      }

      const message = `Hello English Pathshala,
I would like to book a Free Demo Consultation.

• Name: ${name}
• WhatsApp: ${phone}
• Target Exam: ${course}
• Preferred Slot: ${slot}
• Goal / Deadline: ${goal}

Please share available batch timings and confirm my demo with Prof. Avijit Majumdar. Thank you!`;

      submitDemoLead({ name, phone, course, slot, goal, source: "hero_form" }, message);
      heroDemoForm.reset();
    });
  }

  // Bottom Contact Form
  const demoForm = document.getElementById("demoForm");
  if (demoForm) {
    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "";
      const phone = document.getElementById("phone")?.value.trim() || "";
      const course = document.getElementById("course")?.value || "";
      const goal = document.getElementById("goal")?.value.trim() || "Not specified";

      if (name.length < 2) {
        alert("Please enter your full name.");
        return;
      }

      const cleanDigits = phone.replace(/\D/g, "");
      if (cleanDigits.length < 7 || cleanDigits.length > 15) {
        alert("Please enter a valid phone or WhatsApp number.");
        return;
      }

      if (!course) {
        alert("Please select your target exam.");
        return;
      }

      const message = `Hello English Pathshala,
I would like to schedule a Free Demo Session.

• Name: ${name}
• WhatsApp: ${phone}
• Target Exam: ${course}
• Target Goal / Timeline: ${goal}

Please connect with me for batch timings. Thank you!`;

      submitDemoLead({ name, phone, course, goal, source: "contact_form" }, message);
      demoForm.reset();
    });
  }

  /* =======================================================
     9. ACTIVE NAV SCROLL SPY
     ======================================================= */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

});