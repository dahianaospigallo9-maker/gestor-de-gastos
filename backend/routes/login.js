const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../database/db");

const router = express.Router();

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


        const cleanEmail =
            email.trim().toLowerCase();


        // ==========================================
        // BUSCAR USUARIO EN POSTGRESQL
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


module.exports = router;