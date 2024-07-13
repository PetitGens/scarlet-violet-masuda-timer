// Timer refresh interval in milliseconds
const REFRESH_INTERVAL = 10;

const IDLE_STATE = 0;
const WAITING_TIME = 1;
const PICKUP_TIME = 2;
const SANDWICH_TIME = 3;

let settingsTabOpen = false;

let workingTime = 25;
let breakTime = 5;

let startingTime;

let intervalID;

let currentState = SANDWICH_TIME;

// DOM elements

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
resetButton.classList.add("hidden");

startButton.addEventListener("click", startTimersLoop);
resetButton.addEventListener("click", resetTimer);

const statusBar = document.getElementById("statusBar");

const playButtonBlack = document.getElementById("playButtonBlack");
const playButtonBlue = document.getElementById("playButtonBlue");
const restartButtonBlack = document.getElementById("restartButtonBlack");
const restartButtonBlue = document.getElementById("restartButtonBlue");

const activeSettingsButton = document.getElementById("activeSettingsButton");
const inactiveSettingsButton = document.getElementById("inactiveSettingsButton");

const timerContainer = document.getElementById("timerContainer");

const durationInputArea = document.getElementById("durationInput");
const workDurationField = document.getElementById("workDuration");
const breakDurationField = document.getElementById("breakDuration");

// Switches between timer and duration input when the gear icon is clicked
activeSettingsButton.addEventListener("click", onGearClicked);

/* Add events listeners to both buttons so that they turn blue when the mouse hover them*/

startButton.addEventListener("mouseenter", () =>{
    playButtonBlue.classList.toggle("hidden");
    playButtonBlack.classList.toggle("hidden");
})

startButton.addEventListener("mouseleave", () =>{
    playButtonBlue.classList.toggle("hidden");
    playButtonBlack.classList.toggle("hidden");
})

resetButton.addEventListener("mouseenter", () =>{
    restartButtonBlack.classList.toggle("hidden");
    restartButtonBlue.classList.toggle("hidden");
})

resetButton.addEventListener("mouseleave", () =>{
    restartButtonBlack.classList.toggle("hidden");
    restartButtonBlue.classList.toggle("hidden");
})

//updateTimerDisplay();
updateStatusDisplay();

function updateTimerDisplay(){
    const timerElement = document.getElementById("timer");
    
    if(currentState === IDLE_STATE){
        timerElement.textContent = `${workingTime.toString().padStart(2, '0')}:00`;
        return;
    }
 
    // Elased time in milliseconds
    const elapsed = new Date() - startingTime;

    const currentTimerTime = currentState === WORKING_STATE ? workingTime : breakTime;

    // Remaining time in milliseconds
    const remaining = currentTimerTime * 60000 - elapsed;

    if(remaining <= 0){
        timerElement.textContent = "00:00";
        onTimeOut();
        return;
    }

    minutes = Math.floor(remaining / 60000).toString().padStart(2, '0');
    seconds = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');

    timerElement.textContent = `${minutes}:${seconds}`;
}

function updateStatusDisplay(){
    switch(currentState) {
        case IDLE_STATE:
            statusBar.textContent = "Idle";
            break;
        case WAITING_TIME:
            statusBar.textContent = "Wait for eggs";
            break;
        case PICKUP_TIME:
            statusBar.textContent = "Check the egg baskets";
            break;
        case SANDWICH_TIME:
            statusBar.textContent = "Make a sandwich";
            break;
    }
}

function onTimeOut(){
    clearInterval(intervalID); // Stops the countdown

    currentState = (currentState + 1) % 2; // Toggle the current state
    updateStatusDisplay();

    startTimer();
}

function resetTimer(){
    // Enable settings button
    toggleSettingsButtonActivity();

    clearInterval(intervalID);

    currentState = IDLE_STATE;
    updateTimerDisplay();
    updateStatusDisplay();

    toggleStartResetButtons();
}

function startTimersLoop(){
    // Disable settings button
    toggleSettingsButtonActivity();

    currentState = WORKING_STATE;
    updateStatusDisplay();
    toggleStartResetButtons();
    startTimer();
}

function startTimer(){
    startingTime = new Date()

    updateTimerDisplay();

    intervalID = setInterval(() => {
        updateTimerDisplay();
    }, REFRESH_INTERVAL);
}

function toggleStartResetButtons(){
    startButton.classList.toggle("hidden");
    resetButton.classList.toggle("hidden");
}

function toggleSettingsButtonActivity(){
    activeSettingsButton.classList.toggle("hidden");
    inactiveSettingsButton.classList.toggle("hidden");
}

function onGearClicked(){
    if(settingsTabOpen){
        const workDurationValue = Number.parseInt(workDurationField.value);
        const breakDurationValue = Number.parseInt(breakDurationField.value);

        if(workDurationValue < 0 || workDurationValue > 99){
            workDurationField.classList.add("invalid");
            setTimeout(()=>{
                workDurationField.classList.remove("invalid");
            }, 500)
            return;
        }

        if(breakDurationValue < 0 || breakDurationValue > 99){
            breakDurationField.classList.add("invalid");
            setTimeout(()=>{
                breakDurationField.classList.remove("invalid");
            }, 1000);
            return;
        }

        workingTime = workDurationValue;
        breakTime = breakDurationValue;

        minutes = workingTime;
        updateTimerDisplay();
        settingsTabOpen = false;
    }

    else{
        settingsTabOpen = true;
    }

    durationInputArea.classList.toggle("hidden");
    timerContainer.classList.toggle("hidden");
}
