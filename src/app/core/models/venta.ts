import { Cliente } from "./cliente";
import { Usuario } from "./ususario";

export interface Venta {
    id:        number;
    fecha:     Date;
    cliente:   Cliente;
    total:     number;
    formaPago: string;
    usuario:   Usuario;
}

