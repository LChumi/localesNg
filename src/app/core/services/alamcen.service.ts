import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Almacen } from '../models/almacen';

@Injectable({
  providedIn: 'root'
})
export class AlamcenService {

  private base_url = environment.apiUrlBase+'almacen/'

  http=inject(HttpClient);

  constructor() { }

  crear(almacen:Almacen):Observable<Almacen>{
    return this.http.post<Almacen>(`${this.base_url}crear`,almacen)
  }

  listar():Observable<Almacen[]>{
    return this.http.get<Almacen[]>(`${this.base_url}listar`)
  }

  porId(id:number):Observable<Almacen>{
    return this.http.get<Almacen>(`${this.base_url}porId/${id}`)
  }

  actualizar(id:number,almacen:Almacen):Observable<Almacen>{
    return this.http.put<Almacen>(`${this.base_url}actualizar/${id}`,almacen)
  }

  eliminar(id:number):Observable<Almacen>{
    return this.http.delete<Almacen>(`${this.base_url}eliminar/${id}`)
  }

}
