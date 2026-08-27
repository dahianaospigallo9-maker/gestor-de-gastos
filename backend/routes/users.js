const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(
    __dirname,
    "../data/users.json"
);


// ==================================================
// CREAR CUENTA
// ==================================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // ==========================================
        // VALIDAR DATOS
        // ==========================================

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Todos los campos son obligatorios."

            });

        }


        // ==========================================
        // VALIDAR CONTRASEÑA
        // ==========================================

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;


        if (
            !passwordPattern.test(password)
        ) {

            return res.status(400).json({

                message:
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."

            });

        }


        // ==========================================
        // LEER USUARIOS
        // ==========================================

        const usersData =
            fs.readFileSync(
                usersFile,
                "utf-8"
            );


        const users =
            JSON.parse(usersData);


        // ==========================================
        // COMPROBAR CORREO EXISTENTE
        // ==========================================

        const userExists =
            users.some(
                (user) =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (userExists) {

            return res.status(409).json({

                message:
                    "Ya existe una cuenta con este correo electrónico."

            });

        }


        // ==========================================
        // ENCRIPTAR CONTRASEÑA
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ==========================================
        // CREAR USUARIO
        // ==========================================

        const newUser = {

            id: Date.now(),

            name:
                name.trim(),

            email:
                email.trim().toLowerCase(),

            password:
                hashedPassword,

            currency:
                null

        };


        // ==========================================
        // GUARDAR USUARIO
        // ==========================================

        users.push(
            newUser
        );


        fs.writeFileSync(

            usersFile,

            JSON.stringify(
                users,
                null,
                4
            )

        );


        // ==========================================
        // RESPUESTA
        // ==========================================

        res.status(201).json({

            message:
                "Cuenta creada correctamente."

        });


    } catch (error) {

        console.error(
            "Error al crear cuenta:",
            error
        );


        res.status(500).json({

            message:
                "No se pudo crear la cuenta."

        });

    }

});


// ==================================================
// INICIAR SESIÓN
// ==================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ==========================================
        // VALIDAR DATOS
        // ==========================================

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "El correo y la contraseña son obligatorios."

            });

        }


        // ==========================================
        // LEER USUARIOS
        // ==========================================

        const usersData =
            fs.readFileSync(
                usersFile,
                "utf-8"
            );


        const users =
            JSON.parse(usersData);


        // ==========================================
        // BUSCAR USUARIO
        // ==========================================

        const user =
            users.find(
                (user) =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (!user) {

            return res.status(401).json({

                message:
                    "Correo o contraseña incorrectos."

            });

        }


        // ==========================================
        // COMPARAR CONTRASEÑA
        // ==========================================

        const passwordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordCorrect) {

            return res.status(401).json({

                message:
                    "Correo o contraseña incorrectos."

            });

        }


        // ==========================================
        // RESPUESTA
        // ==========================================

        res.status(200).json({

            message:
                `Bienvenido, ${user.name}.`,

            user: {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email,

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


// ==================================================
// GUARDAR MONEDA PRINCIPAL
// ==================================================

router.put("/currency", (req, res) => {

    try {

        const {
            email,
            currency
        } = req.body;


        // ==========================================
        // VALIDAR CORREO
        // ==========================================

        if (!email) {

            return res.status(400).json({

                message:
                    "El correo del usuario es obligatorio."

            });

        }


        // ==========================================
        // VALIDAR MONEDA
        // ==========================================

        const currencies = [

            "EUR",
            "USD",
            "GBP",
            "COP",
            "MXN"

        ];


        if (
            !currencies.includes(currency)
        ) {

            return res.status(400).json({

                message:
                    "La moneda seleccionada no es válida."

            });

        }


        // ==========================================
        // LEER USUARIOS
        // ==========================================

        const usersData =
            fs.readFileSync(
                usersFile,
                "utf-8"
            );


        const users =
            JSON.parse(usersData);


        // ==========================================
        // BUSCAR USUARIO
        // ==========================================

        const userIndex =
            users.findIndex(
                (user) =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (
            userIndex === -1
        ) {

            return res.status(404).json({

                message:
                    "Usuario no encontrado."

            });

        }


        // ==========================================
        // GUARDAR MONEDA
        // ==========================================

        users[userIndex].currency =
            currency;


        // ==========================================
        // GUARDAR ARCHIVO
        // ==========================================

        fs.writeFileSync(

            usersFile,

            JSON.stringify(
                users,
                null,
                4
            )

        );


        // ==========================================
        // RESPUESTA
        // ==========================================

        res.status(200).json({

            message:
                "La moneda principal se guardó correctamente.",

            currency:
                currency

        });


    } catch (error) {

        console.error(
            "Error al guardar la moneda:",
            error
        );


        res.status(500).json({

            message:
                "No se pudo guardar la moneda."

        });

    }

});


module.exports = router;