document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.getElementById("back-to-top");

    // Show the button when scrolling down
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    // Scroll to top and activate click effects
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Add the "tilt" effect and change color
        backToTopButton.classList.add("tilt");

        // Remove tilt effect after animation
        setTimeout(() => {
            backToTopButton.classList.remove("tilt");
        }, 300);
    });
});
