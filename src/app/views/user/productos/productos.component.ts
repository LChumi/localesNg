import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto.service';
import {Proveedor} from "../../../core/models/proveedor";
import {ProveedorService} from "../../../core/services/proveedor.service";
import {ModalConfirmacionYnComponent} from "../../../components/modal-confirmacion-yn/modal-confirmacion-yn.component";
import {BodegaService} from "../../../core/services/bodega.service";
import {Bodega} from "../../../core/models/bodega";

@Component({
  standalone: true,
  imports: [FormsModule,CommonModule,ModalConfirmacionYnComponent],
  templateUrl: './productos.component.html',
  styles: ``
})
export default class ProductosComponent implements OnInit{

  http =              inject(HttpClient)
  productoService =   inject(ProductoService)
  proveedorService =  inject(ProveedorService)
  bodegaService=      inject(BodegaService);

  producto?:        Producto;
  bodega?:          Bodega;
  listaProveedores: Proveedor[] =[];

  cantidad:     number = 0;
  barra:        string =''
  nombre:       string=''
  titulo:       string='Producto no encontrado desea agregarlo'
  nombreBodega?: string

  mostrarModal:      boolean = false;
  modalConfirmacion: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.listarProveedores()
    this.bodegaSelected()
  }

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

  bodegaSelected(){
    const bodegaId = sessionStorage.getItem('bodegaId');
    if (bodegaId){
      this.bodegaService.porId(Number(bodegaId)).subscribe(
        bod => {
          this.bodega=bod;
          this.nombreBodega=bod.nombre
        }
      )
    }
  }

  respuestaConfirmacion(confirmado: boolean){
    this.mostrarModal= false;
    if (confirmado){
      this.mostrarModal=true;
      this.modalConfirmacion=false;
    } else {
      this.modalConfirmacion=false;
    }
  }

  formatInput() {
    if (this.cantidad !== null && this.cantidad !== undefined) {
      // Limitar a 2 decimales
      this.cantidad = parseFloat(this.cantidad.toFixed(2));
      console.log(this.cantidad)
    }
  }

}
