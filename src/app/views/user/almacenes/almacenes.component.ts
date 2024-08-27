import { Component, OnInit, inject } from '@angular/core';
import { ModalConfirmacionComponent } from '../../../components/modal-confirmacion/modal-confirmacion.component';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Bodega } from '../../../core/models/bodega';

@Component({
  standalone: true,
  imports: [ModalConfirmacionComponent],
  templateUrl: './almacenes.component.html',
  styles: ``
})

export default class AlmacenesComponent implements OnInit{

  userService = inject(UsuarioService)

  listaBodegas: Bodega[]=[]

  modalVisible =      false;
  bodegaSelecionada!: string;

  ngOnInit(): void {
      this.cargarBodegas()
      this.obtenerIdUsario()
  }

  mostrarModal(bodega: Bodega){
    this.bodegaSelecionada = bodega.nombre;
    sessionStorage.setItem('bodegaId',String(bodega.id))
    this.modalVisible= true
  }


  cargarBodegas(){
    const username = sessionStorage.getItem("username");
    if(username){
      this.userService.listaBodegas(username).subscribe(
        bodegas => {
          this.listaBodegas = bodegas
          console.log(bodegas);

        }
      )
    }
  }

  obtenerIdUsario(){
    const username = sessionStorage.getItem("username");
    if (username){
      this.userService.porUsername(username).subscribe({
        next: (user) => {
          sessionStorage.setItem("userId",String(user.id))
        }
      })
    }
  }

}
