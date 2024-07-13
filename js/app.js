// Timer refresh interval in milliseconds
const REFRESH_INTERVAL = 10;

const IDLE_STATE = 0;
const WAITING_TIME = 1;
const PICKUP_TIME = 2;
const SANDWICH_TIME = 3;

let settingsTabOpen = false;

// The time every sandwich lasts in Pokémon SV
const sandwichTime = 30;

// The interval between every basket check for eggs
let eggWaitingTime = 5;

let lastPickingUpTime;
let lastSandwichTime;

let intervalID;

let currentState = IDLE_STATE;

// DOM elements

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
resetButton.classList.add("hidden");

// Execute this when clicking the "start" button
startButton.addEventListener("click", () => {
    switch(currentState) {
        case IDLE_STATE:
        case SANDWICH_TIME:
            makeSandwich();
            break;
        
        case PICKUP_TIME:
            pickUpEggs();
            break;
    }
});

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

updateTimerDisplay();
updateStatusDisplay();

function updateTimerDisplay(){
    const timerElement = document.getElementById("timer");
    
    if(currentState === SANDWICH_TIME || currentState === PICKUP_TIME){
        timerElement.textContent = `00:00`;
        return;
    }

    if(currentState === IDLE_STATE){
        timerElement.textContent = `${eggWaitingTime.toString().padStart(2, '0')}:00`;
        return;
    }
 
    // Elased time in milliseconds
    const elapsed = new Date() - lastPickingUpTime;

    const currentTimerTime = eggWaitingTime;

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
            statusBar.textContent = "Press \"start\" when you're ready and have your sandwich made";
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

function updateStartResetButtons(){
    const isResetButtonActive = currentState === WAITING_TIME;

    if(isResetButtonActive){
        startButton.classList.add("hidden");
        resetButton.classList.remove("hidden");
    } else {
        startButton.classList.remove("hidden");
        resetButton.classList.add("hidden");
    }
}

function onTimeOut(){
    clearInterval(intervalID); // Stops the countdown

    currentState = PICKUP_TIME;
    updateStatusDisplay();
    updateStartResetButtons();
}

function resetTimer(){
    // Enable settings button
    setSettingsButtonActivity(true);

    clearInterval(intervalID);

    currentState = IDLE_STATE;
    updateTimerDisplay();
    updateStatusDisplay();

    toggleStartResetButtons();
}

function startTimer(){
    currentState = WAITING_TIME;
    updateStatusDisplay();
    updateStartResetButtons();
    setSettingsButtonActivity(false);

    lastPickingUpTime = new Date()

    updateTimerDisplay();

    intervalID = setInterval(() => {
        updateTimerDisplay();
    }, REFRESH_INTERVAL);
}

function toggleStartResetButtons(){
    startButton.classList.toggle("hidden");
    resetButton.classList.toggle("hidden");
}

function setSettingsButtonActivity(value){
    if(value) {
        activeSettingsButton.classList.remove("hidden");
        inactiveSettingsButton.classList.add("hidden");
    } else {
        activeSettingsButton.classList.add("hidden");
        inactiveSettingsButton.classList.remove("hidden");
    }
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

        eggWaitingTime = workDurationValue;
        breakTime = breakDurationValue;

        minutes = eggWaitingTime;
        updateTimerDisplay();
        settingsTabOpen = false;
    }

    else{
        settingsTabOpen = true;
    }

    durationInputArea.classList.toggle("hidden");
    timerContainer.classList.toggle("hidden");
}

// State dependant functions

/**
 * idle, sandwichTime => set last sanwdiwh and start timer => waiting state
 * waiting, pick up => do nothing
 */
function makeSandwich() {
    if(currentState === WAITING_TIME || currentState === PICKUP_TIME){
        console.error("Trying to make a sandwich with invalid state.");
        return;
    }

    lastSandwichTime = new Date();
    startTimer()
}

function pickUpEggs() {
    if(currentState !== PICKUP_TIME) {
        console.error("Trying to pick up eggs with invalid state.");
        return;
    }

    const sandwichRemainingTime = sandwichTime * 60 - ((new Date() - lastSandwichTime) / 1000); 

    if(sandwichRemainingTime < eggWaitingTime * 60) {
        currentState = SANDWICH_TIME;
        updateStatusDisplay();
        return;
    }

    startTimer()
}
