const API = "https://todolist-latest-g9ze.onrender.com/api/todos";

const newTodoInput = document.getElementById("newTodo");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const statusDiv = document.getElementById("status");

addBtn.addEventListener("click", handleAdd);
newTodoInput.addEventListener("keypress", e => {
  if (e.key === "Enter") handleAdd();
});

async function handleAdd() {
  const title = newTodoInput.value.trim();
  if (!title) return showStatus("Type a task first.", true);

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error("Failed to create todo");
    newTodoInput.value = "";
    showStatus("Task added.");
    await loadTodos();
  } catch (err) {
    console.error(err);
    showStatus("Error adding task.", true);
  }
}

function showStatus(msg, isError = false) {
  statusDiv.textContent = msg;
  statusDiv.style.color = isError ? "#b91c1c" : "#065f46";
  setTimeout(() => { statusDiv.textContent = ""; }, 3000);
}

async function loadTodos() {
  try {
    const res = await fetch(API);
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    console.error(err);
    showStatus("Error loading todos.", true);
  }
}

function renderTodos(todos) {
  todoList.innerHTML = "";
  if (!todos.length) {
    todoList.innerHTML = `<li class="small">No tasks — add one above.</li>`;
    return;
  }

  todos.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const left = document.createElement("div");
    left.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleCompleted(todo, checkbox.checked));

    const title = document.createElement("span");
    title.className = "todo-title" + (todo.completed ? " completed" : "");
    title.textContent = todo.title;

    left.appendChild(checkbox);
    left.appendChild(title);

    const right = document.createElement("div");
    const delBtn = document.createElement("button");
    delBtn.className = "btn delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteTodo(todo.id));

    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);

    todoList.appendChild(li);
  });
}

async function toggleCompleted(todo, completed) {
  try {
    const res = await fetch(`${API}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, completed })
    });
    if (!res.ok) throw new Error("Failed to update");
    showStatus("Updated.");
    await loadTodos();
  } catch (err) {
    console.error(err);
    showStatus("Error updating.", true);
  }
}

async function deleteTodo(id) {
  if (!confirm("Delete this task?")) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.status === 204) {
      showStatus("Deleted.");
      await loadTodos();
    } else {
      throw new Error("Delete failed");
    }
  } catch (err) {
    console.error(err);
    showStatus("Error deleting.", true);
  }
}

// initial load
loadTodos();
