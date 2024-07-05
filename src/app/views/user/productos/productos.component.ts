import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styles: ``
})
export default class ProductosComponent {
  producto: any = null;
  cantidad: number = 0;
  proveedor: string = '';
  mostrarModal: boolean = false;

  constructor(private http: HttpClient) {}

  buscarProductoPorNombre(nombre: string): void {
    this.http.get<any>(`/api/productos?nombre=${nombre}`).subscribe(
      (data) => {
        if (data) {
          this.producto = data;
        } else {
          alert('Producto no encontrado');
        }
      },
      (error) => {
        console.error(error);
        alert('Error al buscar producto');
      }
    );
  }

  buscarProductoPorCodigo(codigo: string): void {
    this.http.get<any>(`/api/productos?codigoBarras=${codigo}`).subscribe(
      (data) => {
        if (data) {
          this.producto = data;
        } else {
          alert('Producto no encontrado');
        }
      },
      (error) => {
        console.error(error);
        alert('Error al buscar producto');
      }
    );
  }

  agregarProducto(): void {
    if (this.producto) {
      const productoData = {
        ...this.producto,
        cantidad: this.cantidad,
        proveedor: this.proveedor
      };

      this.http.post<any>('/api/productos', productoData).subscribe(
        (response) => {
          alert('Producto agregado con éxito');
          this.producto = null;
          this.cantidad = 0;
          this.proveedor = '';
        },
        (error) => {
          console.error(error);
          alert('Error al agregar producto');
        }
      );
    } else {
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
