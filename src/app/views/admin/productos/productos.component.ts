import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ModalConfirmacionYnComponent} from "../../../components/modal-confirmacion-yn/modal-confirmacion-yn.component";
import {DecimalPipe, NgForOf} from "@angular/common";
import {ProductoService} from "../../../core/services/producto.service";
import {ProveedorService} from "../../../core/services/proveedor.service";
import {BodegaService} from "../../../core/services/bodega.service";
import {EntradaInventarioService} from "../../../core/services/entrada-inventario.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Producto} from "../../../core/models/producto";
import {Bodega} from "../../../core/models/bodega";
import {Proveedor} from "../../../core/models/proveedor";
import {EntradaInventario} from "../../../core/models/entrada-inventario";
import {ProductoAlmacen} from "../../../core/models/productoAlmacen";
import {UsuarioService} from "../../../core/services/usuario.service";
import {Usuario} from "../../../core/models/ususario";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    FormsModule,
    ModalConfirmacionYnComponent,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './productos.component.html',
  styles: ``
})
export default class ProductosComponent implements OnInit{
  productoService =   inject(ProductoService)
  usuarioService =    inject(UsuarioService)
  proveedorService =  inject(ProveedorService)
  bodegaService=      inject(BodegaService);
  inventarioService=  inject(EntradaInventarioService);
  toastr=             inject(ToastrService)
  router=              inject(Router)

  productoSelected?:Producto;
  bodegaSelected?:  Bodega;
  bodega:           Bodega={} as Bodega;
  proveedor:        Proveedor={} as Proveedor;
  usuario:          Usuario={} as Usuario;
  listaProveedores: Proveedor[] =[];
  listaProductos:   Producto[] =[];
  listaProductoBod: ProductoAlmacen[]=[]
  listaBodegas:     Bodega[]=[]

  barraNueva:       string=''
  descripcionNueva: string =''

  cantidad:      number = 0;
  costo:         number = 0.00;
  precio1:       number = 0.00;
  precio2:       number = 0.00;
  precio3:       number = 0.00;

  nombreOBarra:   string=''
  titulo:        string='Producto no encontrado desea agregarlo'

  mostrarModal:        boolean = false;
  modalConfirmacion:   boolean = false;
  modalListaProductos: boolean = false;
  modalProductoSelct:  boolean = false;
  ingresaqrProductos:  boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.listarProveedores()
    this.listarProductos()
    this.listarBodegas()
    this.obtenerIdUsario()
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

  agregarStockProducto(p:Producto, b:Bodega){
    const  userId = Number(sessionStorage.getItem('userId'));
    if (b.id && p.id && userId){
      this.inventarioService.incrementarStock(p.id,b.id,this.cantidad,userId).subscribe({
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

  productoEscogido(producto:Producto,bodega:Bodega){
    this.modalProductoSelct=true
    this.productoSelected=producto
    this.bodegaSelected=bodega
    this.modalListaProductos=false
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

  listarProductos(){
    this.productoService.listarProductosAlmacen().subscribe(
      data => {
        this.listaProductoBod=data
      }
    )
  }

  listarBodegas(){
    this.bodegaService.listar().subscribe(
      bodegas=>{
        console.log(bodegas)
        this.listaBodegas=bodegas
      }
    )
  }

  guardarProducto(){
    this.guardarProductoNuevo()
  }

  obtenerIdUsario(){
    const username = sessionStorage.getItem("username");
    if (username){
      this.usuarioService.porUsername(username).subscribe({
        next: (user) => {
          console.log(user.nombre)
          this.usuario = user;
        }
      })
    }
  }
}
