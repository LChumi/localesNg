import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

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

  mostrarMenu(){
    this.menuAbierto=!this.menuAbierto
  }
  mostrarMenuMovil(){
    this.navbarAbierto=!this.navbarAbierto
  }
  logout(){
  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') ?? ''
  }
}
