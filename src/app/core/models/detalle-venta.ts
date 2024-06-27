import { Bodega } from "./bodega";
import { Producto } from "./producto";
import { Venta } from "./venta";

export interface DetalleVenta {
    id:             number;
    venta:          Venta;
    producto:       Producto;
    bodega:         Bodega;
    cantidad:       number;
    precioUnitario: number;
    subtotal:       number;
    tipoPrecio:     number;
    precio:         number;
}
