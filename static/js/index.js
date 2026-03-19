document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle?.querySelector("i");
    const navLinks = document.querySelectorAll(".navigation-bar a");
    const sections = document.querySelectorAll("main section[id]");
    const skillBars = document.querySelectorAll(".skill-fill");
    const reveals = document.querySelectorAll(".reveal");
    const typingTarget = document.querySelector(".typing");
    const form = document.getElementById("contactForm");
    const formStatus = document.getElementById("form-status");

    const savedTheme = localStorage.getItem("theme");
    const preferredLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = savedTheme || (preferredLight ? "light" : "dark");

    const setTheme = (theme) => {
        body.classList.toggle("light-theme", theme === "light");
        localStorage.setItem("theme", theme);
        if (themeIcon) {
            themeIcon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    };

    setTheme(initialTheme);

    themeToggle?.addEventListener("click", () => {
        const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
        setTheme(nextTheme);
    });

    menuToggle?.addEventListener("click", () => {
        sideMenu.classList.toggle("active");
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
            sideMenu.classList.remove("active");
        });
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, { threshold: 0.18 });

    reveals.forEach((item) => sectionObserver.observe(item));

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
                bar.style.width = `${bar.dataset.skill}%`;
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    document.querySelectorAll(".skills-panel").forEach((panel) => skillObserver.observe(panel));

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        });
    }, {
        threshold: 0.45,
        rootMargin: "-10% 0px -35% 0px"
    });

    sections.forEach((section) => navObserver.observe(section));

    if (typingTarget) {
        const words = JSON.parse(typingTarget.dataset.words || "[]");
        let wordIndex = 0;
        let charIndex = 1;
        let isDeleting = false;

        typingTarget.textContent = words[0] || "";

        const type = () => {
            const currentWord = words[wordIndex] || "";
            typingTarget.textContent = isDeleting
                ? currentWord.slice(0, charIndex--)
                : currentWord.slice(0, charIndex++);

            let delay = isDeleting ? 45 : 90;

            if (!isDeleting && charIndex > currentWord.length) {
                isDeleting = true;
                delay = 1400;
            } else if (isDeleting && charIndex < 1) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                charIndex = 1;
                delay = 300;
            }

            window.setTimeout(type, delay);
        };

        if (words.length) {
            type();
        }
    }

    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) {
            return;
        }

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        body.style.overflow = "hidden";
    };

    const closeModal = (modal) => {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        body.style.overflow = "";
    };

    document.querySelectorAll("[data-modal-target]").forEach((button) => {
        button.addEventListener("click", () => openModal(button.dataset.modalTarget));
    });

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.closeModal);
            if (modal) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll(".custom-modal").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        document.querySelectorAll(".custom-modal.show").forEach((modal) => closeModal(modal));
    });

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        formStatus.textContent = "Sending your message...";

        const submitButton = form.querySelector(".send-btn");
        submitButton.disabled = true;

        try {
            const response = await fetch("/send-message", {
                method: "POST",
                body: new FormData(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to send message right now.");
            }

            form.reset();
            formStatus.textContent = result.message || "Message sent successfully!";
        } catch (error) {
            formStatus.textContent = error.message || "Something went wrong while sending the message.";
        } finally {
            submitButton.disabled = false;
        }
    });

    skillBars.forEach((bar) => {
        bar.style.width = "0";
    });
});
