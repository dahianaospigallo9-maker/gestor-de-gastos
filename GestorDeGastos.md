# Gestor de Gastos

Aplicación web para gestionar ingresos, gastos y ahorros de manera sencilla. El proyecto fue desarrollado como actividad práctica de la asignatura de Patrones de Diseño, aplicando los patrones **Builder** y **Strategy**.

## 1. Descripción del proyecto

El objetivo de la aplicación es permitir que un usuario registre y consulte sus movimientos financieros, diferenciando entre ingresos, gastos y ahorros. La aplicación permite crear, editar y eliminar movimientos, consultar el resumen financiero y conservar los cambios realizados.

El proyecto está dividido en un **frontend** y un **backend**, con una estructura modular que facilita su mantenimiento y futuras ampliaciones.

## 2. Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- JSON para persistencia de datos
- bcrypt para el manejo seguro de contraseñas mediante hash
- JSON Web Token (JWT) para la autenticación

## 3. Estructura del proyecto

```text
gestor-de-gastos/
├── backend/
│   ├── data/
│   │   ├── movimientos.json
│   │   └── users.json
│   ├── routes/
│   │   ├── login.js
│   │   ├── movimientos.js
│   │   └── users.js
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── AhorroStrategy.js
│   │   ├── dashboard.js
│   │   ├── GastoStrategy.js
│   │   ├── IngresoStrategy.js
│   │   ├── login.js
│   │   ├── main.js
│   │   ├── MovimientoBuilder.js
│   │   ├── MovimientoStrategy.js
│   │   └── registro.js
│   ├── pages/
│   │   ├── login.html
│   │   └── registro.html
│   ├── dashboard.html
│   └── index.html
│
├── package.json
├── package-lock.json
└── README.md
```

## 4. Patrones de diseño aplicados

### Builder

Se utiliza el patrón **Builder** mediante la clase `MovimientoBuilder`.

Los movimientos tienen diferentes atributos, como tipo, descripción, cantidad, moneda, categoría, fecha y usuario. Builder permite construir el objeto de manera progresiva mediante métodos como:

- `setTipo()`
- `setDescripcion()`
- `setCantidad()`
- `setMoneda()`
- `setCategoria()`
- `setFecha()`
- `setUsuario()`
- `build()`

### ¿Por qué se eligió Builder?

Se eligió porque la creación de un movimiento puede tener varios atributos. Construirlo paso a paso hace que el código sea más claro y evita concentrar todos los datos en una única llamada de creación.

### Proyección futura

Si en el futuro se agregan atributos como método de pago, etiquetas, notas u otros datos, estos pueden incorporarse al Builder sin modificar de forma importante el código que utiliza los movimientos.

---

### Strategy

Se utiliza el patrón **Strategy** para separar el comportamiento asociado a los diferentes tipos de movimientos.

La aplicación cuenta con:

- `MovimientoStrategy`
- `IngresoStrategy`
- `GastoStrategy`
- `AhorroStrategy`

Cada estrategia implementa el método `procesar()` de acuerdo con el comportamiento que corresponde al tipo de movimiento.

- Un ingreso aumenta el saldo.
- Un gasto disminuye el saldo.
- Un ahorro disminuye el saldo disponible y representa el valor destinado al ahorro.

### ¿Por qué se eligió Strategy?

Se eligió porque cada tipo de movimiento tiene una forma diferente de afectar el saldo. Separar estos comportamientos permite evitar que toda la lógica quede concentrada en una sola estructura de condiciones y facilita el mantenimiento del código.

### Proyección futura

Si se necesitan nuevos tipos de movimientos o nuevas formas de calcular el saldo, se pueden crear nuevas estrategias sin modificar significativamente las estrategias existentes. Por ejemplo, podrían agregarse estrategias para transferencias, inversiones u otros movimientos financieros.

## 5. Funcionalidades principales

- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Gestión de movimientos.
- Registro de ingresos.
- Registro de gastos.
- Registro de ahorros.
- Edición de movimientos.
- Eliminación de movimientos.
- Consulta del resumen financiero.
- Persistencia de la información.
- Separación de responsabilidades entre frontend y backend.

## 6. Backend

El backend está desarrollado con Node.js y Express.

El archivo principal es:

```text
backend/server.js
```

El servidor expone las rutas relacionadas con:

```text
/api/users
/api/login
/api/movimientos
```

Los datos se almacenan actualmente en archivos JSON dentro de:

```text
backend/data/
```

Esta solución es adecuada para el alcance académico del proyecto y podría reemplazarse posteriormente por una base de datos.

## 7. Requisitos para ejecutar el proyecto

Se necesita tener instalado:

- Node.js
- npm

## 8. Instalación y ejecución

### Paso 1. Clonar el repositorio

```bash
git clone https://github.com/dahianaospigallo9-maker/gestor-de-gastos.git
```

### Paso 2. Entrar en la carpeta

```bash
cd gestor-de-gastos
```

### Paso 3. Instalar las dependencias

```bash
npm install
```

### Paso 4. Iniciar el servidor

```bash
node backend/server.js
```

El servidor se ejecutará en:

```text
http://localhost:3000
```

La aplicación frontend es servida directamente por Express.

## 9. Persistencia de datos

La información de usuarios y movimientos se almacena en archivos JSON:

```text
backend/data/users.json
backend/data/movimientos.json
```

Los cambios realizados sobre los movimientos se guardan en el backend, por lo que pueden mantenerse después de cerrar sesión y volver a iniciar sesión.

## 10. Arquitectura general

La aplicación utiliza una separación básica entre:

- **Frontend:** interfaz y experiencia del usuario.
- **Backend:** API, autenticación y gestión de datos.
- **Patrones de diseño:** organización de la creación y procesamiento de movimientos.

Esta estructura facilita que el proyecto pueda crecer posteriormente incorporando una base de datos, nuevos tipos de movimientos, nuevas reglas de cálculo o funcionalidades adicionales.

## 11. Despliegue

El proyecto cuenta con una versión desplegada para realizar pruebas y demostración.

**Enlace de la aplicación:** https://gestor-de-gastos-h2fl.onrender.com


## 12\. Repositorio

El código fuente está disponible públicamente en GitHub:

https://github.com/dahianaospigallo9-maker/gestor-de-gastos


## 13. Mejoras futuras

Entre las posibles mejoras se encuentran:

- Incorporar una base de datos.
- Implementar autorización de movimientos directamente en el backend.
- Agregar nuevos tipos de movimientos mediante nuevas estrategias.
- Incorporar más categorías y filtros.
- Agregar reportes y gráficos financieros.
- Mejorar las pruebas automatizadas.
- Incorporar variables de entorno para la configuración de datos sensibles.

## 14. Objetivo académico

Este proyecto tiene como finalidad demostrar la aplicación práctica de patrones de diseño dentro de una aplicación de software funcional. Builder y Strategy fueron seleccionados porque permiten resolver problemas concretos relacionados con la creación y el procesamiento de los movimientos financieros, además de facilitar el mantenimiento y la ampliación futura del sistema.
