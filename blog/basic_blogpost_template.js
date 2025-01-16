// Select the back button
const backButton = document.querySelector('.back-button');

// Apply tilt effect only on desktop
if (window.innerWidth > 768) {
    backButton.addEventListener('mousemove', (event) => {
        const rect = backButton.getBoundingClientRect();
        const x = event.clientX - rect.left; // Mouse position inside the button
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15; // Adjust rotation intensity
        const rotateY = ((x - centerX) / centerX) * 15;

        backButton.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Reset the tilt on mouse leave
    backButton.addEventListener('mouseleave', () => {
        backButton.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
    });
}
