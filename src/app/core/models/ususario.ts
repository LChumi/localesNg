import { Bodega } from "./bodega";
import { Rol } from "./rol";

export interface Usuario {
    id:            number;
    nombre:        string;
    apellido:      string;
    telefono:      string;
    nombreUsuario: string;
    password:      string;
    rol:           Rol;
    bodegas:       Bodega[];
}

