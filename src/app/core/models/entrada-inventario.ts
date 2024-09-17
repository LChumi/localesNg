import { Bodega } from "./bodega";
import { Producto } from "./producto";
import { Proveedor } from "./proveedor";
import {Usuario} from "./ususario";

export interface EntradaInventario {
    id:        number;
    producto:  Producto;
    bodega:    Bodega;
    proveedor: Proveedor;
    cantidad:  number;
    fecha:     Date;
    usuario:   Usuario;
}
