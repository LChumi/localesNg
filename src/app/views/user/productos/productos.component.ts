import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto.service';
import {Proveedor} from "../../../core/models/proveedor";
import {ProveedorService} from "../../../core/services/proveedor.service";
import {ModalConfirmacionYnComponent} from "../../../components/modal-confirmacion-yn/modal-confirmacion-yn.component";

@Component({
  standalone: true,
  imports: [FormsModule,CommonModule,ModalConfirmacionYnComponent],
  templateUrl: './productos.component.html',
  styles: ``
})
export default class ProductosComponent implements OnInit{
  producto?:    Producto;
  listaProveedores: Proveedor[] =[];

  cantidad:     number = 0;
  barra:        string =''
  nombre:       string=''
  titulo:       string='Producto no encontrado'

  mostrarModal:      boolean = false;
  modalConfirmacion: boolean = false;

  http = inject(HttpClient)
  productoService = inject(ProductoService)
  proveedorService = inject(ProveedorService)
  name: any;

  constructor() {}

  buscarProductoPorNombre(): void {
    this.productoService.porNombre(this.nombre).subscribe(
      producto => {
        this.producto = producto
      },
      error => {
        this.modalConfirmacion=true
        this.producto = undefined
      }
    )
  }

  buscarProductoPorCodigo(): void {
    this.productoService.porBarra(this.barra).subscribe(
      producto => {
        this.producto=producto
      },
      error => {
        this.modalConfirmacion=true
        this.producto = undefined
      }
    )
  }

  agregarProducto(): void {
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  listarProveedores(){
    this.proveedorService.listar().subscribe(
      proveedores => {
        this.listaProveedores = proveedores
      },
      error => {
        this.listaProveedores = [];
      }
    )
  }

  ngOnInit(): void {
    this.listarProveedores()
  }

  respuestaConfirmacion(confirmado: boolean){
    this.mostrarModal= false;
    if (confirmado){
      console.log('Si')
    } else {
      this.modalConfirmacion=false;
    }
  }
}
