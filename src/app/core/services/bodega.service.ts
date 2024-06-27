import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Bodega } from '../models/bodega';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {

  private base_url = environment.apiUrlBase+'bodega/'

  http=inject(HttpClient);

  constructor() { }

  crear(bodega:Bodega):Observable<Bodega>{
    return this.http.post<Bodega>(`${this.base_url}crear`,bodega)
  }

  porId(id:number):Observable<Bodega>{
    return this.http.get<Bodega>(`${this.base_url}porId/${id}`)
  }

  listar():Observable<Bodega[]>{
    return this.http.get<Bodega[]>(`${this.base_url}listar`)
  }

  actualizar(id:number,bodega:Bodega):Observable<Bodega>{
    return this.http.put<Bodega>(`${this.base_url}actualizar/${id}`,bodega)
  }

  eliminar(id:number):Observable<Bodega>{
    return this.http.delete<Bodega>(`${this.base_url}eliminar/${id}`)
  }

}
