console.log("Página de inicio de sesión iniciada.");

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    // Validar correo vacío

    if (email === "") {

        alert(
            "Por favor, ingresa tu correo electrónico."
        );

        return;
    }

    // Validar formato del correo

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert(
            "Por favor, ingresa un correo electrónico válido."
        );

        return;
    }

    // Validar contraseña

    if (password === "") {

        alert(
            "Por favor, ingresa tu contraseña."
        );

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:3000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        // Comprobar respuesta

        if (!response.ok) {

            alert(
                data.message ||
                "No se pudo iniciar sesión."
            );

            return;
        }

        // Guardar token JWT

        sessionStorage.setItem(
            "token",
            data.token
        );

        // Guardar nombre

        sessionStorage.setItem(
            "userName",
            data.user.name
        );

        // Guardar correo

        sessionStorage.setItem(
            "userEmail",
            data.user.email
        );

        // Guardar moneda si existe

        if (data.user.currency) {

            sessionStorage.setItem(
                "mainCurrency",
                data.user.currency
            );
        }

        alert(data.message);

        loginForm.reset();

        // Ir al dashboard

        window.location.href =
            "../dashboard.html";

    } catch (error) {

        console.error(
            "Error al iniciar sesión:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );
    }

});