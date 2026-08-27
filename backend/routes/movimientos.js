const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const movimientosFile = path.join(
    __dirname,
    "../data/movimientos.json"
);


// ==================================================
// OBTENER MOVIMIENTOS
// ==================================================

router.get("/", (req, res) => {

    try {

        const movimientosData =
            fs.readFileSync(
                movimientosFile,
                "utf-8"
            );

        const movimientos =
            JSON.parse(movimientosData);

        res.status(200).json(movimientos);

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

router.post("/", (req, res) => {

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
        // LEER MOVIMIENTOS
        // ==========================================

        const movimientosData =
            fs.readFileSync(
                movimientosFile,
                "utf-8"
            );

        const movimientos =
            JSON.parse(movimientosData);


        // ==========================================
        // CREAR MOVIMIENTO
        // ==========================================

        const nuevoMovimiento = {

            id: Date.now(),

            usuario: usuario,

            tipo: tipo,

            descripcion:
                descripcion,

            cantidad:
                cantidad,

            moneda:
                moneda,

            categoria:
                tipo === "expense"
                    ? categoria
                    : null,

            fecha:
                fecha

        };


        // ==========================================
        // GUARDAR
        // ==========================================

        movimientos.push(
            nuevoMovimiento
        );


        fs.writeFileSync(

            movimientosFile,

            JSON.stringify(
                movimientos,
                null,
                4
            )

        );


        // ==========================================
        // RESPUESTA
        // ==========================================

        res.status(201).json({

            message:
                "Movimiento guardado correctamente.",

            movimiento:
                nuevoMovimiento

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

router.put("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        // ==========================================
        // VALIDAR ID
        // ==========================================

        if (Number.isNaN(id)) {

            return res.status(400).json({

                message:
                    "El identificador del movimiento no es válido."

            });

        }


        // ==========================================
        // RECIBIR DATOS
        // ==========================================

        const {
            tipo,
            descripcion,
            cantidad,
            moneda,
            categoria,
            fecha
        } = req.body;


        // ==========================================
        // VALIDAR TIPO
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


        // ==========================================
        // VALIDAR DESCRIPCIÓN
        // ==========================================

        if (!descripcion) {

            return res.status(400).json({

                message:
                    "La descripción es obligatoria."

            });

        }


        // ==========================================
        // VALIDAR CANTIDAD
        // ==========================================

        if (
            typeof cantidad !== "number" ||
            cantidad <= 0
        ) {

            return res.status(400).json({

                message:
                    "La cantidad debe ser mayor que cero."

            });

        }


        // ==========================================
        // VALIDAR MONEDA
        // ==========================================

        if (!moneda) {

            return res.status(400).json({

                message:
                    "La moneda es obligatoria."

            });

        }


        // ==========================================
        // VALIDAR FECHA
        // ==========================================

        if (!fecha) {

            return res.status(400).json({

                message:
                    "La fecha es obligatoria."

            });

        }


        // ==========================================
        // LEER MOVIMIENTOS
        // ==========================================

        const movimientosData =
            fs.readFileSync(
                movimientosFile,
                "utf-8"
            );

        const movimientos =
            JSON.parse(movimientosData);


        // ==========================================
        // BUSCAR MOVIMIENTO
        // ==========================================

        const movimientoIndex =
            movimientos.findIndex(
                (movimiento) =>
                    movimiento.id === id
            );


        if (movimientoIndex === -1) {

            return res.status(404).json({

                message:
                    "El movimiento no fue encontrado."

            });

        }


        // ==========================================
        // ACTUALIZAR MOVIMIENTO
        // ==========================================

        movimientos[movimientoIndex] = {

            ...movimientos[movimientoIndex],

            tipo:
                tipo,

            descripcion:
                descripcion,

            cantidad:
                cantidad,

            moneda:
                moneda,

            categoria:
                tipo === "expense"
                    ? categoria
                    : null,

            fecha:
                fecha

        };


        // ==========================================
        // GUARDAR CAMBIOS
        // ==========================================

        fs.writeFileSync(

            movimientosFile,

            JSON.stringify(
                movimientos,
                null,
                4
            )

        );


        // ==========================================
        // RESPUESTA
        // ==========================================

        res.status(200).json({

            message:
                "Movimiento actualizado correctamente.",

            movimiento:
                movimientos[movimientoIndex]

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

router.delete("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        // Validar ID

        if (Number.isNaN(id)) {

            return res.status(400).json({

                message:
                    "El identificador del movimiento no es válido."

            });

        }


        // Leer movimientos

        const movimientosData =
            fs.readFileSync(
                movimientosFile,
                "utf-8"
            );

        const movimientos =
            JSON.parse(movimientosData);


        // Buscar movimiento

        const movimientoExiste =
            movimientos.some(
                (movimiento) =>
                    movimiento.id === id
            );


        if (!movimientoExiste) {

            return res.status(404).json({

                message:
                    "El movimiento no fue encontrado."

            });

        }


        // Eliminar movimiento

        const movimientosActualizados =
            movimientos.filter(
                (movimiento) =>
                    movimiento.id !== id
            );


        // Guardar cambios

        fs.writeFileSync(

            movimientosFile,

            JSON.stringify(
                movimientosActualizados,
                null,
                4
            )

        );


        // Respuesta

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