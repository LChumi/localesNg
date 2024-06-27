import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../models/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private base_url = environment.apiUrlBase+'rol/'

  http=inject(HttpClient);

  constructor() { }

  crear(rol:Rol):Observable<Rol>{
    return this.http.post<Rol>(`${this.base_url}crear`,rol)
  }

  porId(id:number):Observable<Rol>{
    return this.http.get<Rol>(`${this.base_url}porId/${id}`)
  }

  listar():Observable<Rol[]>{
    return this.http.get<Rol[]>(`${this.base_url}listar`)
  }

  actualizar(id:number,rol:Rol):Observable<Rol>{
    return this.http.put<Rol>(`${this.base_url}actualizar/${id}`,rol)
  }

  eliminar(id:number):Observable<Rol>{
    return this.http.delete<Rol>(`${this.base_url}eliminar/${id}`)
  }
}
