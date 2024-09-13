import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Venta} from "../models/venta";
import {Observable} from "rxjs";
import {DetalleVenta} from "../models/detalle-venta";
import {Cliente} from "../models/cliente";

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private base_url = environment.apiUrlBase+'venta/'

  http=inject(HttpClient);

  constructor() { }

  crearVenta(venta: Venta):Observable<Venta>{
    return this.http.post<Venta>(`${this.base_url}crear-venta`, venta)
  }

  actualizarVenta (venta: Venta, id:number):Observable<Venta>{
    return this.http.put<Venta>(`${this.base_url}modificar-venta/${id}`,venta)
  }

  agregarDetalle(idVenta:number, detalle: DetalleVenta, tipoPrecio:number):Observable<DetalleVenta>{
    return this.http.post<DetalleVenta>(`${this.base_url}${idVenta}/${tipoPrecio}/detalles-add`, detalle)
  }

  eliminarDetalle(idVenta:number, idDetalle:number){
    return this.http.delete(`${this.base_url}${idVenta}/detalles-del/${idDetalle}`)
  }

  actualizarDetalle(idVenta:number, idDetalle:number, tipoPrecio:number, detalleV:DetalleVenta):Observable<DetalleVenta>{
    return this.http.put<DetalleVenta>(`${this.base_url}${idVenta}/detalles-put/${idDetalle}/${tipoPrecio}`,detalleV)
  }

  procesarPago(ventaId: number, montoCredito: number, montoEfectivo: number, montoTarjeta: number): Observable<Venta> {
    const params = new HttpParams()
      .set('montoCredito', montoCredito.toString())
      .set('montoEfectivo', montoEfectivo.toString())
      .set('montoTarjeta', montoTarjeta.toString());

    return this.http.post<Venta>(`${this.base_url}${ventaId}/procesar-pago`, null, { params });
  }

  pagarCredito(clienteId: number, monto: number): Observable<Cliente> {
    const params = new HttpParams().set('monto', monto.toString());

    return this.http.post<Cliente>(`${this.base_url}${clienteId}/pagar-credito`, null, { params });
  }

  listar(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.base_url}listar`);
  }

  listarPendientes(usuarioId: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.base_url}listar-pendientes/${usuarioId}`);
  }

}
