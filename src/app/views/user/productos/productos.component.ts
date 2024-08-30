import { CommonModule } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto.service';
import {Proveedor} from "../../../core/models/proveedor";
import {ProveedorService} from "../../../core/services/proveedor.service";
import {ModalConfirmacionYnComponent} from "../../../components/modal-confirmacion-yn/modal-confirmacion-yn.component";
import {BodegaService} from "../../../core/services/bodega.service";
import {Bodega} from "../../../core/models/bodega";
import {EntradaInventarioService} from "../../../core/services/entrada-inventario.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  standalone: true,
  imports: [FormsModule,CommonModule,ModalConfirmacionYnComponent],
  templateUrl: './productos.component.html',
  styles: ``
})
export default class ProductosComponent implements OnInit{

  productoService =   inject(ProductoService)
  proveedorService =  inject(ProveedorService)
  bodegaService=      inject(BodegaService);
  inventarioService=  inject(EntradaInventarioService);
  toastr=             inject(ToastrService)
  router=              inject(Router)

  productoSelected?:Producto;
  bodega?:          Bodega;
  listaProveedores: Proveedor[] =[];
  listaProductos:   Producto[] =[];

  cantidad:      number = 0;
  nombreOBarra:   string=''
  titulo:        string='Producto no encontrado desea agregarlo'
  nombreBodega?: string

  mostrarModal:        boolean = false;
  modalConfirmacion:   boolean = false;
  modalListaProductos: boolean = false;
  modalProductoSelct:  boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.listarProveedores()
    this.bodegaSelected()
  }

  buscarPorNombreOBarra(): void {
    this.productoService.porNombreOBarra(this.nombreOBarra).subscribe(
      productos => {
        this.listaProductos = productos
        if (productos.length > 0){
          this.modalListaProductos=true;
          this.cleanInputs()
        }else{
          this.modalConfirmacion=true
          this.cleanInputs()
        }
      },
      error => {
        this.modalConfirmacion=true
        this.cleanInputs()
      }
    )
  }

  agregarStockProducto(){
    const bodId = this.bodega?.id;
    const productosId = this.productoSelected?.id;
    const  userId = Number(sessionStorage.getItem('userId'));
    if (bodId && productosId && userId){
      console.log(bodId, productosId, this.cantidad, userId)
      this.inventarioService.incrementarStock(productosId,bodId,this.cantidad,userId).subscribe({
        next: (data) => {
          this.cleanInputs();
          this.toastr.success(data)
          this.cerrarProductoSelct()
        },
        error: (err) => {
          console.error('Error ',err);
          this.cleanInputs();
        }
      })
    }

  }

  agregarProductoNuevo(){

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

  formatInputNumber() {
    if (this.cantidad !== null && this.cantidad !== undefined) {
      // Asegúrate de que sea un entero
      this.cantidad = Math.floor(Number(this.cantidad));
      console.log(this.cantidad);
    }
  }

  cleanInputs(){
    this.cantidad=0;
    this.nombreOBarra=''
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  cerrarProductoSelct(){
    this.modalProductoSelct=false
    this.productoSelected=undefined;
  }

  productoEscogido(producto:Producto){
    this.modalProductoSelct=true
    this.productoSelected=producto
    this.modalListaProductos=false
  }

  goToAlmacen(){
    this.router.navigate(['/bar', 'user', 'almacenes']).then(r =>{
      this.cleanInputs()
      this.productoSelected=undefined;
    })
  }
}
