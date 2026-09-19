/**
 * English Pathshala — Dark Tech & Luxury Bento Interactive Engine
 * Interactive Roadmap Calculator, Dynamic Modal Syllabi, and WhatsApp Leads
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Dark / Light Visual Theme Manager
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function initTheme() {
    const saved = localStorage.getItem("ep_theme");
    // Default to dark luxury aesthetic
    const isDark = saved !== "light";
    document.body.classList.toggle("dark", isDark);
    updateThemeIcon(isDark);
  }

  function updateThemeIcon(isDark) {
    if (!themeIcon) return;
    themeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    if (window.lucide) window.lucide.createIcons();
  }

  themeToggle?.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("ep_theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  });

  initTheme();

  // 3. Floating Navbar Scroll Spy & Blur Elevation
  const navWrapper = document.getElementById("topNav");
  const navLinks = document.querySelectorAll(".nav-pill-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (navWrapper) {
      navWrapper.classList.toggle("scrolled", scrollY > 20);
    }

    let currentId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === `#${currentId}`) {
          link.classList.add("active");
        } else if (href && href.startsWith("#")) {
          link.classList.remove("active");
        }
      });
    }
  }, { passive: true });

  // 4. Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = document.getElementById("menuIcon");

  mobileMenuBtn?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.toggle("open");
    mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (menuIcon) {
      menuIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
      if (window.lucide) window.lucide.createIcons();
    }
  });

  document.querySelectorAll(".mobile-drawer-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu?.classList.remove("open");
      mobileMenuBtn?.setAttribute("aria-expanded", "false");
      if (menuIcon) {
        menuIcon.setAttribute("data-lucide", "menu");
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });

  // 5. Interactive Band & Preparation Roadmap Calculator
  const calcExam = document.getElementById("calcExam");
  const calcLevelInput = document.getElementById("calcLevel");
  const levelTabBtns = document.querySelectorAll(".level-tab-btn");
  const calcHours = document.getElementById("calcHours");
  const calcHoursLabel = document.getElementById("calcHoursLabel");
  const resScore = document.getElementById("resScore");
  const resTimeline = document.getElementById("resTimeline");
  const resBatch = document.getElementById("resBatch");
  const calcCtaBtn = document.getElementById("calcCtaBtn");

  const calculatorMatrix = {
    ielts: {
      name: "IELTS Masterclass",
      scores: { beginner: "Band 6.5 – 7.0", intermediate: "Band 7.5 – 8.0+", advanced: "Band 8.5 – 9.0" },
      baseWeeks: { beginner: 10, intermediate: 6, advanced: 4 },
      batch: "Max 8 Students"
    },
    pte: {
      name: "PTE Academic",
      scores: { beginner: "Score 65+ (CLB 8)", intermediate: "Score 79+ (CLB 9/10)", advanced: "Score 85+ / 90" },
      baseWeeks: { beginner: 8, intermediate: 5, advanced: 3 },
      batch: "Max 8 Students"
    },
    oet: {
      name: "OET for Healthcare",
      scores: { beginner: "Grade C+ / 300 pts", intermediate: "Grade B / 350+ pts", advanced: "Grade A / 400+ pts" },
      baseWeeks: { beginner: 12, intermediate: 8, advanced: 5 },
      batch: "Max 6 Doctors/Nurses"
    },
    celpip: {
      name: "CELPIP General",
      scores: { beginner: "CLB 7 – 8", intermediate: "CLB 9 – 10 (PR Max)", advanced: "CLB 11 – 12" },
      baseWeeks: { beginner: 8, intermediate: 5, advanced: 3 },
      batch: "Max 8 Students"
    },
    toefl: {
      name: "TOEFL iBT",
      scores: { beginner: "Score 90 – 95", intermediate: "Score 105+ / 120", advanced: "Score 115+ / 120" },
      baseWeeks: { beginner: 10, intermediate: 6, advanced: 4 },
      batch: "Max 8 Students"
    },
    duolingo: {
      name: "Duolingo English Test",
      scores: { beginner: "Score 110 – 120", intermediate: "Score 125 – 135+", advanced: "Score 140 – 150" },
      baseWeeks: { beginner: 6, intermediate: 3, advanced: 2 },
      batch: "Max 8 Students"
    },
    spoken: {
      name: "Spoken English & Fluency",
      scores: { beginner: "Conversational Ease", intermediate: "Spontaneous Fluency", advanced: "Executive Presence" },
      baseWeeks: { beginner: 12, intermediate: 8, advanced: 4 },
      batch: "Max 8 Students"
    },
    interview: {
      name: "Job & Visa Interview Mastery",
      scores: { beginner: "Confident Pitch", intermediate: "Job & Visa Offers", advanced: "Executive Negotiation" },
      baseWeeks: { beginner: 4, intermediate: 3, advanced: 2 },
      batch: "1-on-1 / Max 4"
    }
  };

  function updateRoadmapCalculator() {
    const examKey = calcExam?.value || "ielts";
    const levelKey = calcLevelInput?.value || "intermediate";
    const hours = parseInt(calcHours?.value || "8", 10);

    if (calcHoursLabel) {
      calcHoursLabel.textContent = `${hours} Hours / Week`;
    }

    const data = calculatorMatrix[examKey];
    if (!data) return;

    const projectedScore = data.scores[levelKey];
    // Scale timeline inversely with study hours
    const baseWks = data.baseWeeks[levelKey];
    let computedWeeks = Math.max(2, Math.round(baseWks * (8 / hours)));
    const timelineStr = `${computedWeeks} Weeks`;

    if (resScore) resScore.textContent = projectedScore;
    if (resTimeline) resTimeline.textContent = timelineStr;
    if (resBatch) resBatch.textContent = data.batch;
  }

  calcExam?.addEventListener("change", updateRoadmapCalculator);

  levelTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      levelTabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const level = btn.getAttribute("data-level");
      if (calcLevelInput) calcLevelInput.value = level;
      updateRoadmapCalculator();
    });
  });

  calcHours?.addEventListener("input", updateRoadmapCalculator);

  calcCtaBtn?.addEventListener("click", () => {
    const examKey = calcExam?.value || "ielts";
    const levelKey = calcLevelInput?.value || "intermediate";
    const hours = calcHours?.value || "8";
    const score = resScore?.textContent || "";
    const timeline = resTimeline?.textContent || "";
    const examName = calculatorMatrix[examKey]?.name || "IELTS Masterclass";

    const msg = encodeURIComponent(
      `Hello Prof. Avijit Majumdar,\n\nI used your Prep Roadmap Calculator on English Pathshala:\n- Target Course: ${examName}\n- Current Level: ${levelKey.toUpperCase()}\n- Weekly Commitment: ${hours} hrs/week\n- Computed Target: ${score}\n- Recommended Timeline: ${timeline}\n\nI want to lock in this preparation roadmap. Please share batch schedules!`
    );
    window.open(`https://wa.me/917003876568?text=${msg}`, "_blank");
  });

  // Initial calculation
  updateRoadmapCalculator();

  // 6. Course Filtering
  const filterTabs = document.querySelectorAll(".filter-tab");
  const courseCards = document.querySelectorAll(".cyber-card");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.getAttribute("data-filter");

      courseCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        const match = category === "all" || cardCat === category;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  // 7. Comprehensive Course Data Repository
  const coursesData = {
    ielts: {
      title: "IELTS Masterclass (Band 7.5+)",
      category: "EXAM PREPARATION",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "Band 7.5 – 8.5+",
      desc: "Academic & General Training: Listening accent mastery, reading speed heuristics, Task 1 & 2 band descriptors, and 1-on-1 speaking clinics.",
      modules: [
        "Listening Section 1–4: British, American & Australian accent decoding + rapid note-taking.",
        "Reading: Skimming, scanning, True/False/Not Given & heading matching elimination formulas.",
        "Writing Task 1 & 2: Band 8+ structures, cohesive devices, and lexical resource boosters.",
        "Speaking 1-on-1: Part 1, 2, 3 fluency drills, hesitation elimination & mock examiner interviews.",
        "Weekly full-length timed mock tests with individual band score analysis."
      ],
      enquireTitle: "IELTS Masterclass"
    },
    pte: {
      title: "PTE Academic Fast-Track",
      category: "AI-EVALUATED PREP",
      duration: "4–6 Weeks",
      batch: "Max 8 Students",
      target: "Score 79+ (CLB 9/10)",
      desc: "Fast-track training engineered for Pearson's automated scoring algorithm. Master oral acoustics and proven scoring templates.",
      modules: [
        "Speaking: Read Aloud pitch calibration, Repeat Sentence memory tricks, and Describe Image templates.",
        "Writing: 100% scoring templates for Summarize Written Text and Write Essay.",
        "Reading: Re-order paragraphs logic and Fill in the Blanks collocation shortcuts.",
        "Listening: Write from Dictation predictive lists and Highlight Incorrect Words reflexes.",
        "Official AI score software practice with instantaneous phonetic feedback."
      ],
      enquireTitle: "PTE Academic"
    },
    oet: {
      title: "OET for Healthcare Professionals",
      category: "HEALTHCARE",
      duration: "8–10 Weeks",
      batch: "Max 6 Doctors/Nurses",
      target: "Grade B / 350+ Points",
      desc: "Dedicated medical English program designed for Doctors, Nurses, and Pharmacists targeting UK NHS, NMC, GMC, and Australia/Ireland registration.",
      modules: [
        "Writing Referral Letters: Clinical case note interpretation, purpose prioritization & discharge summaries.",
        "Speaking Roleplays: Empathetic patient communication, medical jargon de-escalation & diagnostic roleplay.",
        "Healthcare Listening: Multi-speaker ward handovers, patient consultations & medical lectures.",
        "Healthcare Reading: Rapid scanning of workplace notices, policies, and research abstracts.",
        "Mock exams assessed by certified medical language trainers."
      ],
      enquireTitle: "OET for Healthcare"
    },
    celpip: {
      title: "CELPIP General (Canada PR)",
      category: "IMMIGRATION",
      duration: "4–6 Weeks",
      batch: "Max 8 Students",
      target: "CLB 9 – 12 Score",
      desc: "Master 100% Canadian English exam preferred by IRCC for Express Entry and citizenship. Practice computer-delivered tests with instant feedback.",
      modules: [
        "Speaking: Describing scenes, expressing opinions, difficult situations, and expanding ideas.",
        "Writing Task 1 & 2: Writing formal/informal emails and responding to workplace survey questions.",
        "Reading: Reading correspondence, applying diagrams, and viewpoint comprehension.",
        "Listening: Daily Canadian conversations, workplace news items, and interview panels.",
        "Full computer test simulation with instant Canadian spelling and timing strategies."
      ],
      enquireTitle: "CELPIP General"
    },
    toefl: {
      title: "TOEFL iBT University Prep",
      category: "ACADEMIC",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "Score 105+ / 120",
      desc: "Specialized training for USA, Germany, and top global university admissions. Master academic discussion tasks and campus lecture synthesis.",
      modules: [
        "New Writing Section: Master 'Writing for an Academic Discussion' task with precision.",
        "Integrated Speaking: Synthesizing campus announcements, conversation dialogues, and academic lectures.",
        "Listening: Note-taking strategies for university professorial lectures and debates.",
        "Academic Reading: In-depth rhetorical purpose questions and vocabulary in context.",
        "Official ETS-style timed mock assessments with detailed scoring."
      ],
      enquireTitle: "TOEFL iBT"
    },
    duolingo: {
      title: "Duolingo English Test (DET)",
      category: "FAST CERTIFICATION",
      duration: "2–4 Weeks",
      batch: "Max 8 Students",
      target: "Score 120 – 140+",
      desc: "Speed-prep for the 1-hour computer-adaptive test accepted by 4,000+ universities worldwide. Decode subscores and unscripted interviews.",
      modules: [
        "Literacy: Real vs. pseudo-English word detection & fill-in-the-blank passage reconstruction.",
        "Production: Read then Speak, Listen then Speak, and extended 5-minute timed essay writing.",
        "Speaking Sample & Video Interview: High-impact unscripted responses for admissions officers.",
        "Adaptive Algorithm Tactics: How computer adaptive testing weights question difficulty.",
        "Speed typing clinics and interactive mock drill sets."
      ],
      enquireTitle: "Duolingo English Test"
    },
    spoken: {
      title: "Spoken English & Fluency",
      category: "FLUENCY",
      duration: "8–12 Weeks",
      batch: "Max 8 Students",
      target: "Natural Spontaneous Speech",
      desc: "Break free from translating in your head. Achieve effortless, instinctive speech with 70% active speaking time in small interactive batches.",
      modules: [
        "Hesitation Elimination: Overcome fear of speaking and grammatical self-consciousness.",
        "Accent Neutralization & MTI: Pronunciation clarity, rhythm, intonation, and stress patterns.",
        "Thinking in English: Cognitive exercises to eliminate mental native-language translation.",
        "Public Speaking & Debates: Extempore speeches, group discussions, and storytelling frameworks.",
        "Daily conversation clubs and recorded speech analysis for rapid feedback."
      ],
      enquireTitle: "Spoken English"
    },
    everyday: {
      title: "Everyday English",
      category: "PRACTICAL",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "Social Confidence",
      desc: "Practical conversational English for everyday life, shopping, travel, banking, and casual social interactions. Build an active vocabulary.",
      modules: [
        "Everyday Conversations: Greetings, small talk, expressing opinions, and agreeing/disagreeing.",
        "Real-life Scenarios: Restaurant dining, hotel check-ins, airport navigation, and medical visits.",
        "Idioms & Phrasal Verbs: Natural expressions native speakers actually use every day.",
        "Telephone & Digital Etiquette: Phone manners, informal emails, and social messaging norms.",
        "Interactive role-playing games with real-life audio scenarios."
      ],
      enquireTitle: "Everyday English"
    },
    interview: {
      title: "Job & Visa Interview Mastery",
      category: "CAREER",
      duration: "2–4 Weeks",
      batch: "1-on-1 / Max 4",
      target: "Offers & Visa Approvals",
      desc: "Executive preparation for corporate job interviews, managerial promotions, and US/UK/Canada visa officer interview rounds.",
      modules: [
        "The STAR Framework: Structuring answers for Situation, Task, Action, and Measurable Result.",
        "90-Second Power Pitch: Crafting an irresistible response to 'Tell me about yourself'.",
        "Tricky HR & Behavioral Questions: Handling salary negotiations, weaknesses, and career gaps.",
        "Visa Officer Rounds: High-confidence clarity drills for US F1/H1B, UK Tier 4, and Schengen visas.",
        "Recorded mock interviews with personalized body language and vocal delivery critique."
      ],
      enquireTitle: "Interview Mastery"
    },
    govt: {
      title: "Govt. Exams (SSC, Bank, Railways)",
      category: "COMPETITIVE",
      duration: "8–12 Weeks",
      batch: "Max 12 Students",
      target: "Top Percentile Score",
      desc: "Speed-cracking formulas for SSC CGL/CHSL, IBPS PO/Clerk, SBI, and State PSCs with time-saving elimination methods and previous papers.",
      modules: [
        "Spotting Errors: 100 golden rules of syntax, subject-verb agreement, and prepositions.",
        "Cloze Test & Para Jumbles: Elimination strategies to solve 5 questions in under 90 seconds.",
        "Reading Comprehension: Tone identification, central theme derivation, and speed scanning.",
        "Vocabulary Power: Root words, mnemonics, synonyms, antonyms, and idioms repository.",
        "5,000+ TCS and previous years' question bank drills with time-bound speed tests."
      ],
      enquireTitle: "Govt. Exams (SSC, Bank, Railways)"
    },
    grammar: {
      title: "Grammar Made Easy",
      category: "FOUNDATION",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "100% Error-Free Writing",
      desc: "Master the structure of English intuitively without tedious memorization. Understand tenses, prepositions, and syntax through context.",
      modules: [
        "Tense Matrix Demystified: Master all 12 tenses with real-world timeline examples.",
        "Prepositions & Articles: Clear rules for 'in/on/at', 'the/a/an' that remove guesswork.",
        "Active vs. Passive Voice & Reported Speech: Smooth transformations for professional communication.",
        "Sentence Architecture: Clauses, conjunctions, modifiers, and comma punctuation.",
        "Daily editing clinics: Spot and correct common Indian-English errors in real time."
      ],
      enquireTitle: "Grammar Made Easy"
    },
    board: {
      title: "CBSE/ICSE Board & English Olympiad",
      category: "SCHOOL & OLYMPIAD",
      duration: "Academic Year",
      batch: "Max 10 Students",
      target: "95%+ in Boards & Top Ranks",
      desc: "Specialized academic curriculum for Class IX to XII students covering CBSE/ICSE prescribed literature, character sketches, and Olympiad reasoning.",
      modules: [
        "Board Literature Mastery: In-depth chapter analysis, symbolic motifs, and themes.",
        "High-Scoring Answer Writing: Formulations for long-form answers and character sketches.",
        "Creative Formal Writing: Notice, report, letter to editor, and speech writing formats.",
        "SOF & SilverZone Olympiad: Advanced syntactic analysis, analogies, and verbal reasoning.",
        "Weekly chapter tests, model answer keys, and past 10 years' board paper walkthroughs."
      ],
      enquireTitle: "CBSE/ICSE Board & Olympiad"
    }
  };

  // 8. Modals Manager (Curriculum & Fast Enquiry)
  const courseModal = document.getElementById("courseModal");
  const enquireModal = document.getElementById("enquireModal");

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("show");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("show");
    modalEl.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".cyber-modal.show")) {
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => {
      const parent = el.closest(".cyber-modal");
      if (parent) closeModal(parent);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".cyber-modal.show").forEach(closeModal);
    }
  });

  const modalCategoryTag = document.getElementById("modalCategoryTag");
  const modalCourseTitle = document.getElementById("modalCourseTitle");
  const modalCourseDesc = document.getElementById("modalCourseDesc");
  const modalDuration = document.getElementById("modalDuration");
  const modalBatch = document.getElementById("modalBatch");
  const modalTarget = document.getElementById("modalTarget");
  const modalSyllabusList = document.getElementById("modalSyllabusList");
  const modalEnquireBtn = document.getElementById("modalEnquireBtn");

  let activeModalCourseName = "";

  document.querySelectorAll(".btn-learn-more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseKey = btn.getAttribute("data-learn-more");
      const data = coursesData[courseKey];
      if (!data) return;

      activeModalCourseName = data.enquireTitle;

      if (modalCategoryTag) modalCategoryTag.textContent = data.category;
      if (modalCourseTitle) modalCourseTitle.textContent = data.title;
      if (modalCourseDesc) modalCourseDesc.textContent = data.desc;
      if (modalDuration) modalDuration.textContent = data.duration;
      if (modalBatch) modalBatch.textContent = data.batch;
      if (modalTarget) modalTarget.textContent = data.target;

      if (modalSyllabusList) {
        modalSyllabusList.innerHTML = data.modules
          .map(
            (mod) =>
              `<div class="modal-syllabus-item"><i data-lucide="check-circle-2"></i><span>${mod}</span></div>`
          )
          .join("");
        if (window.lucide) window.lucide.createIcons();
      }

      openModal(courseModal);
    });
  });

  modalEnquireBtn?.addEventListener("click", () => {
    closeModal(courseModal);
    openEnquireForCourse(activeModalCourseName);
  });

  // Fast Enquiry Modal Trigger
  const enquirySelect = document.getElementById("enquiryCourse");

  function openEnquireForCourse(courseName) {
    if (enquirySelect && courseName) {
      for (let i = 0; i < enquirySelect.options.length; i++) {
        if (
          enquirySelect.options[i].value.toLowerCase().includes(courseName.toLowerCase()) ||
          courseName.toLowerCase().includes(enquirySelect.options[i].value.toLowerCase())
        ) {
          enquirySelect.selectedIndex = i;
          break;
        }
      }
    }
    openModal(enquireModal);
  }

  document.querySelectorAll(".btn-enquire").forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseName = btn.getAttribute("data-enquire");
      openEnquireForCourse(courseName);
    });
  });

  // Fast Enquiry Form
  const fastEnquiryForm = document.getElementById("fastEnquiryForm");
  fastEnquiryForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("enquireName")?.value.trim() || "";
    const phone = document.getElementById("enquirePhone")?.value.trim() || "";
    const course = enquirySelect?.value || "IELTS Masterclass";

    if (!name || !phone) {
      showToast("Please provide your name and WhatsApp number.");
      return;
    }

    saveLead({ name, phone, course, source: "Fast Enquiry Cyber Modal" });

    const msg = encodeURIComponent(
      `Hello English Pathshala! My name is ${name} (${phone}). I would like to enquire about the ${course} program.`
    );
    window.open(`https://wa.me/917003876568?text=${msg}`, "_blank");

    closeModal(enquireModal);
    fastEnquiryForm.reset();
    showToast("Enquiry sent! Opening WhatsApp...");
  });

  // 9. Main Free Consultation Form
  const bookingForm = document.getElementById("bookingForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const phoneInput = document.getElementById("contactPhone");
  const courseInput = document.getElementById("contactCourse");
  const messageInput = document.getElementById("contactMessage");

  bookingForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));

    const name = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const phone = phoneInput?.value.trim() || "";
    const course = courseInput?.value || "";
    const message = messageInput?.value.trim() || "";

    if (!name) {
      showFieldError("nameError", "Please enter your name.");
      valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError("emailError", "Please enter a valid email address.");
      valid = false;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      showFieldError("phoneError", "Please enter a valid 10-digit phone number.");
      valid = false;
    }

    if (!course) {
      showFieldError("courseError", "Please select a program.");
      valid = false;
    }

    if (!valid) return;

    saveLead({ name, email, phone, course, message, source: "Consultation Panel" });

    showToast("Demo request received! Connecting via WhatsApp...");

    const waText = encodeURIComponent(
      `Hello Prof. Avijit Majumdar / English Pathshala,\n\nI want to book a Free Demo Consultation.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nProgram: ${course}${
        message ? `\nGoal / Exam Date: ${message}` : ""
      }`
    );

    setTimeout(() => {
      window.open(`https://wa.me/917003876568?text=${waText}`, "_blank");
    }, 400);

    bookingForm.reset();
  });

  function showFieldError(errorId, msg) {
    const el = document.getElementById(errorId);
    if (el) el.textContent = msg;
  }

  function saveLead(data) {
    try {
      const existing = JSON.parse(localStorage.getItem("ep_leads") || "[]");
      existing.push({ ...data, date: new Date().toISOString() });
      localStorage.setItem("ep_leads", JSON.stringify(existing));
    } catch (err) {
      console.warn("Could not save to localStorage", err);
    }
  }

  // 10. Cyber Toast Notification
  const toast = document.getElementById("toast");
  function showToast(text) {
    if (!toast) return;
    const msgEl = toast.querySelector(".toast-msg");
    if (msgEl) msgEl.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
  }

  // 11. FAQ Accordion
  const faqCards = document.querySelectorAll(".cyber-faq-card");
  faqCards.forEach((card) => {
    const btn = card.querySelector(".faq-btn");
    btn?.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");
      faqCards.forEach((c) => {
        c.classList.remove("open");
        const qBtn = c.querySelector(".faq-btn");
        if (qBtn) qBtn.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        card.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 12. Animated Stats Counter on Viewport Entry
  const statNumbers = document.querySelectorAll(".stat-counter[data-count]");
  let statsCounted = false;

  function runStatsCounter() {
    if (statsCounted) return;
    const mentorSection = document.getElementById("mentor") || document.getElementById("hero");
    if (!mentorSection) return;

    const rect = mentorSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      statsCounted = true;
      statNumbers.forEach((el) => {
        const target = parseInt(el.getAttribute("data-count"), 10);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1400;
        const step = Math.ceil(target / (duration / 25));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current >= 1000 ? `${current.toLocaleString()}+` : `${current}+`;
          if (target === 98) el.textContent = `${current}%`;
        }, 25);
      });
    }
  }

  window.addEventListener("scroll", runStatsCounter, { passive: true });
  runStatsCounter();
});
