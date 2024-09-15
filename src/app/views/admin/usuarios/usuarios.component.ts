import {Component, inject, OnInit} from '@angular/core';
import {Usuario} from "../../../core/models/ususario";
import {Rol} from "../../../core/models/rol";
import {Almacen} from "../../../core/models/almacen";
import {UsuarioService} from "../../../core/services/usuario.service";
import {RolService} from "../../../core/services/rol.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html',
  styles: ``
})
export default class UsuariosComponent implements OnInit{

  usuarioService= inject(UsuarioService)
  rolService        = inject(RolService)
  tastr          = inject(ToastrService)


  usuarioSelect:  Usuario={} as Usuario
  usuario:        Usuario={} as Usuario

  listaUsuarios:  Usuario[]=[]
  listaRoles:     Rol[]=[]
  listaAlmacenes: Almacen[]=[]

  vistaUsuarios:        boolean = false;
  editUsuarios:         boolean = false;
  cargaLista:           boolean = false;
  rolPrincipal:         string = '';
  empresaId:            any;
  username:             any;

  ngOnInit(): void {

  }

  detalles(usuario: Usuario) {
  }
  listarRoles() {
  }

}
