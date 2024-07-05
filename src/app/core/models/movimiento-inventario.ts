import { Bodega } from "./bodega";
import { Producto } from "./producto";
import { Usuario } from "./ususario";

export interface MovimientoInventario {
    id:       number;
    producto: Producto;
    bodega:   Bodega;
    cantidad: number;
    tipo:     string;
    fecha:    Date;
    usuario:  Usuario;
}

