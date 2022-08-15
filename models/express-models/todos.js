let tasks = {}; //

/*
  tasks (defined above) will be a place to store tasks by person;
  example:
  {
    person1: [{task object 1}, {task object 2}, etc.],
    person2: [{task object 1}, {task object 2}, etc.],
    etc.
  }
*/

module.exports = {
  reset: function () {
    tasks = {}; // (this function is completed for you.)
  },

  // ==== COMPLETE THE FOLLOWING (SEE `model.js` TEST SPEC) =====
  listPeople: function () {
    // returns an array of all people for whom tasks exist
    return Object.keys(tasks);
  },

  add: function (name, task) {
    // saves a task for a given person
    if (Object.values(task)[0] === '') {
      const error = new Error('Error: Task has no content!')
      error.status = 400;
      throw error;
    }
    if (!task.hasOwnProperty("complete")) {
      task.complete = false;
    }
    if (tasks.hasOwnProperty(name)) {
      tasks[name].push(task);
    }
    else {
      const arr = [];
      arr.push(task);
      tasks[name] = arr;
    }
    //trying to return the task; for POST test purposes
    return task;
  },

  list: function (name) {
    // returns tasks for specified person
    if (tasks.hasOwnProperty(name)) {
      return tasks[name];
    } else {
      const error = new Error('Error: User does not exist!')
      error.status = 404;
      throw error;
    }
  },

  complete: function (name, idx) {
    // marks a task complete
    tasks[name][idx].complete = true;
  },

  remove: function (name, idx) {
    // removes a tasks
    tasks[name].splice(idx, 1);
  },
};
