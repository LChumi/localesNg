import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-tarjetas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tarjetas.component.html',
  styles: ``
})
export class TarjetasComponent {
  @Input() titulo?:      string;
  @Input() valor?:       number;
  @Input() aLink?:       string;
  @Input() svgIcon!:     string;
  @Input() routerLink?:  string;

  constructor() {
  }
}
