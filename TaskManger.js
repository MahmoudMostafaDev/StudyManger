// Import classes

import { Task, DayAndTime, Settings, DailyInfo } from "./classes.js";
// prevent form refresh
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});
// Loading Tasks from local storage
let tasks = [];
if (localStorage.getItem("Tasks")) {
  tasks = JSON.parse(localStorage.getItem("Tasks"));
}
loadTasksToPage();

//Functions
function loadTasksToPage() {
  document.querySelector(".tasks").innerHTML = "";
  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    const h3 = document.createElement("h3");
    h3.textContent = task.taskName;
    const p = document.createElement("p");
    p.id = task.id;
    p.textContent = task.taskCount;
    const iconsDiv = document.createElement("div");
    iconsDiv.classList.add("icons");
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-edit");
    const viewIcon = document.createElement("i");
    viewIcon.classList.add("fa-solid", "fa-eye");
    //color of eye
    if (task.isShow) {
      viewIcon.classList.add("showed");
    }
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-x");
    iconsDiv.appendChild(editIcon);
    iconsDiv.appendChild(viewIcon);
    iconsDiv.appendChild(deleteIcon);
    taskDiv.appendChild(h3);
    taskDiv.appendChild(p);
    taskDiv.appendChild(iconsDiv);
    // Add event listener
    document.querySelector(".tasks").appendChild(taskDiv);
    viewIcon.addEventListener("click", () => {
      showTask(task);
    });
    //delete event Listener
    deleteIcon.addEventListener("click", () => {
      deleteTask();
    });
  });
}
// --------------------------------------Form Section------------
const taskNameInput = document.querySelector("#taskname");
const taskCountInput = document.querySelector("#taskcount");
const taskAddBtn = document.querySelector("#addTask");
//delete problem
// Event Listeners
//constructor(taskName, taskCount, daysAndTimes, id, isShow) {
taskAddBtn.addEventListener("click", () => {
  let id = 1;
  if (tasks.length != 0) {
    id = tasks[tasks.length - 1].id + 1;
  }
  const taskName = taskNameInput.value;
  const taskCount = parseInt(taskCountInput.value);
  const newTask = new Task(
    taskName,
    taskCount,
    [new DayAndTime(new Date(), 0)],
    id,
    true
  );

  tasks.push(newTask);
  localStorage.setItem("Tasks", JSON.stringify(tasks));
  loadTasksToPage();
});
// ---------------------------------Task Manage Section----------------
//edit Task  TODO IN FUTURE
//delete Task
function deleteTask() {
  tasks = tasks.filter((t) => t.id !== task.id);
  localStorage.setItem("Tasks", JSON.stringify(tasks));
  loadTasksToPage();
}
function showTask(task) {
  task.isShow = !task.isShow;
  localStorage.setItem("Tasks", JSON.stringify(tasks));
  loadTasksToPage();
}
