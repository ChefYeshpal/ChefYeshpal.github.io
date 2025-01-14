document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        item.style.setProperty('--rotateX', `${-y / 40}deg`);
        item.style.setProperty('--rotateY', `${x / 40}deg`);
    });

    item.addEventListener('mouseleave', () => {
        item.style.setProperty('--rotateX', `0deg`);
        item.style.setProperty('--rotateY', `0deg`);
    });
});
