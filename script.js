document.getElementById("add-task").addEventListener("click", addTask);

var array = [];
var flag = 1;

if (flag == 1) {
  fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    // Process the received data
    console.log(data);

    data.forEach((element) => {
      var task = {
        text: element.title,
        id: element.id,
      };

      array.push(task);
    });
  })
  .catch((error) => {
    // Handle any errors that occurred during the fetch request
    console.log("Error:", error.message);
  });

  flag = 0;
}


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

  array.forEach(function (task, index) { 
    var taskItem = document.createElement("li");
    taskItem.textContent = task.text;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteTask(index); 
    });

    var updateButton = document.createElement("button");
    updateButton.textContent = "Update";

    updateButton.addEventListener("click", function () {
      UpdateTask(index); 
    });

    taskItem.appendChild(deleteButton);
    taskItem.appendChild(updateButton);

    todoList.appendChild(taskItem);
  });
}


function deleteTask(taskIndex) {
  if (taskIndex >= 0 && taskIndex < array.length) {
    array.splice(taskIndex, 1);

    UpdateDisplay();
  }
}

function UpdateTask(taskIndex) { 
  if (taskIndex >= 0 && taskIndex < array.length) {
    var taskItem = document.createElement("li");
    taskItem.textContent = array[taskIndex].text;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteTask(taskIndex);
    });

    var taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.value = array[taskIndex].text;
    taskItem.appendChild(taskInput);

    var updateButton = document.createElement("button");
    updateButton.textContent = "Update";

    updateButton.addEventListener("click", function () {
      var taskText = taskInput.value;

      if (taskText !== "") {
        array[taskIndex].text = taskText;
        UpdateDisplay();
      }
    });

    taskItem.appendChild(updateButton);

    var todoList = document.getElementById("todo-list");
    todoList.replaceChild(taskItem, todoList.childNodes[taskIndex]);
  }
}

UpdateDisplay();
