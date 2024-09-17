import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Cliente} from "../../../core/models/cliente";
import {ClienteService} from "../../../core/services/cliente.service";
import {ToastrService} from "ngx-toastr";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './clientes.component.html',
  styles: ``
})
export default class ClientesComponent implements OnInit{

  clienteService=     inject(ClienteService)
  toastr=             inject(ToastrService)
  fb=                 inject(FormBuilder)

  modo: 'agregar' | 'editar' = 'agregar'

  clienteForm!: FormGroup

  clientes:           Cliente[]=[];
  cliente:            Cliente={} as Cliente;

  vistaClientes=        false;
  modalListaCliente=    false;

  clienteEscogido(cliente:Cliente){
    this.cliente=cliente
    this.modalListaCliente=false
  }


  guardarEditarCliente(){
    if (this.clienteForm.invalid){
      this.toastr.warning("Llene los campos en el formulario")
      return;
    }

    const nombreVelue= this.clienteForm.get('nombre')?.value;
    const cedulaValue= this.clienteForm.get('cedula')?.value;
    const apellidoValue= this.clienteForm.get('apellido')?.value;
    const telefonoValue= this.clienteForm.get('telefono')?.value;
    const emailValue= this.clienteForm.get('email')?.value;
    const direccionValue= this.clienteForm.get('direccion')?.value;
    const creditoValue= this.clienteForm.get('credito')?.value;

    const nombre = typeof nombreVelue === 'string' ? nombreVelue.toUpperCase() : nombreVelue;
    const apellido = typeof apellidoValue === 'string' ? apellidoValue.toUpperCase() : apellidoValue;

    const cliente: Cliente = {
      id:0,
      cedula: cedulaValue,
      nombre: nombre,
      apellido: apellido,
      email: emailValue,
      telefono: telefonoValue,
      direccion: direccionValue,
      credito: creditoValue,
      cupo: creditoValue,
    }

    if (this.modo ==='agregar'){
      this.clienteService.crear(cliente).subscribe(
        cliente =>{
          this.cliente=cliente
          this.toastr.success("Cliente agregado")
          this.listarClientes()
          this.vistaClientes=false;
        }
      )
    }else {
      this.clienteService.actualizar(this.cliente.id,cliente).subscribe(
        cliente=>{
          this.toastr.show(`cliente ${cliente.nombre} actualizado`)
          this.listarClientes()
          this.vistaClientes=false;
        }
      )
    }

  }

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido:['', Validators.required],
      cedula: ['', Validators.required],
      email: '',
      telefono: '',
      direccion: '',
      credito: ''
    })
    this.listarClientes()
  }

  detalles(cliente:Cliente){
    this.modo = 'editar'
    this.vistaClientes=!this.vistaClientes;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      cedula: cliente.cedula,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      cupo: cliente.cupo,

    })
  }

  listarClientes(){
    this.clienteService.listar().subscribe(
      clientes =>{
        this.clientes=clientes
      }
    )
  }

}
