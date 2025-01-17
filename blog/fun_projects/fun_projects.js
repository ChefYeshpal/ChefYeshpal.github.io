document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".pattern-container");
    const cursor = document.querySelector(".cursor");

    // Generate semi-circle grid
    const rows = Math.ceil(window.innerHeight / 60);
    const cols = Math.ceil(window.innerWidth / 110);

    for (let i = 0; i < rows * cols; i++) {
        const semiCircle = document.createElement("div");
        semiCircle.classList.add("semi-circle");
        container.appendChild(semiCircle);
    }

    // Cursor tracking
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Animation effect on cursor movement
    let timeout;
    document.addEventListener("mousemove", () => {
        clearTimeout(timeout);
        document.querySelectorAll(".semi-circle").forEach((el) => {
            el.style.transform = "translateY(-10px)";
        });

        timeout = setTimeout(() => {
            document.querySelectorAll(".semi-circle").forEach((el) => {
                el.style.transform = "translateY(0)";
            });
        }, 500); // Reset after 0.5s
    });
});
