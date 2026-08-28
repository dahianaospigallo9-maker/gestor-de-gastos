const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../database/db");

const router = express.Router();

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "clave-temporal-desarrollo";


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


        const cleanName =
            name.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        // ==========================================
        // COMPROBAR CORREO EXISTENTE
        // ==========================================

        const existingUser =
            await pool.query(
                `
                SELECT id
                FROM usuarios
                WHERE correo = $1
                `,
                [cleanEmail]
            );


        if (
            existingUser.rows.length > 0
        ) {

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

        const result =
            await pool.query(
                `
                INSERT INTO usuarios
                (
                    nombre,
                    correo,
                    password,
                    moneda
                )
                VALUES
                ($1, $2, $3, $4)
                RETURNING id, nombre, correo, moneda
                `,
                [
                    cleanName,
                    cleanEmail,
                    hashedPassword,
                    null
                ]
            );


        const user =
            result.rows[0];


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


        // Correo duplicado
        if (
            error.code === "23505"
        ) {

            return res.status(409).json({

                message:
                    "Ya existe una cuenta con este correo electrónico."

            });

        }


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


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "El correo y la contraseña son obligatorios."

            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        // ==========================================
        // BUSCAR USUARIO
        // ==========================================

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    nombre,
                    correo,
                    password,
                    moneda
                FROM usuarios
                WHERE correo = $1
                `,
                [cleanEmail]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(401).json({

                message:
                    "Correo o contraseña incorrectos."

            });

        }


        const user =
            result.rows[0];


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
        // CREAR TOKEN
        // ==========================================

        const token =
            jwt.sign(

                {
                    userId: user.id,
                    email: user.correo
                },

                JWT_SECRET,

                {
                    expiresIn: "2h"
                }

            );


        // ==========================================
        // RESPUESTA
        // ==========================================

        res.status(200).json({

            message:
                `Bienvenido, ${user.nombre}.`,

            token: token,

            user: {

                id:
                    user.id,

                name:
                    user.nombre,

                email:
                    user.correo,

                currency:
                    user.moneda || null

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

router.put("/currency", async (req, res) => {

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
        // ACTUALIZAR USUARIO
        // ==========================================

        const result =
            await pool.query(
                `
                UPDATE usuarios
                SET moneda = $1
                WHERE correo = $2
                RETURNING id, nombre, correo, moneda
                `,
                [
                    currency,
                    email.trim().toLowerCase()
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "Usuario no encontrado."

            });

        }


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