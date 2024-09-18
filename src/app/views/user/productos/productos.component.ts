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
import {EntradaInventario} from "../../../core/models/entrada-inventario";
import {UsuarioService} from "../../../core/services/usuario.service";
import {Usuario} from "../../../core/models/ususario";

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
  usuarioService =    inject(UsuarioService)

  productoSelected?:Producto;
  bodega:           Bodega | null=null;
  proveedor:        Proveedor | null = null;
  usuario:          Usuario={} as Usuario;
  listaProveedores: Proveedor[] =[];
  listaProductos:   Producto[] =[];

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
    this.obtenerIdUsario()
  }

  buscarPorNombreOBarra(): void {
    this.productoService.porNombreOBarra(this.nombreOBarra).subscribe(
      productos => {
        this.listaProductos = productos
        if (productos.length > 0){
          this.modalListaProductos=true;
          this.limpiar()
        }else{
          this.modalConfirmacion=true
          this.barraNueva=this.nombreOBarra
          this.limpiar()
        }
      },
      error => {
        this.modalConfirmacion=true
        this.barraNueva=this.nombreOBarra
        this.limpiar()
      }
    )
  }

  agregarStockProducto(){
    const bodId = this.bodega?.id;
    const productosId = this.productoSelected?.id;
    const  userId = Number(sessionStorage.getItem('userId'));
    if (bodId && productosId && userId){
      this.inventarioService.incrementarStock(productosId,bodId,this.cantidad,userId).subscribe({
        next: (data) => {
          this.limpiar();
          this.toastr.success(data)
          this.cerrarProductoSelct()
        },
        error: (err) => {
          console.error('Error ',err);
          this.limpiar();
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
    }
  }

  limpiar(){
    this.cantidad=0;
    this.costo=0;
    this.precio1=0;
    this.precio2=0;
    this.precio3=0;
    this.nombreOBarra=''
    this.descripcionNueva=''
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
      this.limpiar()
      this.productoSelected=undefined;
    })
  }

  guardarProductoNuevo(){
    if (!this.proveedor || !this.bodega) {
      this.toastr.warning('Seleccione un proveedor y una bodega');
      return;
    }
    if (
      this.descripcionNueva === '' ||
      this.barraNueva === '' ||
      this.costo === 0 ||
      this.precio1 === 0 ||
      this.precio2 === 0 ||
      this.precio3 === 0 ||
      this.cantidad === 0
    ) {
      this.toastr.warning('Llene todos los campos obligatorios');
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
    if (!this.proveedor || !this.bodega) {
      this.toastr.warning('Seleccione un proveedor o usuario sin bodega');
      return;
    }
    const entradaInventario: EntradaInventario ={
      id:0,
      producto:producto,
      proveedor:this.proveedor,
      bodega:this.bodega,
      cantidad:this.cantidad,
      fecha: new Date(),
      usuario: this.usuario,
    }
    this.inventarioService.agregarProducto(entradaInventario).subscribe(
      data => {
        this.toastr.success("registro inventario.")
        this.cerrarModal()
      }
    )
  }

  obtenerIdUsario(){
    const username = sessionStorage.getItem("username");
    if (username){
      this.usuarioService.porUsername(username).subscribe({
        next: (user) => {
          this.usuario = user;
        }
      })
    }
  }

}
