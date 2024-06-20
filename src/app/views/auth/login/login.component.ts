import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export default class LoginComponent {

}
