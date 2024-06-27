import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/ususario';
import { Bodega } from '../models/bodega';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private base_url = environment.apiUrlBase+'usuario/'

  http=inject(HttpClient);

  constructor() { }

  crear(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(`${this.base_url}crear`,usuario)
  }

  porId(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.base_url}porId/${id}`)
  }

  listar():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.base_url}listar`)
  }

  actualizar(id:number,usuario:Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(`${this.base_url}actualizar/${id}`,usuario)
  }

  eliminar(id:number):Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.base_url}eliminar/${id}`)
  }

  listaBodegas(usuarioId:number):Observable<Bodega[]>{
    return this.http.get<Bodega[]>(`${this.base_url}listaBodegas/${usuarioId}`)
  }

  agregarAlmacen(usuarioId:number,almacenId:number):Observable<any>{
    return this.http.post<any>(`${this.base_url}agregar-almacen/${usuarioId}/${almacenId}`,{})
  }

  eliminarAlmacen(usuarioId:number,almacenId:number):Observable<any>{
    return this.http.delete<any>(`${this.base_url}eliminar-almacen/${usuarioId}/${almacenId}`)
  }


}
