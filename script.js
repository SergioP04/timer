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
const character = document.getElementById('characterImg');
const characterWrap = document.getElementById('characterWrap');
const timerCard = document.getElementById('timerCard');

let totalSeconds = 0;
let remainingSeconds = 0;
let timer = null;
let isPaused = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function removeBreakFX() {
  characterWrap.classList.remove('break-mode');
  timerCard.classList.remove('break-mode');
}

function addBreakFX() {
  characterWrap.classList.add('break-mode');
  timerCard.classList.add('break-mode');
}

function setMood(state) {
  if (!character) return;

  removeBreakFX();

  if (state === 'lockin') {
    character.style.transform = 'scale(1)';
    character.style.filter = 'drop-shadow(0 0 16px rgba(255, 0, 70, 0.35))';
    character.style.opacity = '1';
  }

  if (state === 'bored') {
    character.style.transform = 'rotate(-5deg) scale(0.96)';
    character.style.filter = 'grayscale(35%) brightness(0.72) drop-shadow(0 0 10px rgba(255, 0, 70, 0.12))';
    character.style.opacity = '0.9';
  }

  if (state === 'paused') {
    character.style.transform = 'rotate(-2deg) scale(0.94)';
    character.style.filter = 'grayscale(50%) brightness(0.65)';
    character.style.opacity = '0.78';
  }

  if (state === 'break') {
    character.style.transform = 'scale(1.14)';
    character.style.filter = 'drop-shadow(0 0 30px rgba(255, 0, 70, 0.85)) brightness(1.14)';
    character.style.opacity = '1';
    addBreakFX();
  }
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
    setMood('lockin');
  } else if (percent === 0 && totalSeconds > 0) {
    status.textContent = 'BREAK TIME';
    setMood('break');
  } else if (isPaused) {
    status.textContent = 'PAUSED';
    setMood('paused');
  } else {
    status.textContent = 'LOCK IN';
    setMood('bored');
  }

  if (remainingSeconds > 0 && !isPaused) {
    steam.style.opacity = '0.9';
  }

  if (isPaused && remainingSeconds > 0) {
    steam.style.opacity = '0.3';
  }

  if (remainingSeconds === 0 && totalSeconds > 0) {
    steam.style.opacity = '0.12';
  }

  if (remainingSeconds === 0 && totalSeconds === 0) {
    steam.style.opacity = '0.9';
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
        alert('BREAK TIME');
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
  setMood('lockin');
}

presetButtons.forEach((button) => {
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