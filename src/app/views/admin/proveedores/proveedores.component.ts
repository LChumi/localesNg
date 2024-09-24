import {Component, inject, OnInit} from '@angular/core';
import {ProveedorService} from "../../../core/services/proveedor.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Proveedor} from "../../../core/models/proveedor";

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './proveedores.component.html',
  styles: ``
})
export default class ProveedoresComponent implements OnInit {

  proveedorService = inject(ProveedorService)
  toastr           = inject(ToastrService)
  fb               = inject(FormBuilder)

  proveedorForm!:     FormGroup;
  editProveedorForm!: FormGroup;

  proveedor:        Proveedor={} as Proveedor;
  proveedorSelect:  Proveedor={} as Proveedor;

  listaProveedor:   Proveedor[]=[];

  vistaProveedor: boolean = false;
  editProveedor:  boolean = false;

  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      nombreProv: ['', Validators.required],
      cedulaRucProv: ['', Validators.required],
      telefonoProv: '',
      correoProv: '',
      direccionProv: '',
    })
    this.editProveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      cedulaRuc: ['', Validators.required],
      telefono: '',
      correo: '',
      direccion: '',
    })
    this.listarProveedores()
  }

  detalles(proveedor: Proveedor){
    this.editProveedor=!this.editProveedor
    this.editProveedorForm.patchValue({
      nombre: proveedor.nombre,
      cedulaRuc: proveedor.cedulaRuc,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
    })
  }

  agregarNuevoProveedor(){
    if (this.proveedorForm.invalid){
      this.toastr.warning('Llene los campos en el formulario')
      return;
    }
    const nombreValue= this.proveedorForm.get('nombreProv')?.value;
    const cedulaRucValue= this.proveedorForm.get('cedulaRucProv')?.value;
    const telefonoValue= this.proveedorForm.get('telefonoProv')?.value;
    const correoValue= this.proveedorForm.get('correoProv')?.value;
    const direccionValue= this.proveedorForm.get('direccionProv')?.value;

    const nombre = typeof nombreValue === 'string' ? nombreValue.toUpperCase() : nombreValue;

    const nuevoProveedor: Proveedor = {
      id: 0,
      nombre: nombre,
      cedulaRuc: cedulaRucValue,
      telefono: telefonoValue,
      email: correoValue,
      direccion: direccionValue,
    }

    this.proveedorService.crear(nuevoProveedor).subscribe(
      data => {
        this.toastr.success('Proveedor Guardado');
        this.listarProveedores()
        this.vistaProveedor=!this.vistaProveedor
        this.proveedorForm.reset()
      }
    )
  }

  editarProveedor(proveedorid:number){
    if (this.editProveedorForm.invalid){
      this.toastr.warning('Llene los campos en el formulario')
      return;
    }
    const nombreValue= this.editProveedorForm.get('nombre')?.value;
    const cedulaRucValue= this.editProveedorForm.get('cedulaRuc')?.value;
    const telefonoValue= this.editProveedorForm.get('telefono')?.value;
    const correoValue= this.editProveedorForm.get('correo')?.value;
    const direccionValue= this.editProveedorForm.get('direccion')?.value;

    const nombre = typeof nombreValue === 'string' ? nombreValue.toUpperCase() : nombreValue;

    const proveedor: Proveedor = {
      id: 0,
      nombre: nombre,
      cedulaRuc: cedulaRucValue,
      telefono: telefonoValue,
      email: correoValue,
      direccion: direccionValue,
    }

    this.proveedorService.actualizar(proveedorid, proveedor).subscribe(
      prov => {
        this.toastr.show('Proveedor actualizado')
        this.editProveedor=!this.editProveedor
        this.listarProveedores()
        this.editProveedorForm.reset()
      }
    )
  }

  listarProveedores(){
    this.proveedorService.listar().subscribe(
      proveedores=> {
        this.listaProveedor = proveedores
      }
    )
  }

  cerrarVentanaAddProv(){
    this.vistaProveedor=false;
  }
  cerrarVentanaEditProv(){
    this.editProveedor=false;
  }

}
