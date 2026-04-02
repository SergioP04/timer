const coffee = document.getElementById('coffee');
const timeDisplay = document.getElementById('timeDisplay');
const percentDisplay = document.getElementById('percentDisplay');
const status = document.getElementById('status');
const customMinutes = document.getElementById('customMinutes');
const setCustom = document.getElementById('setCustom');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const resetBtn = document.getElementById('resetBtn');
const addMinuteBtn = document.getElementById('addMinuteBtn');
const steam = document.getElementById('steam');
const presetButtons = document.querySelectorAll('.preset');

let totalSeconds = 0;
let remainingSeconds = 0;
let timer = null;
let isPaused = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);

  let percent = 100;
  if (totalSeconds > 0) {
    percent = Math.max(0, Math.round((remainingSeconds / totalSeconds) * 100));
  }

  coffee.style.height = `${percent}%`;
  percentDisplay.textContent = `Coffee level: ${percent}%`;

  if (percent === 100 && totalSeconds === 0) {
    status.textContent = 'LOCK IN';
  } else if (percent === 0 && totalSeconds > 0) {
    status.textContent = 'break time';
  } else if (isPaused) {
    status.textContent = 'Paused';
  } else {
    status.textContent = 'LOCK IN';
  }

  if (remainingSeconds > 0 && !isPaused) {
    steam.style.opacity = '0.9';
  }

  if (isPaused && remainingSeconds > 0) {
    steam.style.opacity = '0.35';
  }

  if (remainingSeconds === 0 && totalSeconds > 0) {
    steam.style.opacity = '0.15';
  }
}

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startTimer(minutes) {
  clearTimer();
  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;
  isPaused = false;
  updateDisplay();

  timer = setInterval(() => {
    if (!isPaused && remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();

      if (remainingSeconds === 0) {
        clearTimer();
        alert('break time');
      }
    }
  }, 1000);
}

function resetTimer() {
  clearTimer();
  totalSeconds = 0;
  remainingSeconds = 0;
  isPaused = false;
  coffee.style.height = '100%';
  timeDisplay.textContent = '00:00';
  percentDisplay.textContent = 'Coffee level: 100%';
  status.textContent = 'LOCK IN';
  steam.style.opacity = '0.9';
}

presetButtons.forEach(button => {
  button.addEventListener('click', () => {
    const minutes = Number(button.dataset.minutes);
    startTimer(minutes);
  });
});

setCustom.addEventListener('click', () => {
  const minutes = Number(customMinutes.value);

  if (!minutes || minutes < 1 || minutes > 180) {
    alert('Please enter a number between 1 and 180.');
    return;
  }

  startTimer(minutes);
});

pauseBtn.addEventListener('click', () => {
  if (remainingSeconds > 0) {
    isPaused = true;
    updateDisplay();
  }
});

resumeBtn.addEventListener('click', () => {
  if (remainingSeconds > 0) {
    isPaused = false;
    updateDisplay();
  }
});

resetBtn.addEventListener('click', resetTimer);

addMinuteBtn.addEventListener('click', () => {
  if (remainingSeconds > 0) {
    remainingSeconds += 60;
    totalSeconds += 60;
    updateDisplay();
  }
});

updateDisplay();