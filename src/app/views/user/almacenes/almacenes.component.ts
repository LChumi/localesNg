import { Component } from '@angular/core';
import { ModalConfirmacionComponent } from '../../../components/modal-confirmacion/modal-confirmacion.component';

@Component({
  standalone: true,
  imports: [ModalConfirmacionComponent],
  templateUrl: './almacenes.component.html',
  styles: ``
})
export default class AlmacenesComponent {
  modalVisible = false;
  bodegaSelecionada!: string;

  mostrarModal(bodega: string){
    this.bodegaSelecionada = bodega;
    this.modalVisible= true
  }

}
