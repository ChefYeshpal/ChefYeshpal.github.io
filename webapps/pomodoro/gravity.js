const gravityToggle = document.getElementById('gravityToggle');
const mainContent = document.querySelector('main');

let gravityEnabled = false;
let fallingElements = [];
let animationId = null;

gravityToggle.addEventListener('change', () => {
  gravityEnabled = gravityToggle.checked;
  if (gravityEnabled) {
    enableGravity();
  } else {
    disableGravity();
  }
});

function enableGravity() {
  fallingElements = [];
  const elements = Array.from(mainContent.children);

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();

    el.style.width = rect.width + "px";

    const origX = rect.left;
    const origY = rect.top;

    el.style.position = "fixed";
    el.style.left = origX + "px";
    el.style.top = origY + "px";
    el.style.margin = "0";
    el.style.zIndex = 1000;

    const obj = {
      el: el,
      x: origX,
      y: origY,
      origX: origX,
      origY: origY,
      vy: 0,
      width: rect.width,
      height: rect.height,
      bottomLimit: window.innerHeight - rect.height,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0
    };

    addDragListeners(obj);

    fallingElements.push(obj);
  });

  animateGravity();
}

function animateGravity() {
  animationId = requestAnimationFrame(animateGravity);
  fallingElements.forEach(item => {
    if (!item.dragging) {
      if (item.y < item.bottomLimit) {
        item.vy += 1.5;
        item.y += item.vy;
        if (item.y > item.bottomLimit) {
          item.y = item.bottomLimit;
          item.vy = -item.vy * 0.6;
          if (Math.abs(item.vy) < 0.5) {
            item.vy = 0;
          }
        }
        item.el.style.top = item.y + 'px';
      }
    }
  });
}

function disableGravity() {
  cancelAnimationFrame(animationId);
  animationId = null;

  const duration = 700;
  const startTime = performance.now();

  function floatBack(timestamp) {
    let elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / duration, 1);

    fallingElements.forEach(item => {
      let currentX = parseFloat(item.el.style.left);
      let currentY = parseFloat(item.el.style.top);
      const newX = currentX + (item.origX - currentX) * progress;
      const newY = currentY + (item.origY - currentY) * progress;
      item.el.style.left = newX + 'px';
      item.el.style.top = newY + 'px';
    });

    if (progress < 1) {
      requestAnimationFrame(floatBack);
    } else {
      fallingElements.forEach(item => {
        item.el.style.position = "";
        item.el.style.top = "";
        item.el.style.left = "";
        item.el.style.width = "";
        item.el.style.margin = "";
        item.el.style.zIndex = "";
        removeDragListeners(item);
      });
      fallingElements = [];
    }
  }

  requestAnimationFrame(floatBack);
}

function addDragListeners(item) {
  item.el.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', drag);

  item.el.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', drag, { passive: false });

  function startDrag(e) {
    e.preventDefault();
    item.dragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    item.dragOffsetX = clientX - item.x;
    item.dragOffsetY = clientY - item.y;
    item.el.style.zIndex = 2000;
    item.vy = 0;
  }

  function drag(e) {
    if (!item.dragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    item.x = clientX - item.dragOffsetX;
    item.y = clientY - item.dragOffsetY;
    item.x = Math.min(Math.max(item.x, 0), window.innerWidth - item.width);
    if (item.y > item.bottomLimit) item.y = item.bottomLimit;
    item.el.style.left = item.x + 'px';
    item.el.style.top = item.y + 'px';
  }

  function stopDrag() {
    if (item.dragging) {
      item.dragging = false;
      item.el.style.zIndex = 1000;
      item.vy = 0;
    }
  }

  item._dragHandlers = { startDrag, drag, stopDrag };
}

function removeDragListeners(item) {
  if (!item._dragHandlers) return;
  item.el.removeEventListener('mousedown', item._dragHandlers.startDrag);
  window.removeEventListener('mouseup', item._dragHandlers.stopDrag);
  window.removeEventListener('mousemove', item._dragHandlers.drag);
  item.el.removeEventListener('touchstart', item._dragHandlers.startDrag);
  window.removeEventListener('touchend', item._dragHandlers.stopDrag);
  window.removeEventListener('touchmove', item._dragHandlers.drag);
  delete item._dragHandlers;
}