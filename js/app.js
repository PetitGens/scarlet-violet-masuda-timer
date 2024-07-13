// Timer refresh interval in milliseconds
const REFRESH_INTERVAL = 10;

const IDLE_STATE = 2
const WORKING_STATE = 0;
const BREAK_STATE = 1;

let settingsTabOpen = false;

let workingTime = 25;
let breakTime = 5;

let startingTime;

let intervalID;

let currentState = IDLE_STATE;

// DOM elements

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
resetButton.classList.add("hidden");

startButton.addEventListener("click", startTimersLoop);
resetButton.addEventListener("click", resetTimer);

const workingStatus = document.getElementById("workingStatus");
const breakStatus = document.getElementById("breakStatus");

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

updateTimerDisplay();

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
    let workingActive;
    let breakActive;
    switch(currentState){
        case WORKING_STATE:
            workingActive = true;
            breakActive = false;
            break;
        case BREAK_STATE:
            workingActive = false;
            breakActive = true;
            break;
        default:
            workingActive = false;
            breakActive = false;
    }

    makeStatusElementActive(workingStatus, workingActive);
    makeStatusElementActive(breakStatus, breakActive);

    console.log(workingStatus);
    console.log(breakStatus);
}

function makeStatusElementActive(element, active){
    if(active && ! element.classList.contains(active)){
        element.classList.add("active");
    }

    else if(! active && element.classList.remove("active")){
        element.classList.remove("active");
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
