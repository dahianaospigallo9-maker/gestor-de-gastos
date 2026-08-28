const express = require("express");

const pool = require("../database/db");

const router = express.Router();


// ==================================================
// OBTENER MOVIMIENTOS
// ==================================================

router.get("/", async (req, res) => {

    try {

        const result =
            await pool.query(
                `
                SELECT
                    m.id,
                    u.nombre AS usuario,
                    m.tipo,
                    m.descripcion,
                    m.cantidad,
                    m.moneda,
                    m.categoria,
                    m.fecha
                FROM movimientos m
                INNER JOIN usuarios u
                    ON m.usuario_id = u.id
                ORDER BY m.id ASC
                `
            );


        res.status(200).json(
            result.rows
        );


    } catch (error) {

        console.error(
            "Error al obtener movimientos:",
            error
        );


        res.status(500).json({

            message:
                "No se pudieron obtener los movimientos."

        });

    }

});


// ==================================================
// CREAR MOVIMIENTO
// ==================================================

router.post("/", async (req, res) => {

    try {

        const {
            usuario,
            tipo,
            descripcion,
            cantidad,
            moneda,
            categoria,
            fecha
        } = req.body;


        // ==========================================
        // VALIDACIONES
        // ==========================================

        if (!usuario) {

            return res.status(400).json({

                message:
                    "El usuario es obligatorio."

            });

        }


        if (
            tipo !== "income" &&
            tipo !== "expense" &&
            tipo !== "saving"
        ) {

            return res.status(400).json({

                message:
                    "El tipo de movimiento no es válido."

            });

        }


        if (!descripcion) {

            return res.status(400).json({

                message:
                    "La descripción es obligatoria."

            });

        }


        if (
            typeof cantidad !== "number" ||
            cantidad <= 0
        ) {

            return res.status(400).json({

                message:
                    "La cantidad debe ser mayor que cero."

            });

        }


        if (!moneda) {

            return res.status(400).json({

                message:
                    "La moneda es obligatoria."

            });

        }


        if (!fecha) {

            return res.status(400).json({

                message:
                    "La fecha es obligatoria."

            });

        }


        // ==========================================
        // BUSCAR USUARIO
        // ==========================================

        const userResult =
            await pool.query(
                `
                SELECT id
                FROM usuarios
                WHERE nombre = $1
                `,
                [usuario]
            );


        if (
            userResult.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "El usuario no fue encontrado."

            });

        }


        const usuarioId =
            userResult.rows[0].id;


        // ==========================================
        // CREAR MOVIMIENTO
        // ==========================================

        const result =
            await pool.query(
                `
                INSERT INTO movimientos
                (
                    usuario_id,
                    tipo,
                    descripcion,
                    cantidad,
                    moneda,
                    categoria,
                    fecha
                )
                VALUES
                ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
                `,
                [
                    usuarioId,
                    tipo,
                    descripcion.trim(),
                    cantidad,
                    moneda,
                    tipo === "expense"
                        ? categoria
                        : null,
                    fecha
                ]
            );


        const movimientoResult =
            await pool.query(
                `
                SELECT
                    m.id,
                    u.nombre AS usuario,
                    m.tipo,
                    m.descripcion,
                    m.cantidad,
                    m.moneda,
                    m.categoria,
                    m.fecha
                FROM movimientos m
                INNER JOIN usuarios u
                    ON m.usuario_id = u.id
                WHERE m.id = $1
                `,
                [result.rows[0].id]
            );


        res.status(201).json({

            message:
                "Movimiento guardado correctamente.",

            movimiento:
                movimientoResult.rows[0]

        });


    } catch (error) {

        console.error(
            "Error al guardar movimiento:",
            error
        );


        res.status(500).json({

            message:
                "No se pudo guardar el movimiento."

        });

    }

});


// ==================================================
// EDITAR MOVIMIENTO
// ==================================================

router.put("/:id", async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (
            Number.isNaN(id)
        ) {

            return res.status(400).json({

                message:
                    "El identificador del movimiento no es válido."

            });

        }


        const {
            tipo,
            descripcion,
            cantidad,
            moneda,
            categoria,
            fecha
        } = req.body;


        // ==========================================
        // VALIDACIONES
        // ==========================================

        if (
            tipo !== "income" &&
            tipo !== "expense" &&
            tipo !== "saving"
        ) {

            return res.status(400).json({

                message:
                    "El tipo de movimiento no es válido."

            });

        }


        if (!descripcion) {

            return res.status(400).json({

                message:
                    "La descripción es obligatoria."

            });

        }


        if (
            typeof cantidad !== "number" ||
            cantidad <= 0
        ) {

            return res.status(400).json({

                message:
                    "La cantidad debe ser mayor que cero."

            });

        }


        if (!moneda) {

            return res.status(400).json({

                message:
                    "La moneda es obligatoria."

            });

        }


        if (!fecha) {

            return res.status(400).json({

                message:
                    "La fecha es obligatoria."

            });

        }


        // ==========================================
        // ACTUALIZAR
        // ==========================================

        const result =
            await pool.query(
                `
                UPDATE movimientos
                SET
                    tipo = $1,
                    descripcion = $2,
                    cantidad = $3,
                    moneda = $4,
                    categoria = $5,
                    fecha = $6
                WHERE id = $7
                RETURNING id
                `,
                [
                    tipo,
                    descripcion.trim(),
                    cantidad,
                    moneda,
                    tipo === "expense"
                        ? categoria
                        : null,
                    fecha,
                    id
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "El movimiento no fue encontrado."

            });

        }


        // ==========================================
        // OBTENER MOVIMIENTO ACTUALIZADO
        // ==========================================

        const updatedResult =
            await pool.query(
                `
                SELECT
                    m.id,
                    u.nombre AS usuario,
                    m.tipo,
                    m.descripcion,
                    m.cantidad,
                    m.moneda,
                    m.categoria,
                    m.fecha
                FROM movimientos m
                INNER JOIN usuarios u
                    ON m.usuario_id = u.id
                WHERE m.id = $1
                `,
                [id]
            );


        res.status(200).json({

            message:
                "Movimiento actualizado correctamente.",

            movimiento:
                updatedResult.rows[0]

        });


    } catch (error) {

        console.error(
            "Error al editar movimiento:",
            error
        );


        res.status(500).json({

            message:
                "No se pudo editar el movimiento."

        });

    }

});


// ==================================================
// ELIMINAR MOVIMIENTO
// ==================================================

router.delete("/:id", async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (
            Number.isNaN(id)
        ) {

            return res.status(400).json({

                message:
                    "El identificador del movimiento no es válido."

            });

        }


        const result =
            await pool.query(
                `
                DELETE FROM movimientos
                WHERE id = $1
                RETURNING id
                `,
                [id]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "El movimiento no fue encontrado."

            });

        }


        res.status(200).json({

            message:
                "Movimiento eliminado correctamente."

        });


    } catch (error) {

        console.error(
            "Error al eliminar movimiento:",
            error
        );


        res.status(500).json({

            message:
                "No se pudo eliminar el movimiento."

        });

    }

});


module.exports = router;