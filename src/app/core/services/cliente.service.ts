import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private base_url = environment.apiUrlBase+'cliente/'

  http=inject(HttpClient);

  constructor() { }

  crear(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(`${this.base_url}crear`,cliente)
  }

  porId(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.base_url}porId/${id}`)
  }

  listar():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${this.base_url}listar`)
  }

  actualizar(id:number,cliente:Cliente):Observable<Cliente>{
    return this.http.put<Cliente>(`${this.base_url}actualizar/${id}`,cliente)
  }

  eliminar(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.base_url}eliminar/${id}`)
  }
}
