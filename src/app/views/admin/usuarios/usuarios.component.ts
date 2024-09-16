import {Component, inject, OnInit} from '@angular/core';
import {Usuario} from "../../../core/models/ususario";
import {Rol} from "../../../core/models/rol";
import {Almacen} from "../../../core/models/almacen";
import {UsuarioService} from "../../../core/services/usuario.service";
import {RolService} from "../../../core/services/rol.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BodegaService} from "../../../core/services/bodega.service";
import {Bodega} from "../../../core/models/bodega";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Proveedor} from "../../../core/models/proveedor";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './usuarios.component.html',
  styles: ``
})
export default class UsuariosComponent implements OnInit{

  usuarioService = inject(UsuarioService)
  rolService     = inject(RolService)
  toastr          = inject(ToastrService)
  fb             = inject(FormBuilder)
  bodegaService  = inject(BodegaService)

  constructor() {
    this.usuarioForm = this.fb.group({
      apellidoUsr: ['',Validators.required],
      nombreUsr: ['',Validators.required],
      usernameUsr: ['',Validators.required],
      passwordUsr: ['',Validators.required],
      telefonoUsr: ['',Validators.required],
      rolUsr:['',Validators.required],
    });
    this.editUsuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: '',
      nombreUsuario: '',
      password: '',
      rol: '',
      bodega: '',
    })

  }

  usuarioForm!: FormGroup;
  editUsuarioForm!: FormGroup;

  usuarioSelect:  Usuario={} as Usuario
  usuario:        Usuario={} as Usuario

  listaUsuarios:  Usuario[]=[]
  listaRoles:     Rol[]=[]
  listaBodega:    Bodega[]=[]

  vistaUsuarios:        boolean = false;
  editUsuarios:         boolean = false;
  username:             any;

  ngOnInit(): void {
    this.listarUsuarios()
    this.listarRoles()
    this.listarBodegas()
  }

  detalles(usuario: Usuario) {
    this.editUsuarios=!this.editUsuarios
    this.editUsuarioForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono,
      nombreUsuario: usuario.nombreUsuario,
      password: usuario.password,
      rol: usuario.rol.descripcion,
    })
  }

  agregarNuevoUsuario(){
    if (this.usuarioForm.invalid){
      this.toastr.warning('Llene los campos en el formulario')
      return;
    } else {
      const nombreValue= this.usuarioForm.get('nombreUsr')?.value;
      const apellidoValue= this.usuarioForm.get('apellidoUsr')?.value;
      const telefonoValue= this.usuarioForm.get('telefonoUsr')?.value;
      const usernameValue= this.usuarioForm.get('usernameUsr')?.value;
      const passwordValue= this.usuarioForm.get('passwordUsr')?.value;
      const rolValue= this.usuarioForm.get('rolUsr')?.value;

      const nombre = typeof nombreValue === 'string' ? nombreValue.toUpperCase() : nombreValue;
      const apellido = typeof apellidoValue === 'string' ? apellidoValue.toUpperCase() : apellidoValue;

      const nuevoUsuario: Usuario = {
        id: 0,
        nombre: nombre,
        apellido: apellido,
        nombreUsuario: usernameValue,
        telefono: telefonoValue,
        rol: rolValue,
        password: passwordValue,
        bodegas: []
      };
      this.usuarioService.crear(nuevoUsuario).subscribe(
        usuario => {
          this.toastr.success('Usuario creado');
          this.listarUsuarios()
          this.vistaUsuarios=!this.vistaUsuarios
          this.usuarioForm.reset();
        }
      )
    }

  }
  editarUsuario(usuarioId:number){
    if (this.editUsuarioForm.invalid){
      this.toastr.warning('Llene los campos en el formulario')
      return;
    }
    const nombreValue= this.editUsuarioForm.get('nombre')?.value;
    const apellidoValue= this.editUsuarioForm.get('apellido')?.value;
    const telefonoValue= this.editUsuarioForm.get('telefono')?.value;
    const usernameValue= this.editUsuarioForm.get('nombreUsuario')?.value;
    const passwordValue= this.editUsuarioForm.get('password')?.value;
    const rolValue= this.editUsuarioForm.get('rol')?.value;

    const nombre = typeof nombreValue === 'string' ? nombreValue.toUpperCase() : nombreValue;
    const apellido = typeof apellidoValue === 'string' ? apellidoValue.toUpperCase() : apellidoValue;

    const usuario: Usuario = {
      id: 0,
      nombre: nombre,
      apellido: apellido,
      nombreUsuario: usernameValue,
      telefono: telefonoValue,
      rol: rolValue,
      password: passwordValue,
      bodegas: []
    };

    this.usuarioService.actualizar(usuarioId, usuario).subscribe(
      usuario => {
        this.toastr.show('Usuario actualizado');
        this.editUsuarios=!this.editUsuarios
        this.listarUsuarios()
        this.editUsuarioForm.reset()
      }
    )

  }

  listarUsuarios(){
    this.usuarioService.listar().subscribe(
      usuarios => {
        this.listaUsuarios = usuarios
      }
    )
  }
  listarRoles(){
    this.rolService.listar().subscribe(
      roles => {
        this.listaRoles = roles
      }
    )
  }
  listarBodegas(){
    this.bodegaService.listar().subscribe(
      bodegas => {
        this.listaBodega = bodegas
      }
    )
  }

  cerrarVentanaAddUsuario(){
    this.vistaUsuarios=false;
  }
  cerrarVentanaEditUsuario(){
    this.editUsuarios=false;
  }

  agregarBodega(usuario: Usuario){
    const bodega= this.editUsuarioForm.get('bodega')?.value;
    this.usuarioService.agregarAlmacen(usuario.id,bodega.id).subscribe(
      usuario => {
        this.editUsuarios=!this.editUsuarios
        this.listarUsuarios();
      }
    )
  }

  quitarBodegas(usuarioId:number, bodegaId:number){
    this.usuarioService.eliminarAlmacen(usuarioId,bodegaId).subscribe(
      usuario => {
        this.editUsuarios=!this.editUsuarios
        this.listarUsuarios();
      }
    )
  }

}
