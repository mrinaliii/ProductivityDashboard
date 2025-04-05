// DOM Elements
const timeDisplay = document.getElementById('current-time');
const dateDisplay = document.getElementById('current-date');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('task-list');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const statusDisplay = document.getElementById('status');

// Clock Functionality
function updateClock() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    });
    dateDisplay.textContent = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

setInterval(updateClock, 1000);
updateClock();

// YouTube Player
let ytPlayer;
let isPlaying = false;

function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
}

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-audio', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.setVolume(50);
    
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            event.target.pauseVideo();
        } else {
            event.target.playVideo();
        }
    });
    
    volumeSlider.addEventListener('input', (e) => {
        event.target.setVolume(e.target.value);
    });
}

function onPlayerStateChange(event) {
    const icon = playPauseBtn.querySelector('i');
    isPlaying = event.data === YT.PlayerState.PLAYING;
    icon.className = isPlaying ? "bi bi-pause-circle-fill" : "bi bi-caret-right-fill";
}

loadYouTubeAPI();

// To-Do List
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;
        taskItem.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
        });
        taskList.appendChild(taskItem);
        taskInput.value = '';
        taskInput.focus();
    }
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

// Pomodoro Timer
let timer;
let isTimerRunning = false;
let isWorkPhase = true;
let totalSeconds = 25 * 60;

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    minutesDisplay.textContent = minutes;
    secondsDisplay.textContent = seconds;
}

function startTimer() {
    if (!isTimerRunning) {
        if (totalSeconds <= 0) {
            totalSeconds = (isWorkPhase ? workTimeInput.value : breakTimeInput.value) * 60;
            updateTimerDisplay();
        }
        
        isTimerRunning = true;
        startPauseBtn.textContent = 'Pause';
        
        timer = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                isTimerRunning = false;
                startPauseBtn.textContent = 'Start';
                isWorkPhase = !isWorkPhase;
                
                statusDisplay.textContent = isWorkPhase ? "Time to work!" : "Take a break!";
                totalSeconds = (isWorkPhase ? workTimeInput.value : breakTimeInput.value) * 60;
                updateTimerDisplay();
                
                alert(isWorkPhase ? "Break over! Time to work!" : "Pomodoro completed! Take a break!");
            }
        }, 1000);
    } else {
        clearInterval(timer);
        isTimerRunning = false;
        startPauseBtn.textContent = 'Start';
    }
}

function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    isWorkPhase = true;
    totalSeconds = workTimeInput.value * 60;
    updateTimerDisplay();
    startPauseBtn.textContent = 'Start';
    statusDisplay.textContent = "Ready to work";
}

workTimeInput.addEventListener('change', resetTimer);
breakTimeInput.addEventListener('change', resetTimer);
startPauseBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

resetTimer();