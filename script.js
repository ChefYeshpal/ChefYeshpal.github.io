document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / -70;
        const y = e.clientY - rect.top - rect.height / 70;

        item.style.setProperty('--rotateX', `${-y / 10}deg`);
        item.style.setProperty('--rotateY', `${x / 10}deg`);
    });

    item.addEventListener('mouseleave', () => {
        item.style.setProperty('--rotateX', `0deg`);
        item.style.setProperty('--rotateY', `0deg`);
    });
});
