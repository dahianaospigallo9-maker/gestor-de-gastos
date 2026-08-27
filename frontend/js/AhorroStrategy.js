class AhorroStrategy extends MovimientoStrategy {

    procesar(movimiento, saldoActual) {

        return saldoActual - Number(
            movimiento.cantidad
        );

    }

}