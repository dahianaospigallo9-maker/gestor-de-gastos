const pool = require("./db");

async function crearTablas() {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(80) NOT NULL,
                correo VARCHAR(160) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                moneda VARCHAR(10) DEFAULT 'COP'
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS movimientos (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER NOT NULL
                    REFERENCES usuarios(id)
                    ON DELETE CASCADE,
                tipo VARCHAR(20) NOT NULL,
                descripcion VARCHAR(150) NOT NULL,
                cantidad NUMERIC(15,2) NOT NULL,
                moneda VARCHAR(10) NOT NULL,
                categoria VARCHAR(100),
                fecha DATE NOT NULL
            );
        `);

        console.log(
            "✅ Tablas de PostgreSQL verificadas correctamente."
        );

    } catch (error) {

        console.error(
            "❌ Error creando las tablas:",
            error
        );

        throw error;
    }
}

module.exports = crearTablas;