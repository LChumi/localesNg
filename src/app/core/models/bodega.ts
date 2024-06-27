import { Almacen } from "./almacen";

export interface Bodega {
    id:      number;
    nombre:  string;
    almacen: Almacen;
}
