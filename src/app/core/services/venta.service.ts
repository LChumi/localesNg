import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Venta} from "../models/venta";

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private base_url = environment.apiUrlBase+'venta/'

  http=inject(HttpClient);

  constructor() { }

  crearVenta(venta: Venta){
    return this.http.post<Venta>(`${this.base_url}`, venta)
  }

}
