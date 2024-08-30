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
  toastr=             inject(ToastrService)
  router=             inject(Router)

  usuario!:Usuario;
  producto!:Producto;
  venta!:Venta;

  listaProductos:Producto[]=[];
  productosSeleccionados:Producto[]=[];

  modalCliente=false;

  almacenName = sessionStorage.getItem('almacen') ?? ''
  usuarioId = Number(sessionStorage.getItem('userId') ?? '')
  username = sessionStorage.getItem('username') ?? ''

  nombreUsuario:string='';
  nombreOBarra:string='';

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

  cleanInputs(){

  }

  cerrarModal(){

  }

}
