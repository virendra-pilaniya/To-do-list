const taskInput = document.querySelector(".task-input input"),
    addTask = document.querySelector(".addTasking"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    deadlineInput = document.querySelector(
        ".task-input input[type='datetime-local']"
    ),
    prioritySelect = document.querySelector(".task-input .priority-select"),
    categorySelect = document.querySelector(".task-input .category-select"),
    categorySelectN = document.querySelector(".controls .category-select-1"),
    tagSelect = document.querySelector(".task-input .tag-select"),
    expired = document.querySelector(".expired"),
    taskBox = document.querySelector(".task-box"),
    sortingDeadlineBtn = document.getElementById("sorting-deadline"),
    sortingPriorityBtn = document.getElementById("sorting-priority"),
    sortingCategoryBtn = document.getElementById("sorting-category");

let editId,
    isEditTask = false,
    subeditId,
    issubEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function createTaskObject(
    name,
    status,
    deadline,
    priority,
    category,
    //   tag = [],
    subtasks = []
) {
    return {
        name: name,
        status: status,
        deadline: deadline,
        priority: priority,
        category: category,
        // tag: tag,
        subtasks: subtasks,
    };
}

addTask.addEventListener("click", () => {
    let userTask = taskInput.value.trim();
    let deadline = deadlineInput.value;
    let priority = prioritySelect.value;
    let category = categorySelect.value.trim();
    //   let tag = [];
    //   tag = tagSelect.split(",").map((item) => item.trim());

    if (userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = createTaskObject(
                userTask,
                "pending",
                deadline,
                priority,
                category,
                // tag
            );
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].deadline = deadline;
            todos[editId].priority = priority;
            todos[editId].category = category;
            //   todos[editId].tag = tag;
        }
        taskInput.value = "";
        deadlineInput.value = "";
        prioritySelect.value = "low";
        categorySelect.value = "Home";
        // tag = [];

        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});

function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
              <p class="${completed}">${todo.name}</p>
              <p class="deadline">Deadline: ${formatDate(todo.deadline)}</p>
              <p class="priority">Priority: ${todo.priority}</p>
              <p class="Category">Category: ${todo.category}</p>
            </label>
            <button class="addSubtaskBtn" onclick="showAddSubtaskInput(${id})">Add Subtask</button>`;

                if (todo.subtasks && todo.subtasks.length > 0) {
                    liTag += `<ul class="subtasks">`;

                    todo.subtasks.forEach((subtask, subtaskId) => {
                        let subtaskCompleted =
                            subtask.status === "completed" ? "checked" : "";
                        liTag += `<li class="subtask">
                <label for="${id}-${subtaskId}">
                  <input onclick="updateSubtaskStatus(${id}, ${subtaskId})" type="checkbox" id="${id}-${subtaskId}" ${subtaskCompleted}>
                  <p class="${subtaskCompleted}">${subtask.name}</p>
                </label>
                <div class="subtask-settings">
                  <ul class="task-menu">
                    <button class="inside_btn3" onclick='editSubtask(${id}, ${subtaskId}, "${subtask.name
                            }", ${subtask.deadline ? `"${subtask.deadline}"` : null}, "${subtask.priority
                            }", "${subtask.category}")'><i class="uil uil-pen"></i></button>
                    <button class="inside_btn4" onclick='deleteSubtask(${id}, ${subtaskId})'><i class="uil uil-trash"></i></button>
                  </ul>
                </div>
              </li>`;
                    });

                    liTag += `</ul>`;
                }

                liTag += `
                <div class="settings">
              <ul class="task-menu">
                <button class="inside_btn" onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</button>
                <button class="inside_btn2" onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</button>
              </ul>
            </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length
        ? clearAll.classList.remove("active")
        : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300
        ? taskBox.classList.add("overflow")
        : taskBox.classList.remove("overflow");
}

showTodo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

function showAddSubtaskInput(taskId) {
    const subtaskInputContainer = document.querySelector(
        ".subtask-input-container"
    );
    const mainTask = taskBox.children[taskId].querySelector(".task label");
    const subtasksList = taskBox.children[taskId].querySelector(".subtasks");

    subtaskInputContainer.style.display = "block";
    subtaskInputContainer.querySelector("input").focus();
    subtaskInputContainer.querySelector("button").onclick = function () {
        const subtaskName = subtaskInputContainer
            .querySelector("input")
            .value.trim();
        if (subtaskName) {
            addSubtaskToMainTask(taskId, subtaskName);
            subtaskInputContainer.style.display = "none";
        }
    };
    showTodo("all");
}

function editSubtask(
    taskId,
    subtaskId,
    subtaskName,
    subtaskDeadline,
    subtaskPriority,
    subtaskCategory
) {
    const subtaskInputContainer = document.querySelector(
        ".subtask-input-container"
    );
    const subtaskInput = subtaskInputContainer.querySelector("input");
    const mainTask = taskBox.children[taskId].querySelector(".task label");
    const subtasksList = taskBox.children[taskId].querySelector(".subtasks");
    const subtask = subtasksList.children[subtaskId];

    subtaskInput.value = subtaskName;
    subtaskInputContainer.style.display = "block";
    subtaskInput.focus();
    subtaskInputContainer.querySelector("button").onclick = function () {
        const newSubtaskName = subtaskInput.value.trim();
        if (newSubtaskName) {
            todos[taskId].subtasks[subtaskId].name = newSubtaskName;
            localStorage.setItem("todo-list", JSON.stringify(todos));
            showTodo("all");
            subtask.querySelector("p").textContent = newSubtaskName;
        }
        subtaskInputContainer.style.display = "none";
    };
    showTodo("all");
}

function addSubtaskToMainTask(taskId, subtaskName) {
    const subtask = createTaskObject(subtaskName, "pending", null, "low", "Home");
    todos[taskId].subtasks.push(subtask);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

function updateSubtaskStatus(taskId, subtaskId) {
    const subtaskCheckbox = document.getElementById(`${taskId}-${subtaskId}`);
    todos[taskId].subtasks[subtaskId].status = subtaskCheckbox.checked
        ? "completed"
        : "pending";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

function deleteSubtask(taskId, subtaskId) {
    todos[taskId].subtasks.splice(subtaskId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    issubEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

const searchInput = document.querySelector("#search");

searchInput.addEventListener("input", function (e) {
    const searchStr = e.target.value.toLowerCase();
  
    let liTag = "";
    if (todos) {
      todos.forEach((todo, id) => {
        let completed = todo.status == "completed" ? "checked" : "";
        console.log(todo.name.toLowerCase());
        if (
          todo.name.toLowerCase().indexOf(searchStr) > -1 ||
          containsSubtask(todo.subtasks, searchStr)
        ) {
          liTag += `<li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
              <p class="${completed}">${todo.name}</p>
              <p class="deadline">Deadline: ${formatDate(todo.deadline)}</p>
              <p class="priority">Priority: ${todo.priority}</p>
              <p class="category">Category: ${todo.category}</p>
            </label>
            <button class="addSubtaskBtn" onclick="showAddSubtaskInput(${id})">Add Subtask</button>`;
  
          if (todo.subtasks && todo.subtasks.length > 0) {
            liTag += `<ul class="subtasks">`;
  
            todo.subtasks.forEach((subtask, subtaskId) => {
              let subtaskCompleted =
                subtask.status === "completed" ? "checked" : "";
              liTag += `<li class="subtask">
                <label for="${id}-${subtaskId}">
                  <input onclick="updateSubtaskStatus(${id}, ${subtaskId})" type="checkbox" id="${id}-${subtaskId}" ${subtaskCompleted}>
                  <p class="${subtaskCompleted}">${subtask.name}</p>
                </label>
                <div class="subtask-settings">
                  <ul class="task-menu">
                    <button class="inside_btn3" onclick='editSubtask(${id}, ${subtaskId}, "${subtask.name
                      }", ${subtask.deadline ? `"${subtask.deadline}"` : null}, "${subtask.priority
                      }", "${subtask.category}")'><i class="uil uil-pen"></i></button>
                    <button class="inside_btn4" onclick='deleteSubtask(${id}, ${subtaskId})'><i class="uil uil-trash"></i></button>
                  </ul>
                </div>
              </li>`;
            });
  
            liTag += `</ul>`;
          }
  
          liTag += `
            <div class="settings">
              <ul class="task-menu">
                <button class="inside_btn" onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</button>
                <button class="inside_btn2" onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</button>
              </ul>
            </div>
          </li>`;
        }
      });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
  });
  
  function containsSubtask(subtasks, searchStr) {
    if (!subtasks) return false;
    return subtasks.some((subtask) => subtask.name.toLowerCase().indexOf(searchStr) > -1);
  }
  

function formatDate(dateString) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    const date = new Date(dateString);
    if (isNaN(date)) {
        return "Invalid Date";
    }
    return date.toLocaleDateString(undefined, options);
}

expired.addEventListener("click", () => {
    showExpiredTasks();
});

function showExpiredTasks() {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            let deadline = new Date(todo.deadline);
            if (!isNaN(deadline) && deadline < currentDate) {
                liTag += `<li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
              <p class="${completed}">${todo.name}</p>
              <p class="deadline">Deadline: ${formatDate(todo.deadline)}</p>
              <p class="priority">Priority: ${todo.priority}</p>
              <p class="priority">Category: ${todo.category}</p>
            </label>
            <button class="addSubtaskBtn" onclick="showAddSubtaskInput(${id})">Add Subtask</button>`;

                if (todo.subtasks && todo.subtasks.length > 0) {
                    liTag += `<ul class="subtasks">`;

                    todo.subtasks.forEach((subtask, subtaskId) => {
                        let subtaskCompleted =
                            subtask.status === "completed" ? "checked" : "";
                        liTag += `<li class="subtask">
                <label for="${id}-${subtaskId}">
                  <input onclick="updateSubtaskStatus(${id}, ${subtaskId})" type="checkbox" id="${id}-${subtaskId}" ${subtaskCompleted}>
                  <p class="${subtaskCompleted}">${subtask.name}</p>
                </label>
                <div class="subtask-settings">
                  <ul class="task-menu">
                    <button class="inside_btn3" onclick='editSubtask(${id}, ${subtaskId}, "${subtask.name
                            }", ${subtask.deadline ? `"${subtask.deadline}"` : null}, "${subtask.priority
                            }", "${subtask.category}")'><i class="uil uil-pen"></i></button>
                    <button class="inside_btn4" onclick='deleteSubtask(${id}, ${subtaskId})'><i class="uil uil-trash"></i></button>
                  </ul>
                </div>
              </li>`;
                    });

                    liTag += `</ul>`;
                }

                liTag += `
                <div class="settings">
              <ul class="task-menu">
                <button class="inside_btn" onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</button>
                <button class="inside_btn2" onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</button>
              </ul>
            </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
}

sortingDeadlineBtn.addEventListener("click", () => {
    showTodoBySorting("deadline");
});

sortingPriorityBtn.addEventListener("click", () => {
    showTodoBySorting("priority");
});

sortingCategoryBtn.addEventListener("click", () => {
    showTodoBySorting("category");
});

function showTodoBySorting(sortingType) {
    let sortedTodos;
    if (todos) {
        if (sortingType === "deadline") {
            // Sort by deadline
            sortedTodos = todos.slice().sort((a, b) => {
                return new Date(a.deadline) - new Date(b.deadline);
            });
        } else if (sortingType === "priority") {
            // Sort by priority (high > medium > low)
            sortedTodos = todos.slice().sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        } else if (sortingType === "category") {
            // Sort by category
            sortedTodos = todos.slice().sort((a, b) => {
                return a.category.localeCompare(b.category);
            });
        }
    }

    let liTag = "";
    if (sortedTodos) {
        sortedTodos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            liTag += `<li class="task">
                <label for="${id}">
                  <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                  <p class="${completed}">${todo.name}</p>
                  <p class="deadline">Deadline: ${formatDate(todo.deadline)}</p>
                  <p class="priority">Priority: ${todo.priority}</p>
                  <p class="priority">Category: ${todo.category}</p>
                </label>
                <button class="addSubtaskBtn" onclick="showAddSubtaskInput(${id})">Add Subtask</button>`;

            if (todo.subtasks && todo.subtasks.length > 0) {
                liTag += `<ul class="subtasks">`;

                todo.subtasks.forEach((subtask, subtaskId) => {
                    let subtaskCompleted =
                        subtask.status === "completed" ? "checked" : "";
                    liTag += `<li class="subtask">
                    <label for="${id}-${subtaskId}">
                      <input onclick="updateSubtaskStatus(${id}, ${subtaskId})" type="checkbox" id="${id}-${subtaskId}" ${subtaskCompleted}>
                      <p class="${subtaskCompleted}">${subtask.name}</p>
                    </label>
                    <div class="subtask-settings">
                      <ul class="task-menu">
                        <button class="inside_btn3" onclick='editSubtask(${id}, ${subtaskId}, "${subtask.name
                        }", ${subtask.deadline ? `"${subtask.deadline}"` : null}, "${subtask.priority
                        }", "${subtask.category}")'><i class="uil uil-pen"></i></button>
                        <button class="inside_btn4" onclick='deleteSubtask(${id}, ${subtaskId})'><i class="uil uil-trash"></i></button>
                      </ul>
                    </div>
                  </li>`;
                });

                liTag += `</ul>`;
            }

            liTag += `
                    <div class="settings">
                  <ul class="task-menu">
                    <button class="inside_btn" onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</button>
                    <button class="inside_btn2" onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</button>
                  </ul>
                </div>
                    </li>`;
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
}

const filter_date_Btn = document.querySelector(".filter-date-btn");
const filter_category_btn = document.querySelector(".filter-category-btn");
const filter_by_priority_btn = document.querySelector(
    ".filter-by-priority-btn"
);
// const category_filter_select = document.getElementById("category-filter-select1").value;

filter_by_priority_btn.addEventListener("click", () => {
    const priority_filter = document.getElementById("priority-filter").value;
    const filteredTodos = todos.filter((todo) => {
        const priority = todo.priority;
        return priority_filter === priority;
    });

    View_Todo_list(filteredTodos);
});

filter_category_btn.addEventListener("click", () => {
    const category_filter_select = categorySelectN.value;

    if (category_filter_select) {
        const filteredTodos = todos.filter((todo) => {
            const category = todo.category;
            return category_filter_select === category;
        });

        View_Todo_list(filteredTodos);
    }

});

filter_date_Btn.addEventListener("click", () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (startDate && endDate && startDate <= endDate) {
        showTodoByDueDate(startDate, endDate);
    } else {
        showTodo("all");
    }
});

function showTodoByDueDate(startDate, endDate) {
    const filteredTodos = todos.filter((todo) => {
        const dueDate = new Date(todo.deadline);
        return dueDate >= new Date(startDate) && dueDate <= new Date(endDate);
    });

    View_Todo_list(filteredTodos);
}

function View_Todo_list(filteredTodos) {
    let liTag = "";
    if (filteredTodos && filteredTodos.length > 0) {
        filteredTodos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            liTag += `<li class="task">
                  <label for="${id}">
                      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                      <p class="${completed}">${todo.name}</p>
                      <p class="deadline">Deadline: ${formatDate(
                todo.deadline
            )}</p>
                      <p class="priority">Priority: ${todo.priority}</p>
                      <p class="priority">Category: ${todo.category}</p>
                      <button class="addSubtaskBtn" onclick="addSubtask(${id})">add subtask</button>
                  </label>
                  <div class="settings">
                      <ul class="task-menu">
                          <button class="inside_btn" onclick='editTask(${id}, "${todo.name
                }")'><i class="uil uil-pen"></i>Edit</button>
                          <button class="inside_btn2" onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</button>
                      </ul>
                  </div>`;

            if (todo.subtasks) {
                liTag += `<ul class="subtasks">`;

                todo.subtasks.forEach((subtask, subtaskId) => {
                    liTag += `<li class="subtask">
                          <label for="${id}-${subtaskId}">
                              <input onclick="updateSubtaskStatus(${id}, ${subtaskId})" type="checkbox" id="${id}-${subtaskId}" ${subtask.status === "completed" ? "checked" : ""
                        }>
                              <p class="${subtask.status}">${subtask.name}</p>
                          </label>
                          <div class="subtask-settings">
                              <ul class="task-menu">
                                  <button class="inside_btn" onclick='editSubtask(${id}, ${subtaskId}, "${subtask.name
                        }", "${subtask.deadline}", "${subtask.priority}", "${subtask.category
                        }")'><i class="uil uil-pen"></i>Edit</button>
                                  <button class="inside_btn2" onclick='deleteSubtask(${id}, ${subtaskId})'><i class="uil uil-trash"></i>Delete</button>
                              </ul>
                          </div>
                      </li>`;
                });

                liTag += `</ul>`;
            }

            liTag += `</li>`;
        });
    } else {
        liTag = `<span>No tasks found for the selected filter.</span>`;
    }

    taskBox.innerHTML = liTag;
}
