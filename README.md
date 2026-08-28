# Gestor de Gastos

Aplicación web para gestionar ingresos, gastos y ahorros de manera sencilla. El proyecto fue desarrollado como actividad práctica de la asignatura de Patrones de Diseño, aplicando los patrones **Builder** y **Strategy**.

## 1. Descripción del proyecto

El objetivo de la aplicación es permitir que un usuario registre y consulte sus movimientos financieros, diferenciando entre ingresos, gastos y ahorros.

La aplicación permite:

* Crear una cuenta.
* Iniciar sesión.
* Registrar ingresos.
* Registrar gastos.
* Registrar ahorros.
* Editar movimientos.
* Eliminar movimientos.
* Consultar el resumen financiero.
* Seleccionar una moneda principal.
* Mantener la información almacenada de forma persistente.

El proyecto está dividido en un **frontend** y un **backend**, con una estructura modular que facilita su mantenimiento y futuras ampliaciones.

La persistencia de los datos se realiza mediante una base de datos **PostgreSQL**.

---

## 2. Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript
* Node.js
* Express
* PostgreSQL
* `pg` para la conexión con PostgreSQL
* bcrypt para el manejo seguro de contraseñas mediante hash
* JSON Web Token (JWT) para la autenticación
* Git y GitHub para el control de versiones
* Render para el despliegue de la aplicación y la base de datos

---

## 3. Estructura del proyecto

```text
gestor-de-gastos/
├── backend/
│   ├── database/
│   │   ├── db.js
│   │   └── init.js
│   │
│   ├── routes/
│   │   ├── login.js
│   │   ├── movimientos.js
│   │   └── users.js
│   │
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   │
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
│   │
│   ├── pages/
│   │   ├── login.html
│   │   └── registro.html
│   │
│   ├── dashboard.html
│   └── index.html
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 4. Patrones de diseño aplicados

### Builder

Se utiliza el patrón **Builder** mediante la clase `MovimientoBuilder`.

Los movimientos tienen diferentes atributos, como tipo, descripción, cantidad, moneda, categoría, fecha y usuario.

Builder permite construir el objeto de manera progresiva mediante métodos como:

* `setTipo()`
* `setDescripcion()`
* `setCantidad()`
* `setMoneda()`
* `setCategoria()`
* `setFecha()`
* `setUsuario()`
* `build()`

### ¿Por qué se eligió Builder?

Se eligió porque la creación de un movimiento puede tener varios atributos. Construirlo paso a paso hace que el código sea más claro y evita concentrar todos los datos en una única llamada de creación.

### Proyección futura

Si en el futuro se agregan atributos como método de pago, etiquetas, notas u otros datos, estos pueden incorporarse al Builder sin modificar de forma importante el código que utiliza los movimientos.

---

### Strategy

Se utiliza el patrón **Strategy** para separar el comportamiento asociado a los diferentes tipos de movimientos.

La aplicación cuenta con:

* `MovimientoStrategy`
* `IngresoStrategy`
* `GastoStrategy`
* `AhorroStrategy`

Cada estrategia implementa el método `procesar()` de acuerdo con el comportamiento que corresponde al tipo de movimiento.

* Un ingreso aumenta el saldo.
* Un gasto disminuye el saldo.
* Un ahorro disminuye el saldo disponible y representa el valor destinado al ahorro.

### ¿Por qué se eligió Strategy?

Se eligió porque cada tipo de movimiento tiene una forma diferente de afectar el saldo.

Separar estos comportamientos permite evitar que toda la lógica quede concentrada en una sola estructura de condiciones y facilita el mantenimiento del código.

### Proyección futura

Si se necesitan nuevos tipos de movimientos o nuevas formas de calcular el saldo, se pueden crear nuevas estrategias sin modificar significativamente las estrategias existentes.

Por ejemplo, podrían agregarse estrategias para:

* Transferencias.
* Inversiones.
* Pagos.
* Otros movimientos financieros.

---

## 5. Funcionalidades principales

La aplicación permite:

* Registro de usuarios.
* Inicio de sesión.
* Autenticación mediante JWT.
* Gestión de usuarios.
* Selección de moneda principal.
* Gestión de movimientos.
* Registro de ingresos.
* Registro de gastos.
* Registro de ahorros.
* Edición de movimientos.
* Eliminación de movimientos.
* Consulta del resumen financiero.
* Persistencia de información mediante PostgreSQL.
* Separación de responsabilidades entre frontend y backend.

---

## 6. Backend

El backend está desarrollado con **Node.js** y **Express**.

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

El backend utiliza PostgreSQL para almacenar la información de los usuarios y movimientos.

La conexión con la base de datos se encuentra en:

```text
backend/database/db.js
```

La conexión utiliza la variable de entorno:

```text
DATABASE_URL
```

Esta variable contiene la cadena de conexión necesaria para conectar el backend con PostgreSQL.

---

## 7. Base de datos

La aplicación utiliza **PostgreSQL** como sistema de gestión de base de datos.

La base de datos contiene principalmente las siguientes tablas:

### Tabla `usuarios`

Almacena la información de los usuarios registrados.

Sus principales campos son:

```text
id
nombre
correo
password
moneda
```

La contraseña no se almacena directamente. Antes de guardarse se procesa mediante `bcrypt`, generando un hash.

### Tabla `movimientos`

Almacena los movimientos financieros registrados por los usuarios.

Sus principales campos son:

```text
id
usuario_id
tipo
descripcion
cantidad
moneda
categoria
fecha
```

El campo `usuario_id` relaciona cada movimiento con el usuario correspondiente mediante una clave foránea.

Esto permite identificar qué movimientos pertenecen a cada usuario.

---

## 8. Inicialización de la base de datos

El archivo:

```text
backend/database/init.js
```

contiene las instrucciones necesarias para crear las tablas utilizadas por la aplicación.

Las tablas se crean utilizando:

```sql
CREATE TABLE IF NOT EXISTS
```

De esta manera, el proceso evita intentar crear nuevamente una tabla que ya existe.

Para ejecutar la inicialización de manera local se utiliza:

```bash
node backend/database/init.js
```

La conexión necesita que la variable `DATABASE_URL` esté configurada correctamente.

---

## 9. Persistencia de datos

La información de la aplicación se almacena actualmente en **PostgreSQL**.

Los usuarios se almacenan en la tabla:

```text
usuarios
```

y los movimientos financieros en:

```text
movimientos
```

La aplicación utiliza el paquete `pg` para realizar la conexión entre Node.js y PostgreSQL.

Los datos permanecen almacenados en la base de datos después de cerrar sesión, reiniciar el servidor o volver a acceder a la aplicación.

La aplicación ya no utiliza archivos JSON como mecanismo de persistencia.

---

## 10. Seguridad

El proyecto utiliza diferentes mecanismos básicos de seguridad.

### Contraseñas

Las contraseñas se procesan mediante `bcrypt` antes de almacenarse.

Esto evita guardar las contraseñas en texto plano.

### Autenticación

La aplicación utiliza **JSON Web Token (JWT)** para generar tokens de autenticación después de iniciar sesión correctamente.

### Variables de entorno

La conexión con PostgreSQL utiliza:

```text
DATABASE_URL
```

Esta información no se escribe directamente dentro del código fuente.

En el entorno desplegado, la variable se configura mediante las variables de entorno de Render.

---

## 11. Arquitectura general

La aplicación utiliza una separación básica entre diferentes responsabilidades.

### Frontend

Se encarga de:

* Interfaz de usuario.
* Formularios.
* Interacciones.
* Visualización de movimientos.
* Comunicación con el backend.

### Backend

Se encarga de:

* API.
* Gestión de usuarios.
* Inicio de sesión.
* Autenticación.
* Validación de información.
* Gestión de movimientos.
* Comunicación con PostgreSQL.

### Base de datos

PostgreSQL se encarga de:

* Almacenar usuarios.
* Almacenar movimientos.
* Mantener las relaciones entre usuarios y movimientos.
* Conservar la información de forma persistente.

### Patrones de diseño

Los patrones Builder y Strategy permiten organizar la creación y el procesamiento de los movimientos.

---

## 12. Requisitos para ejecutar el proyecto

Para ejecutar el proyecto localmente se necesita tener instalado:

* Node.js
* npm
* PostgreSQL

También es necesario configurar la variable de entorno:

```text
DATABASE_URL
```

con la cadena de conexión correspondiente a la base de datos.

---

## 13. Instalación y ejecución

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

### Paso 4. Configurar la base de datos

Crear una base de datos PostgreSQL y configurar la variable de entorno:

```text
DATABASE_URL
```

con la cadena de conexión correspondiente.

### Paso 5. Crear las tablas

Ejecutar:

```bash
node backend/database/init.js
```

### Paso 6. Iniciar el servidor

Ejecutar:

```bash
node backend/server.js
```

El servidor se ejecutará en:

```text
http://localhost:3000
```

La aplicación frontend es servida directamente por Express.

---

## 14. Despliegue

El proyecto cuenta con una versión desplegada en **Render** para realizar pruebas y demostración.

La aplicación utiliza un servicio web de Render y una base de datos PostgreSQL.

### Aplicación

https://gestor-de-gastos-h2fl.onrender.com

### Base de datos

La aplicación utiliza una base de datos PostgreSQL denominada:

```text
gestor-gastos-db
```

La conexión entre el backend y PostgreSQL se realiza mediante la variable de entorno:

```text
DATABASE_URL
```

configurada en Render.

---

## 15. Verificación de la persistencia

Durante las pruebas del proyecto se verificó directamente que la información está llegando correctamente a PostgreSQL.

La consulta:

```sql
SELECT * FROM usuarios;
```

permite comprobar los usuarios registrados.

La consulta:

```sql
SELECT * FROM movimientos;
```

permite comprobar los movimientos registrados.

Durante las pruebas se verificaron registros como:

```text
Sueldo — 330.00 EUR
```

y:

```text
Papeles — 150.08 EUR
```

Los movimientos aparecen asociados a los usuarios mediante el campo `usuario_id`.

Esto permite comprobar que la información está siendo almacenada en PostgreSQL y no únicamente en el navegador o en archivos locales.

---

## 16. Repositorio

El código fuente del proyecto está disponible públicamente en GitHub:

https://github.com/dahianaospigallo9-maker/gestor-de-gastos

---

## 17. Mejoras futuras

Entre las posibles mejoras se encuentran:

* Implementar autorización de movimientos directamente en el backend.
* Mejorar la protección de las rutas mediante JWT.
* Agregar nuevos tipos de movimientos mediante nuevas estrategias.
* Incorporar más categorías y filtros.
* Agregar reportes y gráficos financieros.
* Mejorar las pruebas automatizadas.
* Implementar recuperación y cambio de contraseña.
* Mejorar la gestión de errores y validaciones.
* Implementar mecanismos de respaldo para la base de datos.
* Mejorar la configuración y gestión de variables de entorno.
* Incorporar nuevas funcionalidades para el análisis financiero.

---

## 18. Objetivo académico

Este proyecto tiene como finalidad demostrar la aplicación práctica de patrones de diseño dentro de una aplicación de software funcional.

Los patrones **Builder** y **Strategy** fueron seleccionados porque permiten resolver problemas concretos relacionados con la creación y el procesamiento de los movimientos financieros.

Builder facilita la construcción de los objetos de movimiento mediante diferentes atributos, mientras que Strategy permite separar el comportamiento de acuerdo con el tipo de movimiento.

Además, el proyecto permite aplicar conceptos relacionados con:

* Desarrollo frontend.
* Desarrollo backend.
* APIs REST.
* Autenticación.
* Manejo seguro de contraseñas.
* Bases de datos relacionales.
* Persistencia de información.
* Variables de entorno.
* Despliegue de aplicaciones web.
* Organización modular del código.

De esta manera, el proyecto integra los conceptos estudiados durante la asignatura con una aplicación funcional de gestión de gastos.

