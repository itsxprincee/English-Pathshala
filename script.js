/* =========================================================
   ENGLISH PATHSHALA — JAVASCRIPT
   SaaS Interactive Hub, Score Calculator, Single Form & Modals
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

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    document.addEventListener("click", (e) => {
      if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  /* =======================================================
     2. UNIVERSAL MODAL CONTROLLER & FOCUS TRAP
     ======================================================= */
  let lastFocusedTrigger = null;

  function openModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;
    lastFocusedTrigger = document.activeElement;
    modalEl.classList.add("active");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Auto focus first interactive element
    const focusable = modalEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) {
      setTimeout(() => focusable.focus(), 50);
    }
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("active");
    modalEl.setAttribute("aria-hidden", "true");

    const anyActive = document.querySelector(".modal.active");
    if (!anyActive) {
      document.body.classList.remove("modal-open");
    }

    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  }

  document.querySelectorAll(".modal").forEach(modal => {
    modal.querySelectorAll("[data-modal-close], .modal-close").forEach(btn => {
      btn.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach(m => closeModal(m));
    }
  });

  /* =======================================================
     3. MASTER INTERACTIVE EXAM HUB TABS & A11Y
     ======================================================= */
  const hubTabs = [
    { btn: document.getElementById("tabProgramsBtn"), view: document.getElementById("viewPrograms"), id: "programs" },
    { btn: document.getElementById("tabPlannerBtn"), view: document.getElementById("viewPlanner"), id: "planner" },
    { btn: document.getElementById("tabCompareBtn"), view: document.getElementById("viewCompare"), id: "compare" }
  ];

  function switchHubTab(targetId) {
    hubTabs.forEach(item => {
      if (!item.btn || !item.view) return;
      const isActive = item.id === targetId;
      item.btn.classList.toggle("active", isActive);
      item.btn.setAttribute("aria-selected", isActive ? "true" : "false");
      item.view.classList.toggle("active", isActive);
    });
  }

  hubTabs.forEach(item => {
    if (item.btn) {
      item.btn.addEventListener("click", () => switchHubTab(item.id));
    }
  });

  // W3C ARIA Tab Pattern Keyboard Navigation (Arrow Keys)
  const tabButtonElements = hubTabs.map(t => t.btn).filter(Boolean);
  tabButtonElements.forEach((btn, index) => {
    btn.addEventListener("keydown", (e) => {
      let targetIndex = null;
      if (e.key === "ArrowRight") {
        targetIndex = (index + 1) % tabButtonElements.length;
      } else if (e.key === "ArrowLeft") {
        targetIndex = (index - 1 + tabButtonElements.length) % tabButtonElements.length;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        tabButtonElements[targetIndex].focus();
        tabButtonElements[targetIndex].click();
      }
    });
  });

  // Handle external links targeting a specific hub tab (e.g. from nav or hero)
  document.querySelectorAll("[data-hub-target]").forEach(link => {
    link.addEventListener("click", () => {
      const target = link.dataset.hubTarget;
      if (target) {
        switchHubTab(target);
      }
    });
  });

  /* =======================================================
     4. INTERACTIVE TARGET SCORE PLANNER
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
        { label: "Grade A (450+)", duration: "6 - 8 Weeks", mocks: "12 Clinical Consultations", batch: "Shift-Friendly Weekend Batch" }
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
      plannerCTA.onclick = () => {
        // Pre-select exam in booking form
        selectCourseInForm(data.name);

        // Pre-populate target score goal
        const userGoal = document.getElementById("userGoal");
        if (userGoal) {
          userGoal.value = `Target: ${activeScore.label} (${activeScore.duration} Plan)`;
        }

        // Match slot option
        const userSlot = document.getElementById("userSlot");
        if (userSlot && activeScore.batch) {
          const batchLower = activeScore.batch.toLowerCase();
          for (let i = 0; i < userSlot.options.length; i++) {
            const slotText = userSlot.options[i].text.toLowerCase();
            if (batchLower.includes("weekend") && slotText.includes("weekend")) {
              userSlot.selectedIndex = i;
              break;
            } else if (batchLower.includes("evening") && slotText.includes("evening")) {
              userSlot.selectedIndex = i;
              break;
            } else if (batchLower.includes("1-on-1") && slotText.includes("1-on-1")) {
              userSlot.selectedIndex = i;
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

  if (plannerScoresContainer) {
    renderScoreButtons();
  }

  /* =======================================================
     5. COURSE SELECTION HELPER
     ======================================================= */
  function selectCourseInForm(courseName) {
    const userCourseSelect = document.getElementById("userCourse");
    if (!userCourseSelect || !courseName) return;

    const lower = courseName.toLowerCase();
    for (let i = 0; i < userCourseSelect.options.length; i++) {
      const optVal = userCourseSelect.options[i].value.toLowerCase();
      if (optVal && (optVal.includes(lower) || lower.includes(optVal.split(" ")[0]))) {
        userCourseSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Pre-fill course when clicking "Book Demo" on a course card
  document.querySelectorAll(".enroll-link").forEach(link => {
    link.addEventListener("click", () => {
      const courseFill = link.dataset.courseFill;
      if (courseFill) {
        selectCourseInForm(courseFill);
      }
    });
  });

  /* =======================================================
     6. COURSE DETAILS MODAL
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
      if (currentCourse) {
        selectCourseInForm(currentCourse);
      }
    });
  }

  /* =======================================================
     7. FAQ ACCORDION
     ======================================================= */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          const otherBtn = other.querySelector(".faq-q");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

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
     8. LEGAL MODALS (Privacy & Terms)
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
     9. UNIFIED DEMO BOOKING FORM (INLINE VALIDATION, NO ALERTS)
     ======================================================= */
  function showFormError(message, inputElement) {
    const feedback = document.getElementById("formFeedback");
    if (feedback) {
      feedback.textContent = message;
      feedback.style.display = "block";
    }
    if (inputElement) {
      inputElement.classList.add("input-error");
      inputElement.focus();
    }
  }

  function clearFormErrors() {
    const feedback = document.getElementById("formFeedback");
    if (feedback) {
      feedback.style.display = "none";
      feedback.textContent = "";
    }
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
  }

  // Clear errors when the user types
  ["userName", "userPhone", "userCourse"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", clearFormErrors);
      el.addEventListener("change", clearFormErrors);
    }
  });

  function saveLeadToStorage(data) {
    try {
      const stored = JSON.parse(localStorage.getItem("ep_leads") || "[]");
      stored.push({
        ...data,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("ep_leads", JSON.stringify(stored));
    } catch (e) {
      // LocalStorage fallback
    }
  }

  const unifiedDemoForm = document.getElementById("unifiedDemoForm");
  if (unifiedDemoForm) {
    unifiedDemoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearFormErrors();

      const nameInput = document.getElementById("userName");
      const phoneInput = document.getElementById("userPhone");
      const courseSelect = document.getElementById("userCourse");
      const slotSelect = document.getElementById("userSlot");
      const goalInput = document.getElementById("userGoal");

      const name = nameInput?.value.trim() || "";
      const phone = phoneInput?.value.trim() || "";
      const course = courseSelect?.value || "";
      const slot = slotSelect?.value || "Flexible";
      const goal = goalInput?.value.trim() || "Not specified";

      if (name.length < 2) {
        showFormError("Please enter your full name (at least 2 letters).", nameInput);
        return;
      }

      const cleanDigits = phone.replace(/\D/g, "");
      if (cleanDigits.length < 7 || cleanDigits.length > 15) {
        showFormError("Please enter a valid phone or WhatsApp number (7-15 digits).", phoneInput);
        return;
      }

      if (!course) {
        showFormError("Please choose your target examination from the list.", courseSelect);
        return;
      }

      const leadData = { name, phone, course, slot, goal, source: "clean_saas_form" };
      saveLeadToStorage(leadData);

      const message = `Hello English Pathshala,
I would like to book a Free Demo Consultation.

• Name: ${name}
• WhatsApp: ${phone}
• Target Exam: ${course}
• Preferred Slot: ${slot}
• Goal / Deadline: ${goal}

Please share available batch timings and confirm my demo with Prof. Avijit Majumdar. Thank you!`;

      const waURL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

      const successWALink = document.getElementById("successWALink");
      if (successWALink) {
        successWALink.href = waURL;
      }

      openModal("successModal");
      window.open(waURL, "_blank", "noopener,noreferrer");

      unifiedDemoForm.reset();
    });
  }

  /* =======================================================
     10. SCROLLSPY & ACTIVE NAVIGATION LINK SYNC
     ======================================================= */
  const trackedSections = document.querySelectorAll("main section[id]");
  const navMenuLinks = document.querySelectorAll(".nav-menu .nav-link");

  function updateScrollSpy() {
    // If scrolled near top, highlight Home
    if (window.scrollY < 180) {
      navMenuLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.navTarget === "home");
      });
      return;
    }

    const scrollPosition = window.scrollY + 140;

    trackedSections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        navMenuLinks.forEach(link => {
          const targetNav = link.dataset.navTarget || (link.getAttribute("href") || "").replace("#", "");
          link.classList.toggle("active", targetNav === id);
        });
      }
    });
  }

  window.addEventListener("scroll", updateScrollSpy, { passive: true });
  updateScrollSpy();

  /* =======================================================
     11. ADMIN UTILITIES FOR OFFLINE LEADS
     ======================================================= */
  window.getEPLeads = function() {
    const leads = JSON.parse(localStorage.getItem("ep_leads") || "[]");
    console.table(leads);
    return leads;
  };

  window.exportEPLeadsCSV = function() {
    const leads = JSON.parse(localStorage.getItem("ep_leads") || "[]");
    if (!leads.length) {
      alert("No leads found in storage to export.");
      return;
    }
    const headers = ["Name", "Phone", "Course", "Slot", "Goal", "Source", "Date"];
    const rows = leads.map(l => [
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.course || "").replace(/"/g, '""')}"`,
      `"${(l.slot || "").replace(/"/g, '""')}"`,
      `"${(l.goal || "").replace(/"/g, '""')}"`,
      `"${(l.source || "").replace(/"/g, '""')}"`,
      `"${l.createdAt || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `english_pathshala_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

});