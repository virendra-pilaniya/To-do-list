const taskInput = document.querySelector(".task-input input"),
    addTask = document.querySelector(".addTasking"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    deadlineInput = document.querySelector(".task-input input[type='datetime-local']"),
    prioritySelect = document.querySelector(".task-input .priority-select"),
    categorySelect = document.querySelector(".task-input .category-select"),
    expired = document.querySelector(".expired");
taskBox = document.querySelector(".task-box");


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

function createTaskObject(name, status, deadline, priority, category, subtasks = []) {
    return {
        name: name,
        status: status,
        deadline: deadline,
        priority: priority,
        category: category,
        subtasks: subtasks,
    };
}


addTask.addEventListener("click", () => {
    let userTask = taskInput.value.trim();
    let deadline = deadlineInput.value;
    let priority = prioritySelect.value;
    let category = categorySelect.value;

    if (userTask) {
        if (!isEditTask) {
            // todos = !todos ? [] : todos;
            let taskInfo = createTaskObject(userTask, "pending", deadline, priority, category);
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].deadline = deadline;
            todos[editId].priority = priority;
            todos[editId].category = category;
        }
        taskInput.value = "";
        deadlineInput.value = "";
        prioritySelect.value = "low";
        categorySelect.value = "Home";
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
                                <button class="addSubtaskBtn" onclick="addSubtask(${id})">add subtask</button>
                            </label>
                            <div class="settings">
                                <ul class="task-menu">
                                    <button class="inside_btn" onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</button>
                                    <button class="inside_btn2" onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</button>
                                </ul>
                            </div>`

                if (todo.subtasks) {
                    `<ul class="subtasks">`;

                    todo.subtasks.forEach((subtask, subtaskId) => {
                        liTag += `<li class="subtask">
                                            <label for="${id}-${subtaskId}">
                                                <input onclick="updateSubtaskStatus(${id}, ${subtaskId})" type="checkbox" id="${id}-${subtaskId}" ${subtask.status === 'completed' ? 'checked' : ''}>
                                                <p class="${subtask.status}">${subtask.name}</p>
                                            </label>
                                            <div class="subtask-settings">
                                                <ul class="task-menu">
                                                    <button class="inside_btn" onclick='editSubtask(${id}, ${subtaskId}, "${subtask.name}")'><i class="uil uil-pen"></i>Edit</button>
                                                    <button class="inside_btn2" onclick='deleteSubtask(${id}, ${subtaskId})'><i class="uil uil-trash"></i>Delete</button>
                                                </ul>
                                            </div>
                                        </li>`;
                    });

                    liTag += `</ul>`;
                }

                liTag += `</li>`;
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

expired.addEventListener("click", () => {
    showExpiredTasks();
})

function showExpiredTasks() {
    let liTag = "";
    if (todos) {
        const currentDate = new Date();
        todos.forEach((todo, id) => {
            let deadline = new Date(todo.deadline);
            if (!isNaN(deadline) && deadline < currentDate) { // Check if the deadline is valid and has passed.
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                                <p class="deadline">Deadline: ${formatDate(todo.deadline)}</p>
                                <p class="priority">Priority: ${todo.priority}</p>
                            </label>
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
    taskBox.innerHTML = liTag || `<span>No expired tasks.</span>`;
}

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

function addSubtask(taskId) {
    `<input onclick="addingSubtask(${taskId}, ${this.text})" type="text" placeholder="Add a new subtask" >`
}

function addingSubtask(taskId, subtaskName) {
    let subtask = createTaskObject(subtaskName, "pending", null, "low", "Home");
    todos[taskId].subtasks.push(subtask);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
}

function editSubtask(taskId, subtaskId, subtaskName) {
    issubEditTask = true;
    subeditId = subtaskId;
    taskInput.value = subtaskName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteSubtask(taskId, subtaskId) {
    todos[taskId].subtasks.splice(subtaskId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
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
            if (todo.name.toLowerCase().indexOf(searchStr) > -1) {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                                <p class="deadline">Deadline: ${formatDate(todo.deadline)}</p>
                                <p class="priority">Priority: ${todo.priority}</p>
                            </label>
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


function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    const date = new Date(dateString);
    if (isNaN(date)) {
        return "Invalid Date";
    }
    return date.toLocaleDateString(undefined, options);
}