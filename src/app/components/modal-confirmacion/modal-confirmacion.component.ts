import {Component, inject, input, output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector : 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmacion.component.html',
  styles: ``
})
export class ModalConfirmacionComponent {

  storeSelected=input<string>();
  public modalCerrado=output<void>();

  opcionSelected!: string;
  router =inject(Router)

  constructor(){
    this.opcionSelected='';
  }

  confirmarOpcion(){
    if(this.opcionSelected ==='ventas'){
      console.log('Seleccionaste ventas');
      this.router.navigate(["/bar/user/facturacion"]).then(r => {console.log('Venta')} )
    } else if (this.opcionSelected === 'ingreso-productos'){
      console.log('selecccionaste ingreso de productos ');
      this.router.navigate(["/bar/user/productos"]).then(r => {} )
    }
    this.cerrarModal()
  }

  cerrarModal() {
    this.modalCerrado.emit(); // Emite el evento para cerrar el modal
  }

}
