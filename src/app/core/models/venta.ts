import { Cliente } from "./cliente";
import { Usuario } from "./ususario";
import {DetalleVenta} from "./detalle-venta";

export interface Venta {
    id:        number;
    fecha:     string;
    cliente:   Cliente;
    total:     number;
    formaPago: string;
    estado:    boolean;
    usuario:   Usuario;
    detalles: DetalleVenta[];
}

