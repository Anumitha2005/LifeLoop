
let tasks = JSON.parse(localStorage.getItem("lifeloopTasks")) || [];

let currentFilter = "All";

const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

function saveTasks() {
    localStorage.setItem("lifeloopTasks", JSON.stringify(tasks));
}

function addTask() {

    const name = taskInput.value.trim();

    if (name === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        name: name,
        category: categoryInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();
}

function toggleTask(id) {

    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    displayTasks();
}

function filterTasks(filter) {

    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );
    });

    displayTasks();
}

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "Pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "Completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const details = document.createElement("div");

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;

        const category = document.createElement("small");
        category.textContent = task.category;

        details.append(name, category);

        info.append(checkbox, details);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.append(info, deleteButton);

        taskList.appendChild(li);

    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateSummary();
}

function updateSummary() {

    const completed = tasks.filter(task => task.completed).length;

    const pending = tasks.length - completed;

    document.getElementById("totalTasks").textContent = tasks.length;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;
}

document.getElementById("addTaskBtn").addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {
        filterTasks(button.dataset.filter);
    });

});

displayTasks();
