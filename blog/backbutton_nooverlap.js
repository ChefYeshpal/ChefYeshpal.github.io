const backButton = document.querySelector('.back-button');
const heading = document.querySelector('h1');

function adjustBackButtonPosition() {
    const headingRect = heading.getBoundingClientRect();
    const backButtonRect = backButton.getBoundingClientRect();

    // Place the button just below the heading
    if (backButtonRect.top < headingRect.bottom) {
        backButton.style.top = `${headingRect.bottom + 10}px`; // 10px buffer
    } else {
        backButton.style.top = '2em'; // Default position
    }
}

// Initial check
adjustBackButtonPosition();

// Adjust position on page load, scroll, or resize
window.addEventListener('scroll', adjustBackButtonPosition);
window.addEventListener('resize', adjustBackButtonPosition);
