document.addEventListener("DOMContentLoaded", function () {
    // 🎯 Skill Progress Bar Animation
    const skillBars = document.querySelectorAll(".skill-fill");

    const revealSkills = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                bar.style.width = bar.getAttribute("data-skill") + "%";
            }
        });
    };

    window.addEventListener("scroll", revealSkills);
    revealSkills(); // Run on page load


    // 🎯 Sidebar Navigation - Click to Highlight & Scroll Tracking
    const navLinks = document.querySelectorAll(".navigation-bar a");
    const sections = document.querySelectorAll("section");

    // Detect current section on page load (fixes refresh issue)
    const currentHash = window.location.hash || "#home"; // Get hash or default to #home
    const activeLink = document.querySelector(`.navigation-bar a[href="${currentHash}"]`);
    
    if (activeLink) {
        navLinks.forEach(item => item.classList.remove("active"));
        activeLink.classList.add("active");
    }

    // Click event to highlight the selected menu item and update URL
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");

            // Update URL in the address bar without reloading
            history.pushState(null, null, this.getAttribute("href"));
        });
    });

    // Highlight active section on scroll
    window.addEventListener("scroll", function () {
        let fromTop = window.scrollY + 100;

        sections.forEach(section => {
            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                let targetId = section.getAttribute("id");
                let targetLink = document.querySelector(`.navigation-bar a[href="#${targetId}"]`);

                if (targetLink) {
                    navLinks.forEach(item => item.classList.remove("active"));
                    targetLink.classList.add("active");

                    // Update URL in the address bar while scrolling
                    history.replaceState(null, null, `#${targetId}`);
                }
            }
        });
    });


    // 🎯 Toggle Sidebar Menu for Mobile
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.querySelector(".side-menu");

    menuToggle.addEventListener("click", function () {
        sideMenu.classList.toggle("active");
    });


    // 🎯 Modal Handling
    window.openModal = function (modalId) {
        document.getElementById(modalId).classList.add("show");
    };

    window.closeModal = function (modalId) {
        document.getElementById(modalId).classList.remove("show");
    };


    // 🎯 Contact Form Submission
    document.getElementById("contactForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        let formData = new FormData(this);

        let response = await fetch("/send-message", {
            method: "POST",
            body: formData
        });

        let result = await response.json();
        alert(result.message);
    });

});
