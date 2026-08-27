console.log("Página de registro iniciada.");

// Formulario de registro

const registerForm = document.getElementById("registerForm");

// Reglas visuales de la contraseña

const passwordInput = document.getElementById("password");

passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;
    const hasMinimumLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%&*.]/.test(password);

    document.getElementById("lengthRule").textContent =
        `${hasMinimumLength ? "✓" : "○"} Mínimo 8 caracteres`;

    document.getElementById("uppercaseRule").textContent =
        `${hasUppercase ? "✓" : "○"} Una letra mayúscula`;

    document.getElementById("lowercaseRule").textContent =
        `${hasLowercase ? "✓" : "○"} Una letra minúscula`;

    document.getElementById("numberRule").textContent =
        `${hasNumber ? "✓" : "○"} Un número`;

    document.getElementById("specialRule").textContent =
        `${hasSpecialCharacter ? "✓" : "○"} Un carácter especial`;
});

// Validación y envío del formulario

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Validar nombre

    if (name === "") {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    // Validar correo vacío

    if (email === "") {
        alert("Por favor, ingresa tu correo electrónico.");
        return;
    }

    // Validar formato del correo

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    // Validar contraseña vacía

    if (password === "") {
        alert("Por favor, ingresa una contraseña.");
        return;
    }

    // Validar reglas de contraseña

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*.]).{8,}$/;

    if (!passwordPattern.test(password)) {

        alert(
            "La contraseña debe tener mínimo 8 caracteres, " +
            "una mayúscula, una minúscula, un número " +
            "y un carácter especial."
        );
        return;
    }

    // Validar confirmación

    if (confirmPassword === "") {

        alert("Por favor, confirma tu contraseña.");
        return;
    }

    // Comprobar contraseñas

    if (password !== confirmPassword) {

        alert("Las contraseñas no coinciden.");
        return;
    }

    // Enviar información al backend

    try {

        const response = await fetch("/api/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "No se pudo crear la cuenta."
            );
            return;
        }

        alert(data.message);

        registerForm.reset();

    } catch (error) {

        console.error(
            "Error al crear la cuenta:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );
    }
});