document.getElementById("add-task").addEventListener("click", addTask);

var array = [];

function addTask() {
  var taskInput = document.getElementById("task-input");
  var taskText = taskInput.value;

  if (taskText !== "") {
    var task = {
      text: taskText,
      id: Date.now(),
    };

    array.push(task);

    UpdateDisplay();
  }
}

function UpdateDisplay() {
  var todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  array.forEach(function (task) {
    var taskItem = document.createElement("li");
    taskItem.textContent = task.text;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    var updateButton = document.createElement("button");
    updateButton.textContent = "Update";

    updateButton.addEventListener("click", function () {
      UpdateTask(task.id);
    });

    taskItem.appendChild(deleteButton);
    taskItem.appendChild(updateButton);
    todoList.appendChild(taskItem);
  });
}

function deleteTask(taskId) {
  var taskIndex = array.findIndex(function (task) {
    return task.id === taskId;
  });

  if (taskIndex !== -1) {
    array.splice(taskIndex, 1);

    UpdateDisplay();
  }
}

function UpdateTask(taskId) {
  var taskIndex = array.findIndex(function (task) {
    return task.id === taskId;
  });

  if (taskIndex !== -1) {
    var taskInput = document.getElementById("update-task");
    taskInput.style.display = "block";

    var updateButton = document.createElement("button");
    updateButton.textContent = "Update";

    updateButton.addEventListener("click", function () {
      var taskText = taskInput.value;

      if (taskText !== "") {
        array[taskIndex].text = taskText;
        UpdateDisplay();
        taskInput.style.display = "none";
        taskInput.value = "";
      }
    });

    taskInput.value = array[taskIndex].text;

    var todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    array.forEach(function (task) {
      var taskItem = document.createElement("li");
      taskItem.textContent = task.text;

      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
      });

      taskItem.appendChild(deleteButton);

      if (task.id === taskId) {
        taskItem.appendChild(taskInput);
        taskItem.appendChild(updateButton);
      }

      todoList.appendChild(taskItem);
    });
  }
}

UpdateDisplay();
