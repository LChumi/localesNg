import { Bodega } from "./bodega";
import { Producto } from "./producto";
import { Proveedor } from "./proveedor";

export interface EntradaInventario {
    id:        number;
    producto:  Producto;
    bodega:    Bodega;
    proveedor: Proveedor;
    cantidad:  number;
    fecha:     Date;
}