import { Cliente } from "./cliente";
import { Usuario } from "./ususario";

export interface Venta {
    id:        number;
    fecha:     string;
    cliente:   Cliente;
    total:     number;
    formaPago: string;
    usuario:   Usuario;
}

