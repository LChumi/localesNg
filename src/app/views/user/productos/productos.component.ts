import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './productos.component.html',
  styles: ``
})
export default class ProductosComponent {
  producto!: Producto;
  cantidad: number = 0;
  proveedor: string = '';
  mostrarModal: boolean = false;
  barra:  string =''
  nombre: string=''
  vista=false

  http = inject(HttpClient)
  productoService = inject(ProductoService)
name: any;

  constructor() {}

  buscarProductoPorNombre(): void {
    this.productoService.porNombre(this.nombre).subscribe(
      producto => {
        this.producto = producto
        console.log(producto)
      }
    )
  }

  buscarProductoPorCodigo(codigo: string): void {
    this.productoService.porBarra(codigo).subscribe(
      producto => {
        this.producto=producto
      }
    )
  }

  agregarProducto(): void {
    
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
