let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  tasks.push({ text: input.value, completed: false });
  input.value = "";
  save();
  render();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  save();
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  save();
  render();
}

function filterTasks(type) {
  currentFilter = type;

  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
}

function render() {
  const list = document.getElementById("taskList");
  const count = document.getElementById("taskCount");

  list.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span class="task-text" onclick="toggleTask(${index})">${task.text}</span>
      <button class="delete" onclick="deleteTask(${index})">✖</button>
    `;

    list.appendChild(li);
  });

  count.textContent = `${tasks.length} tasks`;
}

render();