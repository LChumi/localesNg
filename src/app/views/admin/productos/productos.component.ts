import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {LoadingService} from "../../../core/services/loading.service";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    FormsModule,
    ModalConfirmacionYnComponent,
    NgForOf,
    DecimalPipe,
    ReactiveFormsModule
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
  fb= inject(FormBuilder)
  loadingService = inject(LoadingService)

  productoSelected?:Producto;
  bodegaSelected?:  Bodega;
  bodega:           Bodega | null=null;
  proveedor:        Proveedor | null = null;
  usuario:          Usuario={} as Usuario;
  listaProveedores: Proveedor[] =[];
  listaProductos:   Producto[] =[];
  listaProductoBod: ProductoAlmacen[]=[]
  listaBodegas:     Bodega[]=[]
  filterProductos:  ProductoAlmacen[]=[]

  barraNueva:       string=''
  descripcionNueva: string=''
  productStr:      string=''

  cantidad:      number = 0;
  costo:         number = 0.00;
  precio1:       number = 0.00;
  precio2:       number = 0.00;
  precio3:       number = 0.00;

  nombreOBarra:  string=''
  titulo:        string='Producto no encontrado desea agregarlo'
  modo:          'agregar' | 'quitar' = 'agregar'

  mostrarModal:        boolean = false;
  modalConfirmacion:   boolean = false;
  modalListaProductos: boolean = false;
  modalProductoSelct:  boolean = false;
  ingresaqrProductos:  boolean = false;
  modalEditarProducto: boolean = false;
  isLoading:           boolean = false;
  addBodegaModal:      boolean = false;

  productoForm!: FormGroup;

  constructor() {this.loadingService.loading$.subscribe(isLoading => {
     this.isLoading= isLoading
  })}

  ngOnInit(): void {
    this.loadingService.show();
    this.listarProveedores()
    this.listarProductos()
    this.listarBodegas()
    this.obtenerIdUsario()
    this.loadingService.hide();


    this.productoForm = this.fb.group({
      barraP: ['', Validators.required],
      descripcionP: ['', Validators.required],
      costoP: ['', Validators.required],
      precioP1: ['', Validators.required],
      precioP2: ['', Validators.required],
      precioP3: ['', Validators.required],
    })
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
    this.loadingService.show()
    if (this.bodegaSelected && this.productoSelected && this.usuario.id){
      this.inventarioService.incrementarStock(this.productoSelected.id,this.bodegaSelected.id,this.cantidad,this.usuario.id).subscribe({
        next: (data) => {
          this.cleanInputs();
          this.toastr.success(data)
          this.cerrarProductoSelct()
          this.loadingService.hide()
        },
        error: (err) => {
          console.error('Error ',err);
          this.cleanInputs();
          this.loadingService.hide()
        }
      })
    }
  }

  reducirStock(){
    this.loadingService.show()
    if (this.bodegaSelected && this.productoSelected && this.usuario.id){
      this.inventarioService.reducirStock(this.productoSelected.id,this.bodegaSelected.id,this.cantidad,this.usuario.id).subscribe({
        next: (data) => {
          this.cleanInputs();
          this.toastr.success(data)
          this.cerrarProductoSelct()
          this.loadingService.hide()
        },
        error: (err) => {
          console.error('Error ',err);
          this.cleanInputs();
          this.loadingService.hide()
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

  cleanInputs(){
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
    this.listarProductos()
  }

  productoEscogido(producto:Producto,bodega:Bodega){
    this.modalProductoSelct=true
    this.productoSelected=producto
    this.bodegaSelected=bodega
  }

  editarProducto(prod:Producto){
    this.productoSelected=prod
    this.modalEditarProducto=true
    this.productoForm.patchValue({
      barraP:prod.barra,
      descripcionP: prod.descripcion,
      costoP: prod.costo,
      precioP1: prod.precio1,
      precioP2: prod.precio2,
      precioP3: prod.precio3
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
        this.bloqueado=false
      }
    )
  }

  agregarInventario(producto:Producto){
    if (!this.proveedor || !this.bodega) {
      this.toastr.warning('Seleccione un proveedor y una bodega');
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
        this.cleanInputs()
        this.gotoListproductos()
      }
    )
  }

  eliminarInventario(id: number){
    this.productoService.eliminarInv(id).subscribe(
      data => {
        this.toastr.warning("registro eliminado.")
        this.cleanInputs()
        this.gotoListproductos()
      }
    )
  }

  listarProductos(){
    this.loadingService.show()
    this.productoService.listarProductosAlmacen().subscribe(
      data => {
        this.actualizarProductos(data);
        this.loadingService.hide()
      }
    )
  }

  listarBodegas(){
    this.bodegaService.listar().subscribe(
      bodegas=>{
        this.listaBodegas=bodegas
      }
    )
  }

  bloqueado= false;
  guardarProducto(){
    this.bloqueado=true
    this.guardarProductoNuevo()
  }

  actualizarProductos(produc:ProductoAlmacen[]){
    this.listaProductoBod= produc;
    this.filterProductos= produc;
  }

  searchProdcutoBynombre(){
    if (this.productStr == null || this.productStr === ''){
      this.listaProductoBod = this.filterProductos
    } else {
      const producto = this.productStr.toString().toLowerCase()
      this.listaProductoBod = this.filterProductos.filter((productos) =>
        productos.producto.descripcion.toString().toLowerCase().includes(producto)
      );
    }
  }

  agregarBodega(producto:Producto){
    this.addBodegaModal= true;
    this.modalListaProductos= false;
    this.productoSelected=producto;

  }

  addInventario(){
    if (this.productoSelected){
      this.agregarInventario(this.productoSelected);
    }
  }

  gotoListproductos(){
    this.listarProductos()
    this.mostrarModal=false;
    this.ingresaqrProductos=false;
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
  editarProductoForm(){
    if (this.productoForm.invalid){
      this.toastr.warning('Llene  los campos del formulario')
      return;
    }
    const barraValue = this.productoForm.get('barraP')?.value;
    const descripcionValue = this.productoForm.get('descripcionP')?.value;
    const costoValue= this.productoForm.get('costoP')?.value;
    const precio1Value = this.productoForm.get('precioP1')?.value;
    const precio2Value = this.productoForm.get('precioP2')?.value;
    const precio3Value = this.productoForm.get('precioP3')?.value;

    const descripcion = typeof descripcionValue === 'string' ? descripcionValue.toUpperCase() : descripcionValue;

    const producto: Producto ={
      id: 0,
      barra:barraValue,
      descripcion: descripcion,
      costo: costoValue,
      precio1:precio1Value,
      precio2:precio2Value,
      precio3:precio3Value
    }
    if (this.productoSelected){
      this.productoService.actualizar(this.productoSelected.id, producto).subscribe(
        data => {
          console.log(data)
          this.modalEditarProducto=false
          this.listarProductos()
        }
      )
    }
  }
}
