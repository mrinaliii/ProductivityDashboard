// DOM Elements - grabbing all the elements we need to work with
const timeDisplay = document.getElementById('currentTime');
const dateDisplay = document.getElementById('currentDate');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeSlider = document.getElementById('volumeSlider');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const statusDisplay = document.getElementById('status');

// Clock Functionality - let's keep track of the time
function updateClock() {
    const now = new Date();
    // Format the time without seconds for a cleaner look
    timeDisplay.textContent = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    });
    // Show a nice formatted date
    dateDisplay.textContent = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Update the clock every second
setInterval(updateClock, 1000);
// Initialize the clock right away
updateClock();

// YouTube Player - for some nice background lofi beats
let ytPlayer;
let isPlaying = false;

// Load the YouTube API script
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
}

// This function gets called automatically by the YouTube API
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('ytAudio', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Setup the player once it's ready
function onPlayerReady(event) {
    // Set initial volume to 50%
    event.target.setVolume(50);
    
    // Handle play/pause button clicks
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            event.target.pauseVideo();
        } else {
            event.target.playVideo();
        }
    });
    
    // Handle volume slider changes
    volumeSlider.addEventListener('input', (e) => {
        event.target.setVolume(e.target.value);
    });
}

// Update the UI when the player state changes
function onPlayerStateChange(event) {
    const icon = playPauseBtn.querySelector('i');
    isPlaying = event.data === YT.PlayerState.PLAYING;
    // Change the button icon based on play state
    icon.className = isPlaying ? "bi bi-pause-circle-fill" : "bi bi-caret-right-fill";
}

loadYouTubeAPI();

// To-Do List - keeping track of tasks
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        // Create a new task item
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;
        // Toggle completion status on click
        taskItem.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
        });
        taskList.appendChild(taskItem);
        // Clear the input and focus it for the next task
        taskInput.value = '';
        taskInput.focus();
    }
}

// Add task when button is clicked
addTaskBtn.addEventListener('click', addTask);
// Also add task when Enter key is pressed
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

// Pomodoro Timer - focus and break cycle timer
let timer;
let isTimerRunning = false;
let isWorkPhase = true;
let totalSeconds = 25 * 60; // Default 25 minutes

// Update the timer display with current minutes and seconds
function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    minutesDisplay.textContent = minutes;
    secondsDisplay.textContent = seconds;
}

// Start or pause the timer
function startTimer() {
    if (!isTimerRunning) {
        // If timer ran out, reset it before starting again
        if (totalSeconds <= 0) {
            totalSeconds = (isWorkPhase ? workTimeInput.value : breakTimeInput.value) * 60;
            updateTimerDisplay();
        }
        
        isTimerRunning = true;
        startPauseBtn.textContent = 'Pause';
        
        // Set up the interval to count down every second
        timer = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimerDisplay();
            } else {
                // Timer finished - switch phases
                clearInterval(timer);
                isTimerRunning = false;
                startPauseBtn.textContent = 'Start';
                isWorkPhase = !isWorkPhase;
                
                // Update the status message
                statusDisplay.textContent = isWorkPhase ? "Time to work!" : "Take a break!";
                totalSeconds = (isWorkPhase ? workTimeInput.value : breakTimeInput.value) * 60;
                updateTimerDisplay();
                
                // Let the user know the phase has changed
                alert(isWorkPhase ? "Break over! Time to work!" : "Pomodoro completed! Take a break!");
            }
        }, 1000);
    } else {
        // Pause the timer
        clearInterval(timer);
        isTimerRunning = false;
        startPauseBtn.textContent = 'Start';
    }
}

// Reset the timer to work phase with full time
function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    isWorkPhase = true;
    totalSeconds = workTimeInput.value * 60;
    updateTimerDisplay();
    startPauseBtn.textContent = 'Start';
    statusDisplay.textContent = "Ready to work";
}

// Reset timer when work or break time inputs change
workTimeInput.addEventListener('change', resetTimer);
breakTimeInput.addEventListener('change', resetTimer);
startPauseBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize the timer
resetTimer();
