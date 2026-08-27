console.log("Gestor de gastos iniciado correctamente.");

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

// Ir a la página de inicio de sesión
loginButton.addEventListener("click", () => {
    window.location.href = "pages/login.html";
});

// Ir a la página de registro
registerButton.addEventListener("click", () => {
    window.location.href = "pages/registro.html";
});