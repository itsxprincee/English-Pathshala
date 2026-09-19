document.addEventListener("DOMContentLoaded", () => {
  // 1. Vector Icons
  if (window.lucide) lucide.createIcons();

  const body = document.body;
  const themeBtn = document.querySelector(".theme-toggle");
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("ep-theme");

  function refreshIcons() {
    if (window.lucide) lucide.createIcons();
  }

  function applyTheme(isDark) {
    body.classList.toggle("dark", isDark);
    if (themeIcon) {
      themeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    }
    refreshIcons();
  }

  if (savedTheme === "dark") {
    applyTheme(true);
  }

  themeBtn?.addEventListener("click", () => {
    const isDark = !body.classList.contains("dark");
    applyTheme(isDark);
    localStorage.setItem("ep-theme", isDark ? "dark" : "light");
  });

  // 2. Mobile Nav Drawer
  const menuBtn = document.querySelector(".menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  menuBtn?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    mobileNav.setAttribute("aria-hidden", String(!open));
  });

  mobileNav?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    })
  );

  // 3. Scroll Reveal Animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // 4. Animated Stats Counter
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        let duration = 1200;
        let startTime = performance.now();

        function tick(now) {
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const current = Math.floor(target * eased);

          if (target === 95) {
            el.textContent = current + "%";
          } else if (target === 4) {
            el.textContent = String(current);
          } else if (target >= 1000) {
            el.textContent = current.toLocaleString() + "+";
          } else {
            el.textContent = current + "+";
          }

          if (p < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
  });

  // 5. Course Carousel Slider & Filtering
  const filters = document.querySelectorAll(".courses-screen .filter");
  const cards = document.querySelectorAll(".course-slider-track .course-card");
  const sliderViewport = document.querySelector(".course-slider-viewport");
  const sliderTrack = document.getElementById("courseSliderTrack");
  const prevBtn = document.getElementById("coursePrev");
  const nextBtn = document.getElementById("courseNext");
  const counterEl = document.getElementById("courseCounter");
  const dotsContainer = document.getElementById("courseDots");

  let currentSlide = 0;

  function getCardsPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function getVisibleCards() {
    return Array.from(cards).filter((c) => !c.classList.contains("hidden"));
  }

  function renderDots(totalPages) {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.className = `slider-dot ${i === currentSlide ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to course slide ${i + 1}`);
      dot.type = "button";
      dot.addEventListener("click", () => {
        currentSlide = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const visibleCards = getVisibleCards();
    const perView = getCardsPerView();
    const totalPages = Math.max(1, Math.ceil(visibleCards.length / perView));

    if (currentSlide >= totalPages) currentSlide = totalPages - 1;
    if (currentSlide < 0) currentSlide = 0;

    if (sliderTrack && visibleCards.length > 0) {
      const firstCard = visibleCards[0];
      const cardWidth = firstCard.getBoundingClientRect().width;
      const trackStyles = window.getComputedStyle(sliderTrack);
      const gap = parseFloat(trackStyles.gap) || 24;
      const offset = currentSlide * (cardWidth + gap) * perView;
      sliderTrack.style.transform = `translateX(-${offset}px)`;
    }

    if (counterEl) {
      counterEl.textContent = `${currentSlide + 1} / ${totalPages}`;
    }
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide >= totalPages - 1;

    renderDots(totalPages);
  }

  prevBtn?.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
    }
  });

  nextBtn?.addEventListener("click", () => {
    const visibleCards = getVisibleCards();
    const perView = getCardsPerView();
    const totalPages = Math.max(1, Math.ceil(visibleCards.length / perView));
    if (currentSlide < totalPages - 1) {
      currentSlide++;
      updateSlider();
    }
  });

  // Mobile & Tablet Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  sliderViewport?.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  sliderViewport?.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const threshold = 40;
      const diff = touchStartX - touchEndX;
      const visibleCards = getVisibleCards();
      const perView = getCardsPerView();
      const totalPages = Math.max(1, Math.ceil(visibleCards.length / perView));

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentSlide < totalPages - 1) {
          currentSlide++;
          updateSlider();
        } else if (diff < 0 && currentSlide > 0) {
          currentSlide--;
          updateSlider();
        }
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    updateSlider();
  });

  filters.forEach((filter) =>
    filter.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      const value = filter.dataset.filter;
      cards.forEach((card) => {
        const show = value === "all" || card.dataset.category === value;
        card.classList.toggle("hidden", !show);
      });
      currentSlide = 0;
      updateSlider();
    })
  );

  setTimeout(updateSlider, 100);

  // 5B. Success Stories Auto-Slider (Every 3 seconds)
  const storiesTrack = document.getElementById("storiesSliderTrack");
  const storiesViewport = document.getElementById("storiesSliderViewport");
  const storyPrevBtn = document.getElementById("storyPrev");
  const storyNextBtn = document.getElementById("storyNext");
  const storyDots = document.querySelectorAll(".story-dot");

  if (storiesTrack) {
    const originalStories = Array.from(storiesTrack.querySelectorAll(".testimonial"));
    const totalStories = originalStories.length; // 6

    // Clone the first 3 stories to create a seamless infinite circular carousel
    originalStories.slice(0, 3).forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("story-clone");
      clone.setAttribute("aria-hidden", "true");
      storiesTrack.appendChild(clone);
    });

    let currentStoryIdx = 0;
    let isStoryTransitioning = false;
    let storyAutoTimer = null;

    function getStoryStepWidth() {
      const firstCard = storiesTrack.querySelector(".testimonial");
      if (!firstCard) return 0;
      const width = firstCard.getBoundingClientRect().width;
      const computedGap = parseFloat(window.getComputedStyle(storiesTrack).gap) || 20;
      return width + computedGap;
    }

    function setStoryActiveDot(index) {
      const activeIdx = index % totalStories;
      storyDots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === activeIdx);
      });
    }

    function updateStoriesTrack(animate = true) {
      const step = getStoryStepWidth();
      if (!animate) {
        storiesTrack.style.transition = "none";
      } else {
        storiesTrack.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      }
      storiesTrack.style.transform = `translateX(-${currentStoryIdx * step}px)`;
      setStoryActiveDot(currentStoryIdx);
    }

    function slideNextStory() {
      if (isStoryTransitioning) return;
      currentStoryIdx++;
      updateStoriesTrack(true);

      // When reaching beyond original items, smoothly reset after transition
      if (currentStoryIdx === totalStories) {
        isStoryTransitioning = true;
        setTimeout(() => {
          currentStoryIdx = 0;
          updateStoriesTrack(false);
          void storiesTrack.offsetHeight; // force reflow
          isStoryTransitioning = false;
        }, 620);
      }
    }

    function slidePrevStory() {
      if (isStoryTransitioning) return;
      if (currentStoryIdx === 0) {
        // Jump silently to totalStories position
        currentStoryIdx = totalStories;
        updateStoriesTrack(false);
        void storiesTrack.offsetHeight;
        // Animate to totalStories - 1
        setTimeout(() => {
          currentStoryIdx = totalStories - 1;
          updateStoriesTrack(true);
        }, 20);
      } else {
        currentStoryIdx--;
        updateStoriesTrack(true);
      }
    }

    function goToStory(index) {
      currentStoryIdx = index;
      updateStoriesTrack(true);
    }

    function startStoryAutoTimer() {
      stopStoryAutoTimer();
      storyAutoTimer = setInterval(() => {
        slideNextStory();
      }, 3000); // exactly 3 seconds
    }

    function stopStoryAutoTimer() {
      if (storyAutoTimer) {
        clearInterval(storyAutoTimer);
        storyAutoTimer = null;
      }
    }

    // Controls
    storyNextBtn?.addEventListener("click", () => {
      slideNextStory();
      startStoryAutoTimer();
    });

    storyPrevBtn?.addEventListener("click", () => {
      slidePrevStory();
      startStoryAutoTimer();
    });

    storyDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        goToStory(idx);
        startStoryAutoTimer();
      });
    });

    // Pause on hover, resume on leave
    storiesViewport?.addEventListener("mouseenter", stopStoryAutoTimer);
    storiesViewport?.addEventListener("mouseleave", startStoryAutoTimer);

    window.addEventListener("resize", () => {
      updateStoriesTrack(false);
    });

    // Initial positioning & start 3-second auto-slide
    setTimeout(() => {
      updateStoriesTrack(false);
      startStoryAutoTimer();
    }, 150);
  }

  // Floating Section Navigation & Scroll Snap Sync
  const sectionDots = document.querySelectorAll(".section-nav .nav-dot");
  const screenSections = document.querySelectorAll(".section-screen, .footer");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          sectionDots.forEach((dot) => {
            dot.classList.toggle("active", dot.dataset.target === id);
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  screenSections.forEach((sec) => sectionObserver.observe(sec));

  sectionDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = dot.dataset.target;
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Keyboard Slide / Section Navigation
  window.addEventListener("keydown", (e) => {
    if (document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      return;
    }
    if (document.querySelector(".modal.show")) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      const activeDot = document.querySelector(".section-nav .nav-dot.active");
      if (activeDot && activeDot.nextElementSibling) {
        e.preventDefault();
        activeDot.nextElementSibling.click();
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      const activeDot = document.querySelector(".section-nav .nav-dot.active");
      if (activeDot && activeDot.previousElementSibling) {
        e.preventDefault();
        activeDot.previousElementSibling.click();
      }
    } else if (e.key === "ArrowRight") {
      const activeDot = document.querySelector(".section-nav .nav-dot.active");
      if (activeDot && activeDot.dataset.target === "courses") {
        nextBtn?.click();
      }
    } else if (e.key === "ArrowLeft") {
      const activeDot = document.querySelector(".section-nav .nav-dot.active");
      if (activeDot && activeDot.dataset.target === "courses") {
        prevBtn?.click();
      }
    }
  });

  // 6. FAQ Accordion
  document.querySelectorAll(".faq-q").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      document.querySelectorAll(".faq-item").forEach((i) => {
        if (i !== item) i.classList.remove("open");
      });
      item.classList.toggle("open");
    })
  );

  // 7. Course Data Repository
  const coursesData = {
    ielts: {
      title: "IELTS Masterclass (Band 7.5+)",
      category: "EXAM PREPARATION",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "Band 7.5 – 8.5",
      desc: "Comprehensive Academic & General Training: Listening accent mastery, Reading speed techniques, Task 1 & 2 high-scoring band descriptors, and 1-on-1 speaking interview clinics.",
      modules: [
        "Listening Section 1–4: British, American & Australian accent decoding + speed note-taking.",
        "Reading: Skimming, scanning, True/False/Not Given & Heading matching elimination formulas.",
        "Writing Task 1 & Task 2: Band 8+ structures, cohesive devices, and lexical resource boosters.",
        "Speaking 1-on-1: Part 1, 2, 3 fluency drills, hesitation elimination & mock examiner interviews.",
        "Full-length weekly mock tests with detailed individual band evaluation reports."
      ],
      enquireTitle: "IELTS Masterclass (Band 7.5+)"
    },
    pte: {
      title: "PTE Academic Fast-Track",
      category: "AI-EVALUATED PREP",
      duration: "4–6 Weeks",
      batch: "Max 8 Students",
      target: "Score 79+ (CLB 9/10)",
      desc: "Fast-track training engineered for Pearson's automated scoring algorithm. Master speech acoustics, oral fluency heuristics, and proven essay & image templates.",
      modules: [
        "Speaking: Read Aloud pitch calibration, Repeat Sentence memory tricks, and Describe Image templates.",
        "Writing: 100% scoring templates for Summarize Written Text and Write Essay.",
        "Reading: Re-order paragraphs logic and Fill in the Blanks collocation shortcuts.",
        "Listening: Write from Dictation predictive lists and Highlight Incorrect Words reflexes.",
        "Official AI score software practice with instantaneous phonetic feedback."
      ],
      enquireTitle: "PTE Academic Fast-Track"
    },
    oet: {
      title: "OET for Healthcare Professionals",
      category: "DOCTORS & NURSES",
      duration: "8–10 Weeks",
      batch: "Max 6 Students",
      target: "Grade B / 350+ Points",
      desc: "Dedicated medical English program designed for Doctors, Nurses, and Pharmacists targeting registration with the UK NHS, NMC, GMC, and Australia/Ireland boards.",
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
      category: "CANADA IMMIGRATION",
      duration: "4–6 Weeks",
      batch: "Max 8 Students",
      target: "CLB 9 – 12",
      desc: "Master 100% Canadian English exam preferred by IRCC for Canada PR Express Entry and citizenship. Practice computer-delivered tests with Canadian cultural references.",
      modules: [
        "Speaking: Describing scenes, expressing opinions, dealing with difficult situations, and expanding ideas.",
        "Writing Task 1 & 2: Writing formal/informal emails and responding to workplace survey questions.",
        "Reading: Reading correspondence, reading to apply a diagram, and viewpoint comprehension.",
        "Listening: Daily Canadian conversations, workplace news items, and interview panels.",
        "Computer-based test simulation with instant Canadian spelling and timing strategies."
      ],
      enquireTitle: "CELPIP General (Canada PR)"
    },
    toefl: {
      title: "TOEFL iBT University Prep",
      category: "US & GLOBAL ADMISSIONS",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "Score 105+ / 120",
      desc: "Rigorous academic English training targeted for top USA, Canadian, and German universities. Master integrated speaking, listening, and academic discussion writing.",
      modules: [
        "New Writing Section: Master the 'Writing for an Academic Discussion' task with precision.",
        "Integrated Speaking: Synthesizing campus announcements, conversation dialogues, and academic lectures.",
        "Listening: Note-taking strategies for 5-minute university professorial lectures and debates.",
        "Academic Reading: In-depth rhetorical purpose questions and vocabulary in academic context.",
        "Official ETS-style timed mock assessments with detailed scoring."
      ],
      enquireTitle: "TOEFL iBT University Prep"
    },
    duolingo: {
      title: "Duolingo English Test (DET)",
      category: "FAST-TRACK CERTIFICATION",
      duration: "2–4 Weeks",
      batch: "Max 8 Students",
      target: "Score 120 – 140+",
      desc: "Speed-prep for the 1-hour computer-adaptive test accepted by 4,000+ universities worldwide. Decode subscores in Literacy, Comprehension, Conversation, and Production.",
      modules: [
        "Literacy: Real vs. pseudo-English word detection & fill-in-the-blank passage reconstruction.",
        "Production: Read then Speak, Listen then Speak, and extended 5-minute timed essay writing.",
        "Speaking Sample & Video Interview: High-impact unscripted responses for university admissions officers.",
        "Adaptive Algorithm Tactics: How computer adaptive testing weights question difficulty.",
        "Speed typing clinics and interactive mock drill sets."
      ],
      enquireTitle: "Duolingo English Test (DET)"
    },
    spoken: {
      title: "Spoken English & Fluency",
      category: "SPOKEN & FLUENCY",
      duration: "8–12 Weeks",
      batch: "Max 8 Students",
      target: "100% Confident Fluency",
      desc: "Stop translating from your mother tongue in your head. Achieve instinctive, spontaneous English speaking with 70% active talking time in every class.",
      modules: [
        "Hesitation Elimination: Overcome fear of speaking and grammatical self-consciousness.",
        "Accent Neutralization & MTI: Pronunciation clarity, rhythm, intonation, and stress patterns.",
        "Thinking in English: Cognitive exercises to eliminate mental native-language translation.",
        "Public Speaking & Debates: Extempore speeches, group discussions, and storytelling frameworks.",
        "Daily conversation clubs and recorded speech analysis for rapid feedback."
      ],
      enquireTitle: "Spoken English & Fluency"
    },
    everyday: {
      title: "Everyday English",
      category: "PRACTICAL COMMUNICATION",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "Natural Social Communication",
      desc: "Practical conversational English for everyday life, shopping, travel, banking, and casual social interactions. Build an active vocabulary of modern phrases.",
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
      category: "CAREER ACCELERATION",
      duration: "2–4 Weeks",
      batch: "1-on-1 / Max 4",
      target: "Interview Offer / Visa Approval",
      desc: "Executive preparation for corporate job interviews, promotion appraisals, and US/UK/Canada embassy student or work visa interviews.",
      modules: [
        "The STAR Framework: Structuring answers for Situation, Task, Action, and Measurable Result.",
        "90-Second Power Pitch: Crafting an irresistible response to 'Tell me about yourself'.",
        "Tricky HR & Behavioral Questions: Handling salary negotiations, weaknesses, and career gaps.",
        "Visa Officer Rounds: High-confidence clarity drills for US F1/H1B, UK Tier 4, and Schengen visas.",
        "Recorded mock interviews with personalized body language and vocal delivery critique."
      ],
      enquireTitle: "Job & Visa Interview Mastery"
    },
    govt: {
      title: "Govt. Exams English (SSC, Bank, Railways)",
      category: "COMPETITIVE EXAMS",
      duration: "8–12 Weeks",
      batch: "Max 12 Students",
      target: "Top Percentile Score",
      desc: "Rigorous test-cracking techniques for SSC CGL/CHSL, IBPS PO/Clerk, SBI, Railways, and State PSCs with speed shortcuts and pattern mastery.",
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
      category: "FOUNDATION & ACCURACY",
      duration: "6–8 Weeks",
      batch: "Max 8 Students",
      target: "100% Error-Free Writing & Speech",
      desc: "Master the structure of the English language without dry rules or memorization. Learn grammar visually through practical usage and intuitive sentence creation.",
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
      target: "95%+ in Boards & Top Olympiad Ranks",
      desc: "Specialized academic curriculum for Class IX to XII students covering CBSE/ICSE prescribed literature, analytical character sketches, and high-order Olympiad reasoning.",
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

  // 8. Toast Notifications & Newsletter
  const toast = document.getElementById("toast");
  const showToast = (text) => {
    if (!toast) return;
    const span = toast.querySelector("span");
    if (span) span.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  };

  // 9. Modal Management System
  const courseModal = document.getElementById("courseModal");
  const enquireModal = document.getElementById("enquireModal");
  const demoModal = document.getElementById("demoModal");

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
    if (!document.querySelector(".modal.show")) {
      document.body.style.overflow = "";
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.show").forEach(closeModal);
  }

  // Close triggers
  document.querySelectorAll("[data-close-modal]").forEach((b) =>
    b.addEventListener("click", () => {
      const parentModal = b.closest(".modal");
      if (parentModal) closeModal(parentModal);
      else closeAllModals();
    })
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  // Demo modal openers (Navbar / Hero buttons)
  document.querySelectorAll("[data-open-demo]").forEach((b) =>
    b.addEventListener("click", () => openModal(demoModal))
  );

  // Helper to select course in Enquire dropdown
  function selectEnquiryCourse(courseName) {
    const select = document.getElementById("enquiryCourse");
    if (!select || !courseName) return;
    const search = courseName.toLowerCase().trim();
    for (let i = 0; i < select.options.length; i++) {
      const optVal = select.options[i].value.toLowerCase();
      if (
        optVal === search ||
        optVal.includes(search) ||
        search.includes(optVal) ||
        (search.includes("govt") && optVal.includes("govt")) ||
        (search.includes("board") && optVal.includes("board")) ||
        (search.includes("olympiad") && optVal.includes("olympiad")) ||
        (search.includes("ielts") && optVal.includes("ielts")) ||
        (search.includes("pte") && optVal.includes("pte")) ||
        (search.includes("oet") && optVal.includes("oet")) ||
        (search.includes("celpip") && optVal.includes("celpip")) ||
        (search.includes("toefl") && optVal.includes("toefl")) ||
        (search.includes("duolingo") && optVal.includes("duolingo")) ||
        (search.includes("spoken") && optVal.includes("spoken")) ||
        (search.includes("everyday") && optVal.includes("everyday")) ||
        (search.includes("interview") && optVal.includes("interview")) ||
        (search.includes("grammar") && optVal.includes("grammar"))
      ) {
        select.selectedIndex = i;
        return;
      }
    }
  }

  // 9. Learn More Button Handler
  const detailCatTag = document.getElementById("detailCategoryTag");
  const detailTitle = document.getElementById("detailCourseTitle");
  const detailDesc = document.getElementById("detailCourseDesc");
  const detailDuration = document.getElementById("detailDuration");
  const detailBatch = document.getElementById("detailBatch");
  const detailTarget = document.getElementById("detailTarget");
  const detailSyllabus = document.getElementById("detailSyllabusList");
  const detailEnquireBtn = document.getElementById("detailEnquireBtn");
  const detailWhatsAppBtn = document.getElementById("detailWhatsAppBtn");

  let currentDetailCourseName = "";

  document.querySelectorAll(".btn-learn-more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseId = btn.dataset.learnMore;
      const data = coursesData[courseId];
      if (!data) return;

      currentDetailCourseName = data.enquireTitle;

      if (detailCatTag) detailCatTag.textContent = data.category;
      if (detailTitle) detailTitle.textContent = data.title;
      if (detailDesc) detailDesc.textContent = data.desc;
      if (detailDuration) detailDuration.textContent = data.duration;
      if (detailBatch) detailBatch.textContent = data.batch;
      if (detailTarget) detailTarget.textContent = data.target;

      if (detailSyllabus) {
        detailSyllabus.innerHTML = data.modules
          .map(
            (m) =>
              `<div class="modal-syllabus-item"><i data-lucide="check-circle-2"></i><span>${m}</span></div>`
          )
          .join("");
      }

      if (detailWhatsAppBtn) {
        const msg = encodeURIComponent(`Hello English Pathshala! I would like to know more about the ${data.title} curriculum and upcoming batches.`);
        detailWhatsAppBtn.href = `https://wa.me/917003876568?text=${msg}`;
      }

      refreshIcons();
      openModal(courseModal);
    });
  });

  // Switch from Course Details directly to Enquiry Modal
  detailEnquireBtn?.addEventListener("click", () => {
    closeModal(courseModal);
    selectEnquiryCourse(currentDetailCourseName);
    setTimeout(() => openModal(enquireModal), 200);
  });

  // 10. Enquire Now Button Handler
  document.querySelectorAll(".btn-enquire").forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseName = btn.dataset.enquire || "";
      selectEnquiryCourse(courseName);
      openModal(enquireModal);
    });
  });

  // Helper to persist lead locally so no inquiry is ever lost
  function saveLead(leadData) {
    try {
      const existing = JSON.parse(localStorage.getItem("ep_leads") || "[]");
      existing.push({ ...leadData, timestamp: new Date().toISOString() });
      localStorage.setItem("ep_leads", JSON.stringify(existing));
    } catch (err) {
      console.warn("Could not cache lead locally", err);
    }
  }

  // Helper to trigger WhatsApp handover without popup-blocker restrictions
  function triggerWhatsApp(url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // 11. Enquiry Form Submission
  const enquiryForm = document.getElementById("enquiryForm");
  enquiryForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = enquiryForm.querySelector('button[type="submit"]');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="loading-spinner"></span> Submitting...`;
    }

    const name = document.getElementById("enquireName")?.value || "Student";
    const phone = document.getElementById("enquirePhone")?.value || "";
    const course = document.getElementById("enquiryCourse")?.value || "English Course";
    const mode = document.getElementById("enquireMode")?.value || "Online Live Batch";

    saveLead({ type: "enquiry", name, phone, course, mode });

    const msg = encodeURIComponent(
      `Hello English Pathshala! My name is ${name}. I have submitted an enquiry for ${course} (${mode}). My WhatsApp/Phone is ${phone}. Please connect with me.`
    );
    const waUrl = `https://wa.me/917003876568?text=${msg}`;

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
      }
      closeModal(enquireModal);
      showToast(`Thank you, ${name}! Your enquiry for ${course} is saved.`);
      enquiryForm.reset();

      // Reliable WhatsApp Handover
      triggerWhatsApp(waUrl);
    }, 400);
  });

  // 12. Contact Form (Book Your Free Demo) Submission
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="loading-spinner"></span> Sending Message...`;
    }

    const name = document.getElementById("contactName")?.value || "Student";
    const email = document.getElementById("contactEmail")?.value || "";
    const phone = document.getElementById("contactPhone")?.value || "";
    const course = document.getElementById("contactCourse")?.value || "Course";
    const message = document.getElementById("contactMessage")?.value || "";

    saveLead({ type: "demo_contact", name, email, phone, course, message });

    let text = `Hello English Pathshala! My name is ${name}. I would like to book a free demo for ${course}. My Email is ${email} and Phone is ${phone}.`;
    if (message) text += ` Message: ${message}`;
    const waUrl = `https://wa.me/917003876568?text=${encodeURIComponent(text)}`;

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
      }
      showToast(`Thank you, ${name}! Your demo request for ${course} is saved.`);
      contactForm.reset();

      // Reliable WhatsApp Handover
      triggerWhatsApp(waUrl);
    }, 400);
  });

  // 13. Hero Audio Play Button Animation & Pronunciation Sample
  const heroPlayBtn = document.getElementById("heroPlayBtn");
  const heroPlayIcon = document.getElementById("heroPlayIcon");
  const heroWave = document.getElementById("heroWave");
  let isPlaying = false;

  heroPlayBtn?.addEventListener("click", () => {
    isPlaying = !isPlaying;
    if (heroPlayIcon) {
      heroPlayIcon.setAttribute("data-lucide", isPlaying ? "pause" : "play");
    }
    if (heroWave) {
      heroWave.style.background = isPlaying ? "var(--primary-light)" : "var(--card-muted)";
    }
    refreshIcons();

    if (isPlaying) {
      showToast("Playing lesson practice audio...");
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Welcome to English Pathshala. How would you describe your perfect day? Today's lesson is on conversational fluency and descriptive vocabulary.");
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith("en-GB") || v.lang.startsWith("en-US") || v.lang.startsWith("en"));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
          isPlaying = false;
          if (heroPlayIcon) heroPlayIcon.setAttribute("data-lucide", "play");
          if (heroWave) heroWave.style.background = "var(--card-muted)";
          refreshIcons();
        };
        utterance.onerror = () => {
          isPlaying = false;
          if (heroPlayIcon) heroPlayIcon.setAttribute("data-lucide", "play");
          if (heroWave) heroWave.style.background = "var(--card-muted)";
          refreshIcons();
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => {
          isPlaying = false;
          if (heroPlayIcon) heroPlayIcon.setAttribute("data-lucide", "play");
          if (heroWave) heroWave.style.background = "var(--card-muted)";
          refreshIcons();
        }, 4000);
      }
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (heroPlayIcon) heroPlayIcon.setAttribute("data-lucide", "play");
      if (heroWave) heroWave.style.background = "var(--card-muted)";
      refreshIcons();
    }
  });

  // 16. Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  refreshIcons();
});

