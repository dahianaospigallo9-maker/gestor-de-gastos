const express = require("express");
const path = require("path");
const cors = require("cors");

const userRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
const movimientosRoutes = require("./routes/movimientos");

const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURACIÓN

app.use(express.json());
app.use(cors());

// Servir archivos del frontend

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);

// RUTAS

// Usuarios

app.use(
    "/api/users",
    userRoutes
);

// Inicio de sesión

app.use(
    "/api/login",
    loginRoutes
);

// Movimientos

app.use(
    "/api/movimientos",
    movimientosRoutes
);

// INICIAR SERVIDOR

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor ejecutándose en http://localhost:${PORT}`
        );

    }
);