const express = require("express");
const path = require("path");
const cors = require("cors");

const crearTablas =
    require("./database/init");

const userRoutes =
    require("./routes/users");

const loginRoutes =
    require("./routes/login");

const movimientosRoutes =
    require("./routes/movimientos");


const app = express();

const PORT =
    process.env.PORT || 3000;


// ==================================================
// CONFIGURACIÓN
// ==================================================

app.use(
    express.json()
);

app.use(
    cors()
);


// ==================================================
// SERVIR FRONTEND
// ==================================================

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


// ==================================================
// RUTAS
// ==================================================

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/login",
    loginRoutes
);

app.use(
    "/api/movimientos",
    movimientosRoutes
);


// ==================================================
// INICIAR SERVIDOR
// ==================================================

async function iniciarServidor() {

    try {

        await crearTablas();

        app.listen(
            PORT,
            () => {

                console.log(
                    `Servidor ejecutándose en http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "❌ No se pudo iniciar el servidor:",
            error
        );

        process.exit(1);
    }

}


iniciarServidor();