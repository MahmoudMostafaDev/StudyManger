// classes

class Task {
  constructor(taskName, taskCount, daysAndTimes, id, isShow) {
    this.taskName = taskName;
    this.taskCount = taskCount;
    this.daysAndTimes = daysAndTimes;
    this.id = id;
    this.isShow = isShow;
  }
  getTotalTime(params) {
    let totalTime = 0;
    this.daysAndTimes.forEach((element) => {
      totalTime += element.getTime();
    });
  }
  getTaskName() {
    return this.taskName;
  }
  getTaskCount() {
    return this.taskCount;
  }
  getDaysAndTimes() {
    return this.daysAndTimes;
  }
  setTaskName(taskName) {
    this.taskName = taskName;
  }
  addDayAndTime(dayAndTime) {
    this.daysAndTimes.push(dayAndTime);
  }
  addCount() {
    this.taskCount++;
  }
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
}

class DayAndTime {
  constructor(day, time) {
    this.day = day;
    this.time = time;
  }
  getDay() {
    return this.day;
  }
  getTime() {
    return this.time;
  }
  increaseTime(time) {
    this.time += time;
  }
}

class Settings {
  constructor(sessionTime, breakTime, showedTask) {
    this.sessionTime = sessionTime;
    this.breakTime = breakTime;
    this.showedTask = showedTask;
  }

  getsessionTime() {
    return this.sessionTime;
  }

  setsessionTime(value) {
    this.sessionTime = value;
  }

  getbreakTime() {
    return this.breakTime;
  }

  setbreakTime(value) {
    this.breakTime = value;
  }

  getshowedTask() {
    return this.showedTask;
  }

  addshowedTask(value) {
    this.showedTask.push(value);
  }
  removeShowedTask(value) {
    this.showedTask.splice(this.showedTask.indexOf(value), 1);
  }
}

class DailyInfo {
  constructor(sessions, currentTask, totalTime, currentDay) {
    this.sessions = sessions;
    this.currentTask = currentTask;
    this.totalTime = totalTime;
    this.currentDay = currentDay;
  }

  getsessions() {
    return this.sessions;
  }

  setsessions(value) {
    this.sessions = value;
  }

  getcurrentTask() {
    return this.currentTask;
  }

  setcurrentTask(value) {
    this.currentTask = value;
  }

  gettotalTime() {
    return this.totalTime;
  }

  addToTotalTime(time) {
    this.totalTime += time;
  }

  getcurrentDay() {
    return this.currentDay;
  }

  setcurrentDay(value) {
    this.currentDay = value;
  }
}
export { Task, DayAndTime, Settings, DailyInfo };
