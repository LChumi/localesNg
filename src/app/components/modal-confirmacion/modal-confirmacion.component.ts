import { Component, input, output } from '@angular/core';

@Component({
  selector : 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmacion.component.html',
  styles: ``
})
export class ModalConfirmacionComponent {

  public storeSelected=input.required<string>();
  public modalCerrado=output<void>();

  opcionSelected!: string;

  constructor(){
    this.opcionSelected='';
  }

  confirmarOpcion(){
    if(this.opcionSelected ==='ventas'){
      console.log('Seleccionaste ventas');
    } else if (this.opcionSelected === 'ingreso-productos'){
      console.log('selecccionaste ingreso de productos ');
    }
    this.cerrarModal()
  }

  cerrarModal() {
    this.modalCerrado.emit(); // Emite el evento para cerrar el modal
  }

}
