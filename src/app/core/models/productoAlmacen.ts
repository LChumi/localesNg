import {Producto} from "./producto";
import {Bodega} from "./bodega";

export interface ProductoAlmacen {
  id:       number;
  producto: Producto;
  bodega:   Bodega;
  stock:    number;
}
