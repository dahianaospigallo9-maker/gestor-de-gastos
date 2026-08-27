console.log("Panel principal iniciado.");

// SESIÓN

const token = sessionStorage.getItem("token");
const userName = sessionStorage.getItem("userName");
const userEmail = sessionStorage.getItem("userEmail");

// URL DEL BACKEND
// En desarrollo local utiliza el mismo servidor.
// Cuando se despliegue, se puede cambiar por la URL del backend.

const API_URL = "http://localhost:3000";

// COMPROBAR SESIÓN

if (!token) {

    alert(
        "Debes iniciar sesión para acceder al panel."
    );

    window.location.href = "pages/login.html";

} else {

    document.getElementById("userName").textContent =
        userName;

}

// ELEMENTOS DEL DASHBOARD

const totalIncome =
    document.getElementById("totalIncome");

const totalExpenses =
    document.getElementById("totalExpenses");

const balance =
    document.getElementById("balance");

const totalSavings =
    document.getElementById("totalSavings");

const recentMovements =
    document.getElementById("recentMovements");

const movementFilter =
    document.getElementById("movementFilter");

// CERRAR SESIÓN

const logoutButton =
    document.getElementById("logoutButton");

logoutButton.addEventListener(
    "click",
    () => {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("mainCurrency");

        alert(
            "Sesión cerrada correctamente."
        );

        window.location.href =
            "index.html";
    }
);

// CONFIGURACIÓN DE MONEDA

const mainCurrency =
    document.getElementById("mainCurrency");

const saveCurrencyButton =
    document.getElementById("saveCurrencyButton");

// GUARDAR MONEDA PRINCIPAL

saveCurrencyButton.addEventListener(
    "click",
    async () => {

        const currency =
            mainCurrency.value;

        if (currency === "") {

            alert(
                "Por favor, selecciona una moneda."
            );

            return;
        }

        if (!userEmail) {

            alert(
                "No se pudo identificar al usuario."
            );

            return;
        }

        try {

            const response =
                await fetch(
                    `${API_URL}/api/users/currency`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: userEmail,
                            currency: currency
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "No se pudo guardar la moneda."
                );

                return;
            }

            sessionStorage.setItem(
                "mainCurrency",
                currency
            );

            alert(data.message);

            cargarMovimientos();

        } catch (error) {

            console.error(
                "Error al guardar la moneda:",
                error
            );

            alert(
                "No se pudo conectar con el servidor."
            );
        }
    }
);

// CARGAR MONEDA GUARDADA

const savedCurrency =
    sessionStorage.getItem("mainCurrency");

if (savedCurrency) {

    mainCurrency.value =
        savedCurrency;
}

// SÍMBOLOS DE MONEDA

function obtenerSimboloMoneda(moneda) {

    const simbolos = {

        EUR: "€",
        USD: "$",
        GBP: "£",
        COP: "$",
        MXN: "$"

    };

    return (
        simbolos[moneda] ||
        moneda
    );
}

// FORMATEAR CANTIDAD

function formatearCantidad(cantidad) {

    return Number(cantidad).toLocaleString(
        "es-ES",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}

// ELEMENTOS DEL FORMULARIO

const movementForm =
    document.getElementById("movementForm");

const movementType =
    document.getElementById("movementType");

const categoryGroup =
    document.getElementById("categoryGroup");

const category =
    document.getElementById("category");

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const dateInput =
    document.getElementById("date");

// VARIABLE DE EDICIÓN

let movimientoEditandoId = null;

// FILTRO DE MOVIMIENTOS

let filtroActual = "all";

let movimientosUsuario = [];

// MOSTRAR / OCULTAR CATEGORÍA

movementType.addEventListener(
    "change",
    () => {

        if (
            movementType.value ===
            "expense"
        ) {

            categoryGroup.style.display =
                "block";

            category.required =
                true;

        } else {

            categoryGroup.style.display =
                "none";

            category.required =
                false;

            category.value =
                "";
        }
    }
);

// CAMBIAR FILTRO

function cambiarFiltro(filtro) {

    filtroActual =
        filtro;

    mostrarMovimientos(
        movimientosUsuario
    );
}

movementFilter.addEventListener(
    "change",
    () => {

        cambiarFiltro(
            movementFilter.value
        );
    }
);

// CARGAR MOVIMIENTOS

async function cargarMovimientos() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/movimientos`
            );

        if (!response.ok) {

            throw new Error(
                "No se pudieron obtener los movimientos."
            );
        }

        const movimientos =
            await response.json();

        // Solo movimientos del usuario actual

        movimientosUsuario =
            movimientos.filter(
                (movimiento) =>
                    movimiento.usuario ===
                    userName
            );

        calcularResumen(
            movimientosUsuario
        );

        mostrarMovimientos(
            movimientosUsuario
        );

    } catch (error) {

        console.error(
            "Error al cargar movimientos:",
            error
        );

        recentMovements.innerHTML =
            "<p>No se pudieron cargar los movimientos.</p>";
    }
}

// CALCULAR RESUMEN

function calcularResumen(movimientos) {

    let ingresos = 0;
    let gastos = 0;
    let ahorros = 0;
    let saldo = 0;

    movimientos.forEach(
        (movimiento) => {

            const cantidad =
                Number(
                    movimiento.cantidad
                );

            // INGRESO

            if (
                movimiento.tipo ===
                "income"
            ) {

                ingresos += cantidad;

                const strategy =
                    new IngresoStrategy();

                saldo =
                    strategy.procesar(
                        movimiento,
                        saldo
                    );
            }

            // GASTO

            else if (
                movimiento.tipo ===
                "expense"
            ) {

                gastos += cantidad;

                const strategy =
                    new GastoStrategy();

                saldo =
                    strategy.procesar(
                        movimiento,
                        saldo
                    );
            }

            // AHORRO

            else if (
                movimiento.tipo ===
                "saving"
            ) {

                ahorros += cantidad;

                const strategy =
                    new AhorroStrategy();

                saldo =
                    strategy.procesar(
                        movimiento,
                        saldo
                    );
            }
        }
    );

    const currency =
        sessionStorage.getItem(
            "mainCurrency"
        ) || "EUR";

    const simbolo =
        obtenerSimboloMoneda(
            currency
        );

    totalIncome.textContent =
        `${formatearCantidad(
            ingresos
        )} ${simbolo}`;

    totalExpenses.textContent =
        `${formatearCantidad(
            gastos
        )} ${simbolo}`;

    totalSavings.textContent =
        `${formatearCantidad(
            ahorros
        )} ${simbolo}`;

    balance.textContent =
        `${formatearCantidad(
            saldo
        )} ${simbolo}`;
}

// MOSTRAR MOVIMIENTOS

function mostrarMovimientos(movimientos) {

    let movimientosFiltrados;

    if (
        filtroActual ===
        "income"
    ) {

        movimientosFiltrados =
            movimientos.filter(
                (movimiento) =>
                    movimiento.tipo ===
                    "income"
            );

    } else if (
        filtroActual ===
        "expense"
    ) {

        movimientosFiltrados =
            movimientos.filter(
                (movimiento) =>
                    movimiento.tipo ===
                    "expense"
            );

    } else if (
        filtroActual ===
        "saving"
    ) {

        movimientosFiltrados =
            movimientos.filter(
                (movimiento) =>
                    movimiento.tipo ===
                    "saving"
            );

    } else {

        movimientosFiltrados =
            movimientos;
    }

    // SIN MOVIMIENTOS

    if (
        movimientosFiltrados.length ===
        0
    ) {

        recentMovements.innerHTML =
            "<p>No hay movimientos para este filtro.</p>";

        return;
    }

    // ORDENAR

    const movimientosOrdenados =
        [...movimientosFiltrados].reverse();

    recentMovements.innerHTML =
        "";

    // CREAR MOVIMIENTOS

    movimientosOrdenados.forEach(
        (movimiento) => {

            const article =
                document.createElement(
                    "article"
                );

            article.classList.add(
                "movement-item"
            );

            const simbolo =
                obtenerSimboloMoneda(
                    movimiento.moneda
                );

            const signo =
                movimiento.tipo ===
                "income"
                    ? "+"
                    : "-";

            const tipoTexto =
                movimiento.tipo ===
                "income"
                    ? "Ingreso"
                    : movimiento.tipo ===
                    "expense"
                        ? "Gasto"
                        : "Ahorro";

            const cantidad =
                formatearCantidad(
                    movimiento.cantidad
                );

            article.innerHTML = `

                <h3>
                    ${movimiento.descripcion}
                </h3>

                <p>
                    ${tipoTexto}
                </p>

                <p>
                    ${signo}
                    ${cantidad}
                    ${simbolo}
                </p>

                <p>
                    ${movimiento.fecha}
                </p>

                <button
                    type="button"
                    class="edit-movement-button"
                    data-id="${movimiento.id}"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    class="delete-movement-button"
                    data-id="${movimiento.id}"
                >
                    🗑️ Eliminar
                </button>

            `;

            recentMovements.appendChild(
                article
            );
        }
    );

    // BOTONES EDITAR

    const editButtons =
        document.querySelectorAll(
            ".edit-movement-button"
        );

    editButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const movementId =
                        Number(
                            button.dataset.id
                        );

                    editarMovimiento(
                        movementId,
                        movimientos
                    );
                }
            );
        }
    );

    // BOTONES ELIMINAR

    const deleteButtons =
        document.querySelectorAll(
            ".delete-movement-button"
        );

    deleteButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const movementId =
                        Number(
                            button.dataset.id
                        );

                    eliminarMovimiento(
                        movementId
                    );
                }
            );
        }
    );
}

// EDITAR MOVIMIENTO

function editarMovimiento(
    movementId,
    movimientos
) {

    const movimiento =
        movimientos.find(
            (item) =>
                Number(item.id) ===
                Number(movementId)
        );

    if (!movimiento) {

        alert(
            "No se encontró el movimiento."
        );

        return;
    }

    movimientoEditandoId =
        Number(movementId);

    movementType.value =
        movimiento.tipo;

    descriptionInput.value =
        movimiento.descripcion;

    amountInput.value =
        movimiento.cantidad;

    amountInput.disabled =
        false;

    amountInput.readOnly =
        false;

    dateInput.value =
        movimiento.fecha;

    if (
        movimiento.tipo ===
        "expense"
    ) {

        categoryGroup.style.display =
            "block";

        category.required =
            true;

        category.value =
            movimiento.categoria ||
            "";

    } else {

        categoryGroup.style.display =
            "none";

        category.required =
            false;

        category.value =
            "";
    }

    const submitButton =
        movementForm.querySelector(
            'button[type="submit"]'
        );

    submitButton.textContent =
        "Actualizar movimiento";

    movementForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ELIMINAR MOVIMIENTO

async function eliminarMovimiento(
    movementId
) {

    const confirmar =
        confirm(
            "¿Estás segura de que quieres eliminar este movimiento?"
        );

    if (!confirmar) {

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/movimientos/${movementId}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "No se pudo eliminar el movimiento."
            );

            return;
        }

        alert(
            "Movimiento eliminado correctamente."
        );

        cargarMovimientos();

    } catch (error) {

        console.error(
            "Error al eliminar movimiento:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );
    }
}

// CANCELAR EDICIÓN

function cancelarEdicion() {

    movimientoEditandoId =
        null;

    movementForm.reset();

    categoryGroup.style.display =
        "none";

    category.required =
        false;

    const submitButton =
        movementForm.querySelector(
            'button[type="submit"]'
        );

    submitButton.textContent =
        "Guardar movimiento";
}

// GUARDAR O ACTUALIZAR

movementForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const type =
            movementType.value;

        const description =
            descriptionInput.value.trim();

        const amount =
            Number(
                amountInput.value
            );

        const selectedCategory =
            category.value;

        const date =
            dateInput.value;

        const currency =
            sessionStorage.getItem(
                "mainCurrency"
            );

        // VALIDACIONES

        if (type === "") {

            alert(
                "Por favor, selecciona el tipo de movimiento."
            );

            return;
        }

        if (description === "") {

            alert(
                "Por favor, ingresa una descripción."
            );

            return;
        }

        if (
            amount <= 0 ||
            Number.isNaN(amount)
        ) {

            alert(
                "Por favor, ingresa una cantidad válida."
            );

            return;
        }

        if (!currency) {

            alert(
                "Primero debes seleccionar y guardar una moneda principal."
            );

            return;
        }

        if (
            type === "expense" &&
            selectedCategory === ""
        ) {

            alert(
                "Por favor, selecciona una categoría para el gasto."
            );

            return;
        }

        if (date === "") {

            alert(
                "Por favor, selecciona una fecha."
            );

            return;
        }

        // EDITAR MOVIMIENTO

        if (
            movimientoEditandoId !==
            null
        ) {

            try {

                const movimientoActualizado = {

                    tipo:
                        type,

                    descripcion:
                        description,

                    cantidad:
                        amount,

                    moneda:
                        currency,

                    categoria:
                        type === "expense"
                            ? selectedCategory
                            : null,

                    fecha:
                        date
                };

                const response =
                    await fetch(
                        `${API_URL}/api/movimientos/${movimientoEditandoId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    movimientoActualizado
                                )
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "No se pudo actualizar el movimiento."
                    );

                    return;
                }

                alert(
                    "Movimiento actualizado correctamente."
                );

                cancelarEdicion();

                cargarMovimientos();

                return;

            } catch (error) {

                console.error(
                    "Error al actualizar movimiento:",
                    error
                );

                alert(
                    "No se pudo conectar con el servidor."
                );

                return;
            }
        }

        // BUILDER

        const builder =
            new MovimientoBuilder()
                .setTipo(type)
                .setDescripcion(description)
                .setCantidad(amount)
                .setMoneda(currency)
                .setFecha(date)
                .setUsuario(userName);

        if (
            type === "expense"
        ) {

            builder.setCategoria(
                selectedCategory
            );

        } else {

            builder.setCategoria(
                null
            );
        }

        const movimiento =
            builder.build();

        console.log(
            "Movimiento creado con Builder:",
            movimiento
        );

        // STRATEGY

        let strategy;

        if (
            movimiento.tipo ===
            "income"
        ) {

            strategy =
                new IngresoStrategy();

        } else if (
            movimiento.tipo ===
            "expense"
        ) {

            strategy =
                new GastoStrategy();

        } else if (
            movimiento.tipo ===
            "saving"
        ) {

            strategy =
                new AhorroStrategy();
        }

        console.log(
            "Estrategia utilizada:",
            strategy
        );

        // GUARDAR EN BACKEND

        try {

            const response =
                await fetch(
                    `${API_URL}/api/movimientos`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                movimiento
                            )
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "No se pudo guardar el movimiento."
                );

                return;
            }

            const simbolo =
                obtenerSimboloMoneda(
                    movimiento.moneda
                );

            const tipoTexto =
                movimiento.tipo ===
                "income"
                    ? "Ingreso"
                    : movimiento.tipo ===
                    "expense"
                        ? "Gasto"
                        : "Ahorro";

            const signo =
                movimiento.tipo ===
                "income"
                    ? "+"
                    : "-";

            alert(
                "Movimiento guardado correctamente.\n\n" +
                `${tipoTexto}: ` +
                `${signo}${formatearCantidad(
                    movimiento.cantidad
                )} ${simbolo}`
            );

            movementForm.reset();

            categoryGroup.style.display =
                "none";

            category.required =
                false;

            cargarMovimientos();

        } catch (error) {

            console.error(
                "Error al guardar movimiento:",
                error
            );

            alert(
                "No se pudo conectar con el servidor."
            );
        }
    }
);

// CARGAR DATOS AL ABRIR

cargarMovimientos();