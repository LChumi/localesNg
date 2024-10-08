import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntradaInventario } from '../models/entrada-inventario';

@Injectable({
  providedIn: 'root'
})
export class EntradaInventarioService {
  private base_url = environment.apiUrlBase+'inventario/'

  http=inject(HttpClient);

  constructor() { }

  agregarProducto(entradaInventario: EntradaInventario):Observable<any>{
    return this.http.post<any>(`${this.base_url}agregar-producto`,entradaInventario, {responseType: 'text' as 'json'})
  }

  incrementarStock(productoId: number, bodegaId: number, cantidad: number, usuarioId: number):Observable<string>{
    return this.http.get<string>(`${this.base_url}incrementar-stock/${productoId}/${bodegaId}/${cantidad}/${usuarioId}`, {responseType: 'text' as 'json'})
  }

  reducirStock(productoId:number,bodegaId:number,cantidad:number, usuarioId: number):Observable<any>{
    return this.http.delete<any>(`${this.base_url}reducir-stock/${productoId}/${bodegaId}/${cantidad}`)
  }

  transferir(productoId:number,bodegaOrigenId:number,bodegaDestinoId:number,cantidad:number):Observable<any>{
    return this.http.get<any>(`${this.base_url}transferir/${productoId}/${bodegaOrigenId}/${bodegaDestinoId}/${cantidad}`)
  }

}
