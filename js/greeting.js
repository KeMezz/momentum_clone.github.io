const loginForm = document.querySelector("#login-form");
const loginInput = loginForm.querySelector("input");
const loginButton = loginForm.querySelector("button");
const greetingForm = document.querySelector("#greeting-form");
const greeting = document.querySelector("#greeting");
const logout = greetingForm.querySelector("button");
const loginContainer = document.querySelector("#login-container");
const afterLoginContainer = document.querySelector("#after-login-container");

const HIDDEN_CLASSNAME_KEY = "hidden"

function handleSubmit(event) {
    event.preventDefault();
    loginForm.classList.add(HIDDEN_CLASSNAME_KEY);
    const name = loginInput.value;
    localStorage.setItem("name", name);
    paintGreetings(name);
}

const savedName = localStorage.getItem("name")

function paintGreetings(name) {
    greetingForm.classList.remove(HIDDEN_CLASSNAME_KEY);
    greeting.innerText = `어서오세요, ${name} 님!`;
    afterLoginContainer.style.display = "flex";
    loginContainer.style.display = "none";
}

if (savedName === null) {
    loginForm.classList.remove(HIDDEN_CLASSNAME_KEY);
    loginForm.addEventListener("submit", handleSubmit);
} else {
    loginForm.classList.add(HIDDEN_CLASSNAME_KEY);
    loginContainer.classList.add(HIDDEN_CLASSNAME_KEY);
    afterLoginContainer.style.display = "flex";
    paintGreetings(savedName);
}

function onLogout() {
    localStorage.removeItem("name");
    localStorage.removeItem("todo");
}

greetingForm.addEventListener("submit", onLogout);