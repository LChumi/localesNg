import {Component, inject, OnInit} from '@angular/core';
import {UsuarioService} from "../../../core/services/usuario.service";
import {ClienteService} from "../../../core/services/cliente.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Usuario} from "../../../core/models/ususario";
import {Producto} from "../../../core/models/producto";
import {Venta} from "../../../core/models/venta";
import {FormsModule} from "@angular/forms";
import {ProductoService} from "../../../core/services/producto.service";
import {BodegaService} from "../../../core/services/bodega.service";
import {Cliente} from "../../../core/models/cliente";
import {VentaService} from "../../../core/services/venta.service";
import {NgForOf} from "@angular/common";
import {DetalleVenta} from "../../../core/models/detalle-venta";
import {Bodega} from "../../../core/models/bodega";

@Component({
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './facturacion.component.html',
  styles: ``
})
export default class FacturacionComponent implements OnInit{

  userService =       inject(UsuarioService)
  clienteService =    inject(ClienteService)
  productoService =   inject(ProductoService)
  bodegaService =     inject(BodegaService)
  ventaService =      inject(VentaService)
  toastr=             inject(ToastrService)
  router=             inject(Router)

  usuario:           Usuario={} as Usuario;
  producto:          Producto={} as Producto;
  productoSelected:  Producto={} as Producto;
  venta:             Venta={} as Venta;
  cliente:           Cliente={} as Cliente;
  bodega:            Bodega={} as Bodega;

  clientes:                 Cliente[]=[];
  listaProductos:           Producto[]=[];
  productosSeleccionados:   Producto[]=[];
  ventasPendientes:         Venta[]=[]

  modalCliente=             false;
  modalListaProductos=      false;

  almacenName =   sessionStorage.getItem('almacen') ?? ''
  usuarioId =     Number(sessionStorage.getItem('userId') ?? '')
  username =      sessionStorage.getItem('username') ?? ''
  bodegaId =      Number(sessionStorage.getItem('bodegaId') ?? '')

  nombreUsuario:    string='';
  nombreOBarra:     string='';
  nombreCliente:    string='';
  nombreOCedula:    string='9999999999';
  cupoDisp:         number=0;
  saldoDisp:        number=0;
  direccionCli:     string='';

  nomCli:           string=''
  cedCli:           string=''
  apellCli:         string=''
  emailCli:         string=''
  teleCli:          string=''
  dirCli:           string=''
  creditoCli:       number=0

  ventaId:          number=0;
  tipoPrecio:       number=0;
  cantidad:         number=0;

  ngOnInit(): void {
    this.obtennerUsuario()
    this.cargarClientePorDefecto()
    this.cargarBodega()
  }

  goToAlmacen(){
    this.router.navigate(['/bar', 'user', 'almacenes']).then(r =>{
      this.cleanInputs()
    })
  }

  obtennerUsuario(){
    this.userService.porId(this.usuarioId).subscribe(
      user => {
        this.usuario = user
        this.nombreUsuario=user.nombre
      }
    )
  }

  buscarCliente() {
    if (this.nombreOCedula) {
      this.clienteService.buscarCliente(this.nombreOCedula).subscribe({
        next: response => {
          if (Array.isArray(response)) {
            if (response.length >= 0){
              this.modalCliente=true;
              this.clientes=response
              console.log(this.clientes)
            }
            return response;
          } else {
            this.llenarInfoCliente(response)
            this.cliente=response
            this.verificarCliente(response)
            return [response];
          }
        },
        error: err => {
          this.toastr.warning(err.message)
        }
      })
    } else {
      console.warn('Por favor, ingresa un ID o apellido de cliente');
      return;
    }
  }

  buscarPorNombreOBarra(): void {
    this.productoService.porNombreOBarra(this.nombreOBarra).subscribe(
      productos => {
        this.listaProductos = productos
        if (productos.length > 0){
          //this.modalListaProductos=true;
          console.log(productos.length)
          this.cleanInputs()
        }else{
          //this.modalConfirmacion=true
          this.toastr.warning("Producto no existe")
          this.cleanInputs()
        }
      },
      error => {
        //this.modalConfirmacion=true
        this.cleanInputs()
      }
    )
  }

  guardarCliente(){
    if (!this.nomCli && !this.apellCli && !this.emailCli && !this.teleCli && !this.dirCli && !this.creditoCli){
      this.toastr.warning("Ingrese los datos")
      return;
    }
    const cliente: Cliente = {
      id:0,
      cedula: this.cedCli,
      nombre: this.nomCli,
      apellido: this.apellCli,
      email: this.emailCli,
      telefono: this.teleCli,
      direccion: this.dirCli,
      cupo: this.creditoCli,
      credito: this.creditoCli,
    }
    this.clienteService.crear(cliente).subscribe(
      cliente =>{
        this.llenarInfoCliente(cliente)
        this.modalCliente=false;
      }
    )
  }

  crearVenta(){
    if (!this.venta){
      const venta: Venta = {
        id: 0,
        cliente: this.cliente,
        fecha: this.formatDate(new Date()),
        usuario: this.usuario,
        formaPago: '',
        total:0
      }
      this.ventaService.crearVenta(venta).subscribe( ventaCreada => {
        this.venta = ventaCreada
        this.ventaId = ventaCreada.id
        });
    } else if (this.cliente){
      this.venta.cliente = this.cliente;
      this.ventaService.actualizarVenta(this.venta, this.ventaId).subscribe( ventaUp =>{
        this.venta = ventaUp;
      })
    }
  }

  agregarDetalle() {
    if (!this.venta) {
      this.crearVenta();
    }
    // Asegúrate de que la venta y el producto están definidos
    if (this.venta && this.productoSelected) {
      const detalleVenta: DetalleVenta = {
        id: 0,
        bodega: this.bodega,
        venta: this.venta,
        cantidad: this.cantidad,
        precioUnitario: this.productoSelected.precio1, // Asegúrate de que el precio esté definido
        subtotal: this.cantidad * this.productoSelected.precio1,
        tipoPrecio: this.tipoPrecio,
        producto: this.productoSelected,
        precio: this.productoSelected.precio1 // Ajusta si es necesario
      };
      // Llama a un servicio para agregar el detalle
      this.ventaService.agregarDetalle(this.venta.id, detalleVenta, this.tipoPrecio).subscribe({
        next: detalleAgregado => {
          this.toastr.success('Detalle agregado exitosamente.');
        },
        error: err => {
          this.toastr.warning('Error al agregar el detalle: ' + err.message);
        }
      });
    } else {
      this.toastr.warning('Debe seleccionar un producto.');
    }
  }


  cambiarCliente(nuevoCliente:Cliente){
    if (this.venta){
      console.log('si tiene venta')
      this.venta.cliente=nuevoCliente;
      this.ventaService.actualizarVenta(this.venta,this.venta.id).subscribe({
        next: ventaActualizada => {
          this.venta = ventaActualizada;
          this.llenarInfoCliente(nuevoCliente);
          this.toastr.info("Cliente Modificado")
        } , error: err => {
          this.toastr.warning("Error al cambiar de cliente")
        }
      })
    } else {
      console.log('no tiene venta')
      this.cliente = nuevoCliente;
      this.crearVenta();
    }
  }

  cargarBodega(){
    this.bodegaService.porId(this.bodegaId).subscribe(bodega =>{
      this.bodega = bodega;
    })
  }

  cargarClientePorDefecto(){
    this.buscarCliente()
  }

  productoEscogido(producto:Producto){
    this.productoSelected=producto
    this.modalListaProductos=false
  }

  cleanInputs(){
    this.nombreOBarra=''
  }

  cerrarModal(){
    this.modalCliente=false
  }

  llenarInfoCliente(response:Cliente){
    this.nombreCliente=response.nombre+ ' ' + response.apellido;
    this.saldoDisp=response.credito
    this.cupoDisp=response.cupo
    this.direccionCli=response.direccion
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  verificarCliente(cli:Cliente){
    if (this.cliente.cedula === cli.cedula){
      return
    } else {
      this.cambiarCliente(cli)
    }
  }

}
