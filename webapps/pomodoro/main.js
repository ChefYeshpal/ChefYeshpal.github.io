// Initial settings
let workDuration = 25, shortBreak = 5, longBreak = 15, intervals = 4;
let timer = workDuration * 60; // so that the timer is always in seconds
let state = 'work'; // can be 'work', 'short', 'long'
let pomodoros = 0; // initial nos will be 0
let timerInterval = null;
let timerEndTimestamp = null;

// DOM elements
const body = document.body;
const timerBox = document.getElementById('timer-box');
const timerLabel = document.getElementById('timer-label');
const timerText = document.getElementById('timer');
const editBtn = document.getElementById('editBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const skipBtn = document.getElementById('skipBtn');
const addTaskBtn = document.getElementById('addTaskBtn');

const stats = {
  work: document.getElementById('workTime'),
  short: document.getElementById('shortBreak'),
  long: document.getElementById('longBreak'),
  pomodoro: document.getElementById('pomodoroCount')
};

const controlButtons = [startBtn, stopBtn, skipBtn, editBtn, addTaskBtn];
const statBoxes = [
  stats.work.parentElement,
  stats.short.parentElement,
  stats.long.parentElement,
  stats.pomodoro.parentElement
];

const tasksSection = document.querySelector('.tasks-section');
const tasksList = document.getElementById('tasksList');
let tasks = [];


// Progress bar elements
const timerProgressBar = document.getElementById('timerProgressBar');
const timerBarFill = document.getElementById('timerBarFill');

// Format of mm:ss
function pad(n) {
  return n < 10 ? '0' + n : n;
}


function renderTimer() {
  const min = Math.floor(timer / 60);
  const sec = timer % 60;
  const text = `${pad(min)}:${pad(sec)}`;
  timerText.textContent = text;
  stats.pomodoro.textContent = pomodoros;
  document.title = `${text} − ${state === 'work' ? 'Work' : (state === 'short' ? 'Short Break' : 'Long Break')} | Pomodoro`;

  // Progress bar logic (left to right)
  let total;
  if (state === 'work') total = workDuration * 60;
  else if (state === 'short') total = shortBreak * 60;
  else total = longBreak * 60;
  const percent = Math.max(0, Math.min(100, (timer / total) * 100));
  timerBarFill.style.width = percent + '%';
  timerBarFill.style.background = (state === 'work') ? '#e57373' : '#65a2ff';
  timerProgressBar.style.background = 'rgba(0,0,0,0.08)';
}

function updateHueClasses(isWork) {
  body.classList.toggle('work-bg', isWork);
  body.classList.toggle('break-bg', !isWork);

  timerBox.className = isWork ? 'red-bg' : 'blue-bg';

  controlButtons.forEach(btn => {
    btn.classList.toggle('work-btn', isWork);
    btn.classList.toggle('break-btn', !isWork);
  });

  statBoxes.forEach(box => {
    box.classList.toggle('work-color', isWork);
    box.classList.toggle('break-color', !isWork);
  });

  tasksSection.classList.toggle('work-task', isWork);
  tasksSection.classList.toggle('break-task', !isWork);

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.classList.toggle('work-btn', isWork);
    btn.classList.toggle('break-btn', !isWork);
  });

  if (isWork) {
    timerLabel.textContent = 'Work Time';
  } else {
    timerLabel.textContent = (state === 'short') ? 'Short Break' : 'Long Break';
  }
}

function updateTheme() {
  const isWork = (state === 'work');
  updateHueClasses(isWork);
  renderTimer();
}

function startTimer() {
  if (timerInterval) return; // prevent multiple intervals
  // set timestamp for when this session should end
  timerEndTimestamp = Date.now() + timer * 1000;

  timerInterval = setInterval(() => {
    // recalculate timer from exact elapsed wall time
    const secondsLeft = Math.max(0, Math.ceil((timerEndTimestamp - Date.now()) / 1000));
    if (secondsLeft !== timer) {
      timer = secondsLeft;
      renderTimer();
    }
    if (timer <= 0) {
      nextStage();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timerEndTimestamp = null;
  renderTimer();
}

// Send browser notification, will need to ask for permission
// Check if there is a way to bypass that permission, can't be that hard no?
function sendSessionNotification() {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      const msg = (state === 'work') ? 'Break time!' : 'Work time!';
      new Notification(msg, {
        icon: 'piko.png',
        body: (state === 'work') ? 'Now I want you to take a well deserved break!' : 'Back to work chum!'
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          sendSessionNotification();
        }
      });
    }
  }
}

// Move to next session (work/break/long break as in order)
function nextStage() {
  stopTimer();
  sendSessionNotification();
  if (state === 'work') {
    pomodoros += 1;
    stats.pomodoro.textContent = pomodoros;
    if (pomodoros % intervals === 0) {
      state = 'long';
      timer = longBreak * 60;
    } else {
      state = 'short';
      timer = shortBreak * 60;
    }
  } else {
    state = 'work';
    timer = workDuration * 60;
  }
  updateTheme();
  renderTimer();
}

// Fun toast for skipping lazily
function showLazyNotification() {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '15px';
  toast.style.right = '15px';
  toast.style.padding = '12px 18px';
  toast.style.background = '#d65353';
  toast.style.color = '#fff';
  toast.style.borderRadius = '12px';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';
  toast.style.boxShadow = '0 4px 12px rgba(255,0,0,0.6)';
  toast.style.fontWeight = '700';
  toast.style.zIndex = 2000;

  const img = document.createElement('img');
  img.src = 'piko.png';
  img.width = 32;
  img.height = 32;
  img.alt = 'Piko';

  const text = document.createElement('span');
  text.textContent = 'You are so lazy dude...';

  toast.appendChild(img);
  toast.appendChild(text);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s ease';
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3500);
}

// Button events
startBtn.onclick = () => startTimer();
stopBtn.onclick = () => stopTimer();

skipBtn.onclick = () => {
  stopTimer();
  if (state === 'work') showLazyNotification();
  nextStage();
};

// Edit dialog code with animation
const dialogBackdrop = document.getElementById('dialogBackdrop');
const sessionDialog = document.getElementById('sessionDialog');
const workInput = document.getElementById('workInput');
const shortInput = document.getElementById('shortInput');
const longInput = document.getElementById('longInput');
const intervalInput = document.getElementById('intervalInput');

function showDialog() {
  workInput.value = workDuration;
  shortInput.value = shortBreak;
  longInput.value = longBreak;
  intervalInput.value = intervals;
  dialogBackdrop.style.display = 'block';
  sessionDialog.classList.add('show');
  sessionDialog.style.display = 'block';
}

function closeDialog() {
  dialogBackdrop.style.display = 'none';
  sessionDialog.classList.remove('show');
  setTimeout(() => {
    sessionDialog.style.display = 'none';
  }, 400);
}

// For default values in dialog settings
function saveDialogSettings() {
  workDuration = Math.max(1, parseInt(workInput.value) || 25);
  shortBreak = Math.max(1, parseInt(shortInput.value) || 5);
  longBreak = Math.max(5, parseInt(longInput.value) || 15);
  intervals = Math.max(1, parseInt(intervalInput.value) || 4);
  stats.work.textContent = workDuration;
  stats.short.textContent = shortBreak;
  stats.long.textContent = longBreak;
  stopTimer();
  timer = (state === 'work' ? workDuration : (state === 'short' ? shortBreak : longBreak)) * 60;
  updateTheme();
  closeDialog();
}

document.getElementById('dialogSave').onclick = saveDialogSettings;

// Allow Enter key to save in dialog
sessionDialog.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveDialogSettings();
  }
});

document.getElementById('dialogCancel').onclick = closeDialog;
editBtn.onclick = showDialog;
dialogBackdrop.onclick = closeDialog;

// Task List management
function renderTasks() {
  tasksList.innerHTML = '';
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.checked;
    checkbox.onchange = () => {
      task.checked = checkbox.checked;
      renderTasks();
    };

    const txt = document.createElement('span');
    txt.className = 'task-text' + (task.checked ? ' checked' : '');
    txt.textContent = task.text;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(txt);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn';
    editBtn.textContent = 'E';
    editBtn.onclick = () => {
      const newText = prompt('Edit task:', task.text);
      if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        renderTasks();
      }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn';
    deleteBtn.textContent = 'D';
    deleteBtn.onclick = () => {
      tasks.splice(idx, 1);
      renderTasks();
    };

    // Add color classes for current state
    editBtn.classList.toggle('work-btn', state === 'work');
    editBtn.classList.toggle('break-btn', state !== 'work');
    deleteBtn.classList.toggle('work-btn', state === 'work');
    deleteBtn.classList.toggle('break-btn', state !== 'work');

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    tasksList.appendChild(li);
  });
};

addTaskBtn.onclick = function () {
  const text = prompt('Task to do:');
  if (text && text.trim() !== '') {
    tasks.push({ text: text.trim(), checked: false });
    renderTasks();
  }
};

// Initialize theme and tasks on load
updateTheme();
renderTasks();

// If browser/tab regains visibility, re-sync timer display from calculation.
document.addEventListener('visibilitychange', () => {
  renderTimer();
});