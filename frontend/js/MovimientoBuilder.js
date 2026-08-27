class MovimientoBuilder {

    constructor() {

        this.movimiento = {};

    }

    setTipo(tipo) {

        this.movimiento.tipo = tipo;
        return this;

    }

    setDescripcion(descripcion) {

        this.movimiento.descripcion = descripcion;
        return this;

    }

    setCantidad(cantidad) {

        this.movimiento.cantidad = cantidad;
        return this;

    }

    setMoneda(moneda) {

        this.movimiento.moneda = moneda;
        return this;

    }

    setCategoria(categoria) {

        this.movimiento.categoria = categoria;
        return this;

    }

    setFecha(fecha) {

        this.movimiento.fecha = fecha;
        return this;

    }

    setUsuario(usuario) {

        this.movimiento.usuario = usuario;
        return this;

    }

    build() {

        return this.movimiento;

    }

}