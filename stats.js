//import classes
import { Task, DayAndTime, Settings, DailyInfo } from "./classes.js";
//dropdown menu
const dropDown = document.querySelector(".dropDown");
const dropDownItems = document.querySelector(".special ul");
const elements = document.querySelectorAll(".special li");

dropDown.addEventListener("click", () => {
  dropDownItems.classList.toggle("diss");
});
window.onclick = function (event) {
  if (event.target !== dropDown) dropDownItems.classList.add("diss");
};

// Loading Daily Info and Tasks and ArrayOfDates from local storage
let dailyInfo = new DailyInfo(0, 0, 0, new Date());
loadDailyInfo();
let tasks = [];
loadTasks();
let arrayOfDays = [];
loadArrayOfDays();

//Stats Days
// 1- show day total time
const dayTotalTime = document.getElementById("today");
dayTotalTime.innerText = dailyInfo.totalTime;
// 2- show week total time
const weekTotalTime = document.getElementById("week");
weekTotalTime.innerText = calculateTotalTimeFromArrayofDays(
  getDatesOfCurrentWeek()
);
// 3- show month total time
const monthTotalTime = document.getElementById("month");
monthTotalTime.innerText = calculateTotalTimeFromArrayofDays(
  getDatesOfCurrentMonth()
);
//4- show total time
const totalTotalTime = document.getElementById("total");
totalTotalTime.innerText = calculateTotalTimeFromArrayofDays(
  getDatesOfArrayOfDays()
);

//Stats of Tasks
showTasksWithTime();

//stats of tasks by selected day
loadDaysToDropMent();
//functions
function loadDailyInfo() {
  if (localStorage.getItem("dailyInfo")) {
    let tempdailyInfo = JSON.parse(localStorage.getItem("dailyInfo"));
    dailyInfo = new DailyInfo(
      tempdailyInfo.sessions,
      tempdailyInfo.currentTask,
      tempdailyInfo.totalTime,
      new Date(tempdailyInfo.currentDay)
    );
  }
}
function loadTasks() {
  if (localStorage.getItem("Tasks")) {
    tasks = JSON.parse(localStorage.getItem("Tasks"));
  }
}
function loadArrayOfDays() {
  if (localStorage.getItem("arrayOfDays")) {
    arrayOfDays = JSON.parse(localStorage.getItem("arrayOfDays"));
  }
}
function getDatesOfCurrentWeek() {
  let dates = [];
  let currentDate = new Date();
  let dayOfWeek = currentDate.getDay();

  console.log(dayOfWeek);
  for (let j = dayOfWeek; j >= 0; j--) {
    dates.push(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000 * (j + 1)));
  }
  for (let j = 0; j <= 4 - dayOfWeek; j++) {
    dates.push(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * (j + 1)));
  }
  dates.push(currentDate);
  return dates;
}

function getDatesOfCurrentMonth() {
  let dates = [];
  let currentDate = new Date();
  let Month = currentDate.getMonth();
  let dayOfMonth = currentDate.getDate();
  let days = 30;
  switch (Month) {
    case (1, 3, 5, 7, 9, 10, 12):
      days = 31;
      break;
    case (4, 6, 8, 10, 11):
      days = 30;
      break;
    default:
      days = 28;
      break;
  }
  for (let j = Month; j >= 0; j--) {
    dates.push(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000 * (j + 1)));
  }
  console.log(
    new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * dayOfMonth)
  );
  for (let j = 0; j <= days - dayOfMonth + 3; j++) {
    dates.push(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * j));
  }
  return dates;
}
function getDatesOfArrayOfDays() {
  let dates = [];
  arrayOfDays.forEach((element) => {
    dates.push(new Date(element.day));
  });
  return dates;
}
function calculateTotalTimeFromArrayofDays(DatesOfWeek) {
  let totalTime = 0;
  arrayOfDays.forEach((element) => {
    DatesOfWeek.forEach((element2) => {
      if (
        new Date(element.day).getDate() == element2.getDate() &&
        new Date(element.day).getMonth() == element2.getMonth() &&
        new Date(element.day).getFullYear() == element2.getFullYear()
      ) {
        totalTime += element.time;
      }
    });
  });
  return (totalTime / 1000 / 60 / 60).toFixed(2);
}
function getTotalTimeOFTask(task) {
  let totalTime = 0;
  task.daysAndTimes.forEach((element) => {
    totalTime += element.time;
  });
  return (totalTime / 1000 / 60 / 60).toFixed(2);
}

function showTasksWithTime() {
  tasks.forEach((element) => {
    const container = document.querySelector(".taskStats .taskContainer");
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    let h3 = document.createElement("h3");
    h3.textContent = element.taskName;
    let p = document.createElement("p");
    let span = document.createElement("span");
    span.id = element.id;
    span.textContent = getTotalTimeOFTask(element);
    p.appendChild(span);
    p.appendChild(document.createTextNode(" Hours"));
    taskDiv.appendChild(h3);
    taskDiv.appendChild(p);
    container.appendChild(taskDiv);
  });
}
function loadDaysToDropMent() {
  console.log(arrayOfDays);
  arrayOfDays.forEach((element) => {
    const day = document.createElement("li");
    day.id = new Date(element.day).toLocaleDateString("en-US");
    day.textContent = new Date(element.day).toLocaleDateString("en-US");
    day.addEventListener("click", () => {
      dropDown.value = day.textContent;
      dropDownItems.classList.add("diss");
      updateSpecialTask();
    });
    dropDownItems.appendChild(day);
  });
}

function updateSpecialTask() {
  tasks.forEach((task) => {
    let totalTime = 0;
    task.daysAndTimes.forEach((element) => {
      if (new Date(element.day).toLocaleDateString("en-US") == dropDown.value) {
        totalTime += element.time;
      }
    });
    const container = document.querySelector(".special .taskContainer");
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    let h3 = document.createElement("h3");
    h3.textContent = task.taskName;
    let p = document.createElement("p");
    let span = document.createElement("span");
    span.id = task.id;
    span.textContent = (totalTime / 1000 / 60 / 60).toFixed(2);
    p.appendChild(span);
    p.appendChild(document.createTextNode(" Hours"));
    taskDiv.appendChild(h3);
    taskDiv.appendChild(p);
    container.appendChild(taskDiv);
  });
}
