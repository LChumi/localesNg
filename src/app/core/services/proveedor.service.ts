import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from '../models/proveedor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private base_url = environment.apiUrlBase+'proveedor/'

  http=inject(HttpClient);

  constructor() { }

  crear(proveedor:Proveedor):Observable<Proveedor>{
    return this.http.post<Proveedor>(`${this.base_url}crear`,proveedor)
  }

  porId(id:number):Observable<Proveedor>{
    return this.http.get<Proveedor>(`${this.base_url}porId/${id}`)
  }

  listar():Observable<Proveedor[]>{
    return this.http.get<Proveedor[]>(`${this.base_url}listar`)
  }

  actualizar(id:number,proveedor:Proveedor):Observable<Proveedor>{
    return this.http.put<Proveedor>(`${this.base_url}actualizar/${id}`,proveedor)
  }

  eliminar(id:number):Observable<Proveedor>{
    return this.http.delete<Proveedor>(`${this.base_url}eliminar/${id}`)
  }
}
