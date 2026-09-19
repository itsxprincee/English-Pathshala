/* =========================================================
   ENGLISH PATHSHALA
   PREMIUM ONE-SCREEN WEBSITE
========================================================= */


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const siteHeader = document.getElementById("siteHeader");

function handleHeaderScroll() {

    if (window.scrollY > 20) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }

}

window.addEventListener("scroll", handleHeaderScroll);

handleHeaderScroll();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {

    const isOpen = mobileMenu.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});


const mobileLinks =
    mobileMenu.querySelectorAll("a");

mobileLinks.forEach((link) => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("main section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");

const sectionObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id =
                    entry.target.getAttribute("id");

                navLinks.forEach((link) => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${id}`
                    ) {
                        link.classList.add("active");
                    }

                });

            });

        },
        {
            threshold: 0.35
        }
    );

sections.forEach((section) => {

    sectionObserver.observe(section);

});


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },
        {
            threshold: 0.12
        }
    );

revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {

    question.addEventListener("click", () => {

        const item =
            question.closest(".faq-item");

        const isOpen =
            item.classList.contains("open");


        document
            .querySelectorAll(".faq-item")
            .forEach((otherItem) => {

                otherItem.classList.remove("open");

                const otherButton =
                    otherItem.querySelector(
                        ".faq-question"
                    );

                if (otherButton) {
                    otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });


        if (!isOpen) {

            item.classList.add("open");

            question.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});


/* =========================================================
   COURSE MODAL
========================================================= */

const courseModal =
    document.getElementById("courseModal");

const modalClose =
    document.getElementById("modalClose");

const modalCourseName =
    document.getElementById("modalCourseName");

const modalCTA =
    document.getElementById("modalCTA");

const courseButtons =
    document.querySelectorAll(".course-btn");


function openCourseModal(courseName) {

    modalCourseName.textContent =
        courseName;

    modalCTA.setAttribute(
        "href",
        `#contact`
    );

    courseModal.classList.add("open");

    courseModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeCourseModal() {

    courseModal.classList.remove("open");

    courseModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


courseButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const course =
            button.dataset.course;

        openCourseModal(course);

    });

});


modalClose.addEventListener(
    "click",
    closeCourseModal
);


courseModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === courseModal
        ) {
            closeCourseModal();
        }

    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            courseModal.classList.contains("open")
        ) {

            closeCourseModal();

        }

    }
);


/* =========================================================
   CLOSE MODAL WHEN GOING TO CONTACT
========================================================= */

modalCTA.addEventListener("click", () => {

    closeCourseModal();

});


/* =========================================================
   MENTOR IMAGE FALLBACK
========================================================= */

const mentorPhoto =
    document.getElementById("mentorPhoto");

const mentorFallback =
    document.getElementById("mentorFallback");


mentorPhoto.addEventListener(
    "error",
    () => {

        mentorPhoto.style.display =
            "none";

        mentorFallback.style.display =
            "grid";

    }
);


mentorPhoto.addEventListener(
    "load",
    () => {

        mentorFallback.style.display =
            "none";

    }
);


/* =========================================================
   DEMO FORM
========================================================= */

const demoForm =
    document.getElementById("demoForm");

demoForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const course =
            document
                .getElementById("course")
                .value;

        const message =
            document
                .getElementById("message")
                .value
                .trim();


        if (!name || !phone || !course) {

            alert(
                "Please fill in your name, phone number and interested program."
            );

            return;

        }


        const whatsappNumber =
            "917003876568";


        const whatsappMessage =
            `Hello English Pathshala,

I would like to book a free demo.

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}
Interested Program: ${course}
Goal: ${message || "Not provided"}

Please let me know the next steps. Thank you.`;


        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                whatsappMessage
            )}`;


        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


/* =========================================================
   INITIAL PAGE STATE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const homeReveal =
            document.querySelectorAll(
                "#home .reveal"
            );

        setTimeout(() => {

            homeReveal.forEach(
                (element) => {

                    element.classList.add(
                        "visible"
                    );

                }
            );

        }, 150);

    }
);


/* =========================================================
   PREVENT BODY JUMP WHEN MODAL OPENS
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 780 &&
            mobileMenu.classList.contains("open")
        ) {

            mobileMenu.classList.remove(
                "open"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);