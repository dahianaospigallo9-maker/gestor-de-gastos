const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(
    __dirname,
    "../data/users.json"
);


// Clave temporal para desarrollo local

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "clave-temporal-desarrollo";


// ==================================================
// INICIAR SESIÓN
// ==================================================

router.post("/", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validar datos

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "El correo y la contraseña son obligatorios."

            });

        }


        // Leer usuarios

        const usersData =
            fs.readFileSync(
                usersFile,
                "utf-8"
            );


        const users =
            JSON.parse(usersData);


        // Buscar usuario por correo

        const user =
            users.find(
                (user) =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
            );


        // Usuario no encontrado

        if (!user) {

            return res.status(401).json({

                message:
                    "Correo o contraseña incorrectos."

            });

        }


        // Comparar contraseña con el hash

        const passwordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        // Contraseña incorrecta

        if (!passwordCorrect) {

            return res.status(401).json({

                message:
                    "Correo o contraseña incorrectos."

            });

        }


        // ==================================================
        // CREAR TOKEN
        // ==================================================

        const token =
            jwt.sign(

                {
                    userId: user.id,
                    email: user.email
                },

                JWT_SECRET,

                {
                    expiresIn: "2h"
                }

            );


        // ==================================================
        // RESPUESTA
        // ==================================================

        res.status(200).json({

            message:
                `Bienvenido, ${user.name}.`,

            token: token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                currency:
                    user.currency || null

            }

        });


    } catch (error) {

        console.error(
            "Error al iniciar sesión:",
            error
        );


        res.status(500).json({

            message:
                "Ocurrió un error al iniciar sesión."

        });

    }

});


module.exports = router;