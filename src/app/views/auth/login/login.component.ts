import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import {UserRequest} from "../../../core/models/auth/user-request";

@Component({
  standalone: true,
  imports: [RouterOutlet,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export default class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;

  router=inject(Router);
  authService=inject(AuthService);
  fb=inject(FormBuilder);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  onSubmit(){
    this.submitted = true;
    if(this.loginForm.invalid){
      return
    }
    const  usuario= this.loginForm.get('usuario')?.value;
    const password= this.loginForm.get('password')?.value;
    const loginData: UserRequest = {
      username:usuario,
      password:password
    };

    this.authService.login(loginData).subscribe(
      user => {
        sessionStorage.setItem("username",user.username)
        this.goToAlmacen()
      }
    )
  }

  goToAlmacen(){
    this.loginForm.reset();
    this.router.navigate(['/bar', 'user' , 'almacenes'])
  }

}
