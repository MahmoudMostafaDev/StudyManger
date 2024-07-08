// import calsses
import { Task, DayAndTime, Settings, DailyInfo } from "./classes.js";

let currentTask = 0;
// drop menu

const dropDown = document.querySelector(".dropDown");
const dropDownItems = document.querySelector(".settings .taskChoose ul");
const elements = document.querySelectorAll(".settings .taskChoose ul li");
// update elements
function updateElements() {
  const elements = document.querySelectorAll(".settings .taskChoose ul li");
  elements.forEach((element) => {
    element.addEventListener("click", () => {
      dropDown.value = element.textContent;
      currentTask = parseInt(element.firstChild.id);
      changeCurrentTaskAndSave();
      dropDownItems.classList.add("diss");
    });
  });
}
dropDown.addEventListener("click", () => {
  dropDownItems.classList.toggle("diss");
});
window.onclick = function (event) {
  if (event.target !== dropDown) dropDownItems.classList.add("diss");
};
//------------Testing--------------

// ------------------------------------------------------------------------------------------------------------------------------
// classes
// ------------------------------------------------------------------------------------------------------------------------------
//Global Objects
let tasks = [];
let settings = new Settings(50, 10, []);
let dayTime = new DayAndTime(new Date(), 0);
let dailyInfo = new DailyInfo(0, 0, 0, dayTime.day);
let arrayOfDays = [];
// ------------------------------------------------------------------------------------------------------------------------------
//

// ------------------------------------------------------------------------------------------------------------------------------
// Loading the data from local storage

let keys = ["Tasks", "dayTime", "Settings", "dailyinfo"];

if (localStorage.getItem(keys[0]) === null) {
  setDefaults();
} else if (
  localStorage.getItem(keys[0]) &&
  localStorage.getItem(keys[1]) &&
  localStorage.getItem(keys[2]) &&
  localStorage.getItem(keys[3])
) {
  tasks = JSON.parse(localStorage.getItem(keys[0]));
  let TdayTime = JSON.parse(localStorage.getItem(keys[1]));
  let Tsettings = JSON.parse(localStorage.getItem(keys[2]));
  let TdailyInfo = JSON.parse(localStorage.getItem(keys[3]));
  let tarrayOfDays = JSON.parse(localStorage.getItem("arrayOfDays"));
  tarrayOfDays.forEach((element) => {
    arrayOfDays.push(new DayAndTime(new Date(element.day), element.time));
  });
  dayTime = new DayAndTime(TdayTime.day, TdayTime.time);
  settings = new Settings(
    Tsettings.sessionTime,
    Tsettings.breakTime,
    Tsettings.showedTask
  );
  dailyInfo = new DailyInfo(
    TdailyInfo.sessions,
    TdailyInfo.currentTask,
    TdailyInfo.totalTime,
    new Date(TdailyInfo.currentDay)
  );
  console.log("loaded is " + dailyInfo.totalTime);
  console.log(TdailyInfo.currentDay);
} else {
  tasks = [];
  settings = new Settings(50, 10, []);
  dayTime = new DayAndTime(new Date(), 0);
  dailyInfo = new DailyInfo(0, 0, 0, dayTime.day);
  arrayOfDays = [];
}

// functions
function setDefaults() {
  let tasks = [];
  let settings = new Settings(50, 10, []);
  let dayTime = new DayAndTime(new Date(), 0);
  let dailyInfo = new DailyInfo(0, 0, 0, dayTime.day);
  localStorage.setItem(keys[0], JSON.stringify(tasks));
  localStorage.setItem(keys[1], JSON.stringify(dayTime));
  localStorage.setItem(keys[2], JSON.stringify(settings));
  localStorage.setItem(keys[3], JSON.stringify(dailyInfo));
  localStorage.setItem("Time", 0);
  localStorage.setItem("arrayOfDays", JSON.stringify([]));
}
// ------------------------------------------------------------------------------------------------------------------------------

// Pomodoro Timer

//Settings
const sessionTime = document.querySelector("#session-time");
const breakTimeInput = document.querySelector("#break-time");

// variables
// = daytime
// = settings
let sessionTimeing = settings.sessionTime;
let breakTime = settings.breakTime;
//= daylyInfo
let timeStudying = 0;
let sessionsCount = dailyInfo.sessions;
currentTask = dailyInfo.currentTask;
let currentDay = dailyInfo.currentDay;

// other
let runningBreakTime = 10;
let runningSessionTime = 10;
let timeInterval;
let isStudying = false;
//---------------------------------------------------------
// elements
const timeView = document.querySelector(".timer h1");
const startBtn = document.querySelector(".buttons #start");
const breakBtn = document.querySelector(".buttons #break");
const stopBtn = document.querySelector(".buttons #stop");
const sessions = document.querySelector(".timer h2 span");
const totalMin = document.querySelector("#min");
const totalHour = document.querySelector("#hour");
const inSessionTime = document.querySelector("#session-time");
const inBreakTime = document.querySelector("#break-time");
stopBtn.style.display = "none";
let taskCounters = [];

//---------------------------------------------------------
// load page with saved data
timeView.textContent = `${sessionTimeing}:00`;
sessions.textContent = dailyInfo.sessions;
inSessionTime.value = sessionTimeing;
inBreakTime.value = breakTime;
totalMin.textContent = (dailyInfo.totalTime / 60).toFixed(0);
totalHour.textContent = (dailyInfo.totalTime / 60 / 60).toFixed(2);

// tasks load
console.log(tasks);
tasks.forEach((task) => {
  if (task.isShow) {
    console.log(task);
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    let h3 = document.createElement("h3");
    h3.textContent = task.taskName;

    let divElements = document.createElement("div");
    divElements.classList.add("elements");

    let iArrowUp = document.createElement("i");
    iArrowUp.classList.add("fa-solid", "fa-arrow-up");

    let p = document.createElement("p");
    let span = document.createElement("span");
    span.id = task.id;
    span.textContent = task.taskCount;
    p.appendChild(span);
    p.appendChild(document.createTextNode(" / Unit"));
    taskCounters.push(span);

    let iArrowDown = document.createElement("i");
    iArrowDown.classList.add("fa-solid", "fa-arrow-down");

    divElements.appendChild(iArrowUp);
    divElements.appendChild(p);
    divElements.appendChild(iArrowDown);

    taskDiv.appendChild(h3);
    taskDiv.appendChild(divElements);

    document.querySelector(".tasks").appendChild(taskDiv);

    let liTask = document.createElement("li");
    liTask.innerHTML = `<span id="${task.id}">${task.taskName}</span>`;
    dropDownItems.appendChild(liTask);
  }
});

updateElements();
addTasksEvents(); // increase and decrease count of units for tasks
// --------------------------------------------------------
// events
startBtn.addEventListener("click", () => {
  startTimer();
});
breakBtn.addEventListener("click", () => {
  breakTimer();
});
stopBtn.addEventListener("click", () => {
  stopTimer();
});

inSessionTime.addEventListener("change", () => {
  if (inSessionTime.value < 1) {
    sessionTimeing = 1;
    timeView.textContent = `${sessionTimeing}:00`;
    // saving session time
    settings.setsessionTime(sessionTimeing);
    saveSettings();
  } else {
    sessionTimeing = inSessionTime.value;
    timeView.textContent = `${sessionTimeing}:00`;
    // saving session time
    settings.setsessionTime(sessionTimeing);
    saveSettings();
  }
});

inBreakTime.addEventListener("change", () => {
  if (inBreakTime.value < 1) {
    breakTime = 1;
    // saving break time
    settings.setbreakTime(breakTime);
    saveSettings();
  } else {
    breakTime = inBreakTime.value;
    // saving break time
    settings.setbreakTime(breakTime);
    saveSettings();
  }
});

// --------------------------------------------------------
//functions
/**
 * Starts the timer for studying.
 * Adds time to the current task.
 * Saves the data in local storage.
 */
function startTimer() {
  isStudying = true;
  clearInterval(timeInterval);
  // Set the initial time
  timeView.textContent = `${sessionTimeing}:00`;
  startBtn.style.display = "none";
  stopBtn.style.display = "block";
  let isTimerRunning = false;
  timeInterval = setInterval(() => {
    if (isTimerRunning === false) {
      runningSessionTime = sessionTimeing;
      isTimerRunning = true;
    }
    // Add time to the current task
    let index = -1;
    tasks[currentTask - 1].daysAndTimes.forEach((dayAndTime, i) => {
      if (
        new Date(dayAndTime.day).getDate() === currentDay.getDate() &&
        new Date(dayAndTime.day).getMonth() === currentDay.getMonth() &&
        new Date(dayAndTime.day).getFullYear() === currentDay.getFullYear()
      ) {
        index = i;
      }
    });
    if (index !== -1) {
      tasks[currentTask - 1].daysAndTimes[index].time += 1;
      saveTasks();
    }
    // Save the data in local storage
    dailyInfo.addToTotalTime(1);
    timeStudying++;
    totalMin.textContent = (dailyInfo.totalTime / 60).toFixed(0);
    totalHour.textContent = (dailyInfo.totalTime / 60 / 60).toFixed(2);
    displayTime(true);
  }, 1000);
}

function breakTimer() {
  if (isStudying && timeStudying > 0.5 * sessionTimeing * 60) {
    sessionsCount++;
    sessions.textContent = sessionsCount;
    dailyInfo.sessions = sessionsCount;
    isStudying = false;
  }
  timeView.textContent = `${breakTime}:00`;
  clearInterval(timeInterval);
  timeStudying = 0;
  let isTimerRunning = false;
  timeInterval = setInterval(() => {
    if (isTimerRunning === false) {
      runningBreakTime = breakTime;
      isTimerRunning = true;
    }
    timeStudying++;
    displayTime(false);
    if (timeStudying == runningBreakTime * 60) {
      clearInterval(timeInterval);
      timeStudying = 0;
      timeView.textContent = `${sessionTimeing}:00`;
      startBtn.style.display = "block";
      stopBtn.style.display = "none";
      runningBreakTime = settings.breakTime;
      runningSessionTime = settings.sessionTime;
    }
  }, 1000);
}

function displayTime(isStudy) {
  let min = Math.floor(timeStudying / 60);
  let sec = timeStudying % 60;
  if (isStudy) {
    if (timeStudying >= runningSessionTime * 60) {
    } else {
      sec = 60 - sec;

      min = sec !== 0 ? runningSessionTime - min - 1 : runningSessionTime - min;
    }
  } else {
    sec = 60 - sec;
    min = sec !== 0 ? runningBreakTime - min - 1 : runningBreakTime - min;
  }

  if (sec < 10) {
    sec = "0" + sec;
  }
  timeView.textContent = min + ":" + sec;
}

function stopTimer() {
  if (isStudying && timeStudying > 0.5 * sessionTimeing * 60) {
    sessionsCount++;
    sessions.textContent = sessionsCount;
    dailyInfo.sessions = sessionsCount;
    isStudying = false;
  }
  timeView.textContent = `${sessionTimeing}:00`;
  startBtn.style.display = "block";
  stopBtn.style.display = "none";
  clearInterval(timeInterval);
  runningBreakTime = settings.breakTime;
  runningSessionTime = settings.sessionTime;
  timeStudying = 0;
}
function addAndSaveDay() {
  let exist = false;
  let index;

  arrayOfDays.forEach((element) => {
    if (
      element.day.getDate() == dailyInfo.currentDay.getDate() &&
      element.day.getMonth() == dailyInfo.currentDay.getMonth() &&
      element.day.getFullYear() == dailyInfo.currentDay.getFullYear()
    ) {
      exist = true;
      index = arrayOfDays.indexOf(element);
    }
  });
  if (!exist) {
    arrayOfDays.push(new DayAndTime(new Date(), 0));
    saveArrayOfDays();
  } else {
    arrayOfDays[index].time = dailyInfo.totalTime;

    saveArrayOfDays();
  }
}
function checkday() {
  addAndSaveDay();
  if (
    new Date().getDate() != dailyInfo.currentDay.getDate() ||
    new Date().getMonth() != dailyInfo.currentDay.getMonth() ||
    new Date().getFullYear() != dailyInfo.currentDay.getFullYear()
  ) {
    console.log("3");
    localStorage.setItem(
      "Time",
      parseInt(localStorage.getItem("Time")) + dailyInfo.totalTime
    );
    dailyInfo = new DailyInfo(0, currentTask, 0, new Date());
    saveDailyInfo();
    tasks.forEach((element) => {
      element.daysAndTimes.push(new DayAndTime(new Date(), 0));
    });
    console.log(tasks);
    saveTasks();
    // localStorage.setItem(keys[1], JSON.stringify(dayTime));
    totalTime = 0;
  }
}
checkday();
setInterval(checkday, 600);
// 60000 = 1 min
function changeCurrentTaskAndSave() {
  dailyInfo.currentTask = currentTask;
  saveDailyInfo();
}
let saveTotalTime = setInterval(() => {
  saveDailyInfo();
  localStorage.setItem(
    "Time",
    parseInt(localStorage.getItem("Time")) + dailyInfo.totalTime
  );
}, 10000);
//increase the task count
function increaseTaskUnit(id) {
  tasks[id - 1].taskCount++;
  saveTasks();
  taskCounters[id - 1].textContent = tasks[id - 1].taskCount;
}
function decreaseTaskUnit(id) {
  tasks[id - 1].taskCount--;
  saveTasks();
  taskCounters[id - 1].textContent = tasks[id - 1].taskCount;
}
function addTasksEvents() {
  //increase and decrease count of units for tasks
  const taskIncreseBtns = document.querySelectorAll(".fa-arrow-up");
  const taskDecreaseBtns = document.querySelectorAll(".fa-arrow-down");
  taskIncreseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      increaseTaskUnit(btn.nextElementSibling.firstElementChild.id);
    });
  });
  taskDecreaseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      decreaseTaskUnit(btn.previousElementSibling.firstElementChild.id);
    });
  });
}
//---------------------------------Saving Data---------------------------------
function saveDayTime() {
  localStorage.setItem(keys[1], JSON.stringify(dayTime));
}
function saveSettings() {
  localStorage.setItem(keys[2], JSON.stringify(settings));
}
function saveDailyInfo() {
  localStorage.setItem(keys[3], JSON.stringify(dailyInfo));
}
function saveTasks() {
  localStorage.setItem(keys[0], JSON.stringify(tasks));
}
function saveArrayOfDays() {
  localStorage.setItem("arrayOfDays", JSON.stringify(arrayOfDays));
}
