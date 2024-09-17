import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimientoInventario } from '../models/movimiento-inventario';
import {Venta} from "../models/venta";

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private base_url = environment.apiUrlBase+'reportes/'

  http= inject(HttpClient);

  constructor() { }

  movimientosDia():Observable<MovimientoInventario[]>{
    return this.http.get<MovimientoInventario[]>(`${this.base_url}lista-movimientos`)
  }

  movimientosEntreFechas(fechaInicio:string, fechaFin:string):Observable<MovimientoInventario[]>{
    const params = {
      params: {fechaInicial:fechaInicio, fechaFin:fechaFin}
    }
    return this.http.get<MovimientoInventario[]>(`${this.base_url}lista-movimientos-fechas`,params)
  }

  ventasDia():Observable<Venta[]>{
    return this.http.get<Venta[]>(`${this.base_url}ventas-actuales`)
  }

  ventasEntreFecha(fechaInicio:string, fechaFin:string):Observable<Venta[]>{
    const params = {
      params: {fechaInicial:fechaInicio, fechaFin:fechaFin}
    }
    return this.http.get<Venta[]>(`${this.base_url}ventas`,params)
  }
}
