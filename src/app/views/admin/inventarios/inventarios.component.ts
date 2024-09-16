import {Component, inject, OnInit} from '@angular/core';
import {formatDate, NgClass} from "@angular/common";
import {MovimientoInventario} from "../../../core/models/movimiento-inventario";
import {ReporteService} from "../../../core/services/reporte.service";
import {FormsModule} from "@angular/forms";
import {data} from "autoprefixer";

@Component({
  selector: 'app-inventarios',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './inventarios.component.html',
  styles: ``
})
export default class InventariosComponent implements OnInit{

  reporteService= inject(ReporteService)

  listaMovimientos: MovimientoInventario[]=[]

  fechaInicio:  any=formatDate(new Date, 'dd/MM/yyyy','en-US');
  fechaFin:     any=formatDate(new Date, 'dd/MM/yyyy','en-US');

  listaAlDia(){
    this.reporteService.movimientosDia().subscribe(
      data=> {
        this.actualizarMovimientos(data);
      }
    )
  }

  listarEntreFechas(){
    if(this.validarFechas()){
      this.reporteService.movimientosEntreFechas(this.fechaInicio, this.fechaFin).subscribe(
        data=> {
          this.actualizarMovimientos(data);
        }
      )
    }
  }

  buscar(){
    if(this.fechaFin==null && this.fechaInicio==null){
      this.listaAlDia();
      this.limpiar();
    }
    if(this.fechaInicio!=null && this.fechaFin!=null){
      this.listarEntreFechas();
      this.limpiar();
    }
  }

  actualizarMovimientos(mov: MovimientoInventario[]){
    this.listaMovimientos=mov;
  }

  limpiar(){
    this.fechaFin=      this.obtenerFechaActual();
  }

  obtenerFechaActual(): string {
    const fechaActual = new Date();
    // Formato YYYY-MM-DD
    const formattedDate = fechaActual.toISOString().slice(0, 10);
    return formattedDate;
  }

  formatearFechaFin() {
    // Si la fecha no está vacía y tiene el formato dd/mm/aaaa
    if (this.fechaFin && this.fechaFin.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const partes = this.fechaFin.split('/');
      this.fechaFin = `${partes[2]}-${partes[1]}-${partes[0]}`; // Formatear a yyyy-MM-dd
    }else{
      return;
    }
    this.fechaFin = formatDate(this.fechaFin , 'yyyy-MM-dd', 'en-US')
  }
  formatearFechaInicio() {
    // Si la fecha no está vacía y tiene el formato dd/mm/aaaa
    if (this.fechaInicio && this.fechaInicio.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const partes = this.fechaInicio.split('/');
      // Formatea la fecha al formato yyyy-MM-dd
      this.fechaInicio = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }else{
      return;
    }
    // Siempre formatea la fecha al formato yyyy-MM-dd después de la verificación
    this.fechaInicio = formatDate(this.fechaInicio, 'yyyy-MM-dd', 'en-US');
  }

  validarFechas(){
    const fechaInicioInput= new Date(this.fechaInicio)
    fechaInicioInput.setUTCHours(0,0,0,0);
    const fechaFinInput = new Date(this.fechaFin)
    fechaFinInput.setUTCHours(0,0,0,0);

    if(fechaInicioInput > fechaFinInput){
      return false;
    }
    return true
  }

  ngOnInit(): void {
    this.fechaFin=this.obtenerFechaActual();
    this.fechaInicio=this.obtenerFechaActual();
    this.listaAlDia()
  }

}
