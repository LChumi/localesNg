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
import {Observable} from "rxjs";
import {Cliente} from "../../../core/models/cliente";
import {VentaService} from "../../../core/services/venta.service";

@Component({
  standalone: true,
  imports: [
    FormsModule
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

  usuario!:Usuario;
  producto!:Producto;
  venta!:Venta;
  cliente!:Cliente;

  clientes:Cliente[]=[];
  listaProductos:Producto[]=[];
  productosSeleccionados:Producto[]=[];

  modalCliente=false;

  almacenName = sessionStorage.getItem('almacen') ?? ''
  usuarioId = Number(sessionStorage.getItem('userId') ?? '')
  username = sessionStorage.getItem('username') ?? ''

  nombreUsuario:string='';
  nombreOBarra:string='';
  nombreCliente:string='';
  nombreOCedula:string='9999999999';
  cupoDisp:number=0;
  saldoDisp:number=0;
  direccionCli:string='';

  nomCli:string=''
  cedCli:string=''
  apellCli:string=''
  emailCli:string=''
  teleCli:string=''
  dirCli:string=''
  creditoCli:number=0

  ngOnInit(): void {
    this.obtennerUsuario()
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
            }
            return response;
          } else {
            this.llenarInfoCliente(response)
            this.cliente=response
            return [response];
          }
        },
        error: err => {
          this.toastr.warning(err.message)
        }
      })
    } else {
      console.warn('Por favor, ingresa un ID o apellido de cliente');
    }
  }

  buscarPorNombreOBarra(): void {
    this.productoService.porNombreOBarra(this.nombreOBarra).subscribe(
      productos => {
        this.listaProductos = productos
        if (productos.length > 0){
          //this.modalListaProductos=true;
          this.cleanInputs()
        }else{
          //this.modalConfirmacion=true
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
    const venta: Venta = {
      id: 0,
      cliente: this.cliente,
      fecha: this.formatDate(new Date()),
      usuario: this.usuario,
      formaPago: '',
      total:0
    }
    this.ventaService.crearVenta(venta).subscribe(

    )
  }

  cleanInputs(){

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
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
