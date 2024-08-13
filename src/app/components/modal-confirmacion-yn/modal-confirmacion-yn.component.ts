import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion-yn',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmacion-yn.component.html',
  styles: ``
})
export class ModalConfirmacionYnComponent {

  titulo = input<string>();
  public modalCerrado=output<boolean>();

  optionSelected: string ='';

  cerrarModal(confirmar: boolean) {
    this.modalCerrado.emit(confirmar)
    console.log(confirmar)
  }

  confirmarOpcion() {
    this.cerrarModal(this.optionSelected === 'Si')
  }
}
