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
import {CurrencyPipe, NgForOf} from "@angular/common";
import {DetalleVenta} from "../../../core/models/detalle-venta";
import {Bodega} from "../../../core/models/bodega";

@Component({
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    CurrencyPipe
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
  ventasPendientes:         Venta[]=[]

  modalCliente=             false;
  modalListaProductos=      false;
  modalVentasPendientes=    false;
  modalListaCliente=        false;

  pagoEfectivo=             true;
  pagoTarjeta=              false;
  pagoCredito=              false;

  debeCambio=               false;
  debeAjustar=              false;

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
  tipoPrecio:       number=1;
  cantidad:         number=0;

  montoEfectivo =0;
  montoTarjeta  =0;
  montoCredito  =0;

  cambio      =0;
  faltante    =0;

  ngOnInit(): void {
    this.obtennerUsuario()
    this.cargarBodega()
    this.ventasPendientesFacturar()
    this.updateTotal();
    console.log(this.montoEfectivo)
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
            if (response.length > 0){
              this.modalListaCliente=true;
              this.clientes=response
            } else {
              this.modalCliente=true
              this.cedCli=this.nombreOCedula
            }
            return response;
          } else {
            this.llenarInfoCliente(response)
            this.cliente=response
            this.verificarCliente(response)
            this.crearVenta()
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
        if (productos.length === 1){
          this.productoSelected = productos[0];
          this.agregarDetalle()
          this.cleanInputs();
        } else if (productos.length > 1){
          this.listaProductos = productos;
          this.modalListaProductos=true;
          this.cleanInputs();
        } else {
          this.toastr.warning("Producto no existe");
          this.cleanInputs();
        }
      },
      error => {
        this.cleanInputs()
      }
    )
  }

  guardarCliente(){
    if (this.nomCli==='' && this.apellCli==='' && this.teleCli===''){
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
        this.cliente=cliente
        this.modalCliente=false;
        if (Object.keys(this.venta).length >0){
          this.cambiarCliente(cliente)
        } else {
          this.crearVenta()
        }
      }
    )
  }

  crearVenta(){
    if (Object.keys(this.venta).length ===0){
      const venta: Venta = {
        id: 0,
        cliente: this.cliente,
        fecha: this.formatDate(new Date()),
        usuario: this.usuario,
        formaPago: '',
        estado: false,
        total:0,
        detalles:[]
      }
      this.ventaService.crearVenta(venta).subscribe( ventaCreada => {
        this.venta = ventaCreada
        this.ventaId = ventaCreada.id
        });
    } else if (this.cliente){
      this.venta.cliente = this.cliente;
      this.ventaService.actualizarVenta(this.venta, this.venta.id).subscribe( ventaUp =>{
        this.venta = ventaUp;
      })
    }
  }

  agregarDetalle() {
    if (Object.keys(this.venta).length ===0) {
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
        next: venta => {
          this.toastr.success('Detalle agregado exitosamente.');
          this.venta=venta
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
    if (Object.keys(this.venta).length >0){
      this.venta.cliente=nuevoCliente;
      this.ventaService.actualizarVenta(this.venta,this.venta.id).subscribe({
        next: ventaActualizada => {
          this.venta = ventaActualizada;
          this.llenarInfoCliente(nuevoCliente);
          this.toastr.info("Cliente Modificado")
        } , error: err => {
          this.toastr.warning("Error al cambiar de cliente")
          return
        }
      })
    }else {
      this.cliente = nuevoCliente;
      this.crearVenta();
    }
  }

  cargarBodega(){
    this.bodegaService.porId(this.bodegaId).subscribe(bodega =>{
      this.bodega = bodega;
    })
  }

  procesarPago(){
    console.log(this.montoEfectivo)
    if (this.faltante > 0) {
      this.toastr.warning('El total pagado no cubre el total de la venta');
      return;
    }
    this.ventaService.procesarPago(this.venta.id,this.montoCredito,this.montoEfectivo,this.montoTarjeta).subscribe(
      venta => {
        if (venta.estado){
          this.toastr.success("Pago realizado")
          this.goToAlmacen()
        }
      },
    error => {
      this.toastr.error('Hubo un error al procesar el pago');
    }
    )
  }

  cargarClientePorDefecto(){
    this.buscarCliente()
  }

  productoEscogido(producto:Producto){
    this.productoSelected=producto
    this.modalListaProductos=false
    this.agregarDetalle()

  }

  ventaEscogida(venta:Venta){
    this.venta = venta;
    this.modalVentasPendientes=false;
    this.llenarInfoCliente(venta.cliente)
  }

  clienteEscogido(cliente:Cliente){
    this.cliente=cliente
    this.modalListaCliente=false
    this.llenarInfoCliente(cliente)
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

  ventasPendientesFacturar(){
    this.ventaService.listarPendientes(this.usuarioId).subscribe(
      ventas => {
        if (ventas.length > 0){
          this.ventasPendientes = ventas
          this.modalVentasPendientes=true;
        }else{
          this.cargarClientePorDefecto()
        }
      }
    )
  }

  /**
   * Calcular el total de pago
   * validando que el total pagado sea igual que el total de la venta
   */
  updateTotal(){
    this.montoEfectivo = +this.montoEfectivo || 0;  // Convierte a número, si es vacío o NaN usa 0
    this.montoTarjeta = +this.montoTarjeta || 0;
    this.montoCredito = +this.montoCredito || 0;
    console.log(this.montoEfectivo)
    const totalPagado = (this.pagoEfectivo ? this.montoEfectivo: 0)+
      (this.pagoTarjeta ? this.montoTarjeta : 0)+
      (this.pagoTarjeta ? this.montoCredito:0);

    // Calcula el faltante si el total pagado es menor que el total de la venta
    this.faltante = Math.max(this.venta.total - totalPagado, 0);
    this.debeAjustar = this.faltante > 0;

    // Calcula el cambio a devolver si el total pagado es mayor que el total de la venta
    this.cambio = Math.max(totalPagado - this.venta.total, 0);
    this.debeCambio = this.cambio > 0;

    if (this.pagoEfectivo) {
      // Si el monto en efectivo es mayor que el total de la venta, se ajusta para solo incluir el total
      this.montoEfectivo = Math.min(this.montoEfectivo, this.venta.total);
    }

  }

  cerrarModalVentas() {
      this.modalVentasPendientes = false;
      this.nombreOCedula = '9999999999';
      this.buscarCliente();
  }

}
