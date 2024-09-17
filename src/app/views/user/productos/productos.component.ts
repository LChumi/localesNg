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
import {ProductoAlmacen} from "../../../core/models/productoAlmacen";
import {EntradaInventario} from "../../../core/models/entrada-inventario";

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
  bodega:           Bodega={} as Bodega;
  proveedor:        Proveedor={} as Proveedor;
  listaProveedores: Proveedor[] =[];
  listaProductos:   Producto[] =[];
  listaProductoBod: ProductoAlmacen[]=[]

  barraNueva:       string=''
  descripcionNueva: string =''

  cantidad:      number = 0;
  costo:         number = 0.00;
  precio1:       number = 0.00;
  precio2:       number = 0.00;
  precio3:       number = 0.00;

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
          this.barraNueva=this.nombreOBarra
          this.cleanInputs()
        }
      },
      error => {
        this.modalConfirmacion=true
        this.barraNueva=this.nombreOBarra
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

  formatInputNumber() {
    if (this.cantidad !== null && this.cantidad !== undefined) {
      // Asegúrate de que sea un entero
      this.cantidad = Math.floor(Number(this.cantidad));
      console.log(this.cantidad);
    }
  }

  cleanInputs(){
    this.cantidad=0;
    this.costo=0;
    this.precio1=0;
    this.precio2=0;
    this.precio3=0;
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

  guardarProductoNuevo(){
    if (this.descripcionNueva === '' && this.barraNueva === '' && this.costo ===0 && this.precio1===0 && this.precio2===0 && this.precio3===0 && this.cantidad===0 ){
      this.toastr.warning('llene los campos')
      return;
    }
    const productoNuevo: Producto ={
      id:0,
      descripcion:this.descripcionNueva,
      barra:this.barraNueva,
      costo:this.costo,
      precio1:this.precio1,
      precio2:this.precio2,
      precio3:this.precio3
    }
    this.productoService.crear(productoNuevo).subscribe(
      producto => {
        this.productoSelected=producto
        this.agregarInventario(producto)
      }
    )
  }

  agregarInventario(producto:Producto){
    const entradaInventario: EntradaInventario ={
      id:0,
      producto:producto,
      proveedor:this.proveedor,
      bodega:this.bodega,
      cantidad:this.cantidad,
      fecha: new Date()

    }
    this.inventarioService.agregarProducto(entradaInventario).subscribe(
      data => {
        this.toastr.success("registro inventario.")
        this.cerrarModal()
      }
    )
  }

}
