import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NabvarComponent} from "../../shared/nabvar/nabvar.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet,NabvarComponent],
  templateUrl: './admin.component.html',
  styles: ``
})
export default class AdminComponent {

}
