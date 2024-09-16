import {Component, inject, OnInit} from '@angular/core';
import {TarjetasComponent} from "../../../components/tarjetas/tarjetas.component";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {VentaService} from "../../../core/services/venta.service";
import {UsuarioService} from "../../../core/services/usuario.service";
import {ProductoService} from "../../../core/services/producto.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TarjetasComponent ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent implements OnInit{

  sanitizer=inject(DomSanitizer);
  ventaService=inject(VentaService);
  usuarioService=inject(UsuarioService);
  productoService=inject(ProductoService)

  usuariosCount:     number = 0;
  cargaTarjeta:      boolean = false;
  totales:           number = 0;
  totalUsuarios:     number =0;
  totalProductos:    number =0;

  ngOnInit(): void {
    this.getNroComprobantes()
    this.getNroUsuarios()
    this.getProdcutos()
    this.svgUsuario = this.getSanitiedSvgUsuario();
    this.svgComprobante = this.getSanitiedSvgComprobante();
    this.svgDinero = this.getSanitiedSvgDinero();
  }

  getNroComprobantes(){
    this.ventaService.totalesDia().subscribe(
      total => {
        this.totales = total;
        console.log(total)
        this.cargaTarjeta = true;
      }
    )
  }

  getNroUsuarios(){
    this.usuarioService.listar().subscribe(
      listaUsuarios => {
        this.totalUsuarios = listaUsuarios.length;
      }
    )
  }

  getProdcutos(){
    this.productoService.listar().subscribe(
      productos => {
        this.totalProductos = productos.length;
      }
    )
  }

  svgUsuario: any = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clip-rule="evenodd"/>
</svg>`
  svgComprobante: any = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"/>
</svg>`
  svgDinero: any = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
</svg>`

  getSanitiedSvgUsuario(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.svgUsuario)
  }
  getSanitiedSvgComprobante(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.svgComprobante)
  }
  getSanitiedSvgDinero(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.svgDinero)
  }

  routerLinkComprobnates: any = ['/bar', 'admin', 'inventarios']
  routerLinkUsuarios: any = ['/bar', 'admin', 'usuarios']
}
