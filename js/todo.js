const todoForm = document.querySelector("#todo-form");
const todoInput = todoForm.querySelector("input");
const todoList = document.querySelector("#todo-list");

const TODO_KEY = "todo"
let todoArr = [];

function deleteToDo(event) {
    const item = event.target.parentElement;
    item.remove();
    todoArr = todoArr.filter((event) => event.id !== parseInt(item.id));
    saveToDo();
}

function paintToDo(todo) {
    const li = document.createElement("li");
    todoList.appendChild(li);
    li.id = todo.id;
    const span = document.createElement("span");
    li.appendChild(span);
    span.innerText = todo.text;
    const deleteBtn = document.createElement("button");
    li.appendChild(deleteBtn);
    deleteBtn.innerText = "×";
    deleteBtn.addEventListener("click", deleteToDo);
}

function saveToDo() {
    localStorage.setItem(TODO_KEY, JSON.stringify(todoArr));
}

function onToDoSubmit (event) {
    event.preventDefault();
    const todo = {
        text: todoInput.value,
        id: Date.now(),
    };
    todoInput.value = "";
    todoArr.push(todo);
    paintToDo(todo);
    saveToDo();
}

todoForm.addEventListener("submit", onToDoSubmit);

const savedToDo = localStorage.getItem(TODO_KEY);
const parsedToDo = JSON.parse(savedToDo);

if (savedToDo !== null) {
    parsedToDo.forEach(paintToDo);
    todoArr = parsedToDo;
}
