import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';
import {ProductoAlmacen} from "../models/productoAlmacen";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private base_url = environment.apiUrlBase+'producto/'

  http=inject(HttpClient);

  constructor() { }

  crear(producto:Producto):Observable<Producto>{
    return this.http.post<Producto>(`${this.base_url}crear`,producto)
  }

  porId(id:number):Observable<Producto>{
    return this.http.get<Producto>(`${this.base_url}porId/${id}`)
  }

  listar():Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.base_url}listar`)
  }

  actualizar(id:number,producto:Producto):Observable<Producto>{
    return this.http.put<Producto>(`${this.base_url}actualizar/${id}`,producto)
  }

  eliminar(id:number):Observable<Producto>{
    return this.http.delete<Producto>(`${this.base_url}eliminar/${id}`)
  }

  porNombre(nombre:string):Observable<Producto>{
    return this.http.get<Producto>(`${this.base_url}porNombre/${nombre}`)
  }

  porBarra(barra:string):Observable<Producto>{
    return this.http.get<Producto>(`${this.base_url}porBarra/${barra}`)
  }

  porNombreOBarra(data:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.base_url}barra-desc/${data}`)
  }

  listarProductosAlmacen():Observable<ProductoAlmacen[]>{
    return this.http.get<ProductoAlmacen[]>(`${this.base_url}productos-almacen`)
  }

  eliminarInv(id:number):Observable<any>{
    return this.http.delete(`${this.base_url}eliminarInv/${id}`)
  }

}
