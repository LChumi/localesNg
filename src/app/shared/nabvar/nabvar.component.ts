import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-nabvar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './nabvar.component.html',
  styles: ``
})
export class NabvarComponent implements OnInit  {

  menuAbierto:    boolean = false;
  navbarAbierto:  boolean = false;
  username: any;
  router=inject(Router);

  mostrarMenu(){
    this.menuAbierto=!this.menuAbierto
  }
  mostrarMenuMovil(){
    this.navbarAbierto=!this.navbarAbierto
  }
  logout(){
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/bar', 'auth', 'login'])
  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') ?? ''
  }
}
