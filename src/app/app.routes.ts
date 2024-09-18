import { Routes } from '@angular/router';
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: 'bar',
    children:[
      {
        path: 'auth',
        loadComponent: () => import('./layouts/auth/auth.component'),
        children:[
          {
            path:'login',
            loadComponent: () => import('./views/auth/login/login.component'),
            data: { Title: 'Login'}
          },
          {path:'',redirectTo:'login',pathMatch:'full'},
          {path:'**',redirectTo:'login',pathMatch:'full'}
        ]
      },
      {
        path:'user',
        loadComponent: () => import('./layouts/user/user.component'),
        canActivateChild:[authGuard],
        children:[
          {
            path: 'almacenes',
            title: 'Almacenes',
            loadComponent: () => import('./views/user/almacenes/almacenes.component')
          },
          {
            path: 'productos',
            title: 'Productos',
            loadComponent: () => import('./views/user/productos/productos.component')
          },
          {
            path: 'facturacion',
            title: 'Facturacion',
            loadComponent: () => import('./views/user/facturacion/facturacion.component')

          },
          {path: '',redirectTo: 'almacenes',pathMatch: 'full'},
          {path: '**',redirectTo: 'almacenes',pathMatch: 'full'}
        ]
      },
      {
        path: 'admin',
        loadComponent: () => import('./layouts/admin/admin.component'),
        canActivateChild:[authGuard],
        children:[
          {
            path: 'usuarios',
            title: 'Usuarios',
            loadComponent: () => import('./views/admin/usuarios/usuarios.component')
          },
          {
            path: 'clientes',
            title: 'Clientes',
            loadComponent: () => import('./views/admin/clientes/clientes.component')
          },
          {
            path: 'almacenes',
            title: 'Almacenes',
            loadComponent: () => import('./views/admin/almacenes/almacenes.component')
          },
          {
            path: 'productos',
            title: 'Productos',
            loadComponent: () => import('./views/admin/productos/productos.component')
          },
          {
            path: 'inventarios',
            title: 'Inventrios',
            loadComponent: () => import('./views/admin/inventarios/inventarios.component')
          },
          {
            path: 'dashboard',
            title: 'Dashboard',
            loadComponent: () => import('./views/admin/dashboard/dashboard.component')
          },
          {
            path: 'proveedores',
            title: 'Proveedores',
            loadComponent: () => import('./views/admin/proveedores/proveedores.component')
          },
          {
            path: 'ventas',
            title: 'Ventas',
            loadComponent: () => import('./views/admin/ventas/ventas.component')
          },
          {path: '', redirectTo: 'dashboard',pathMatch: 'full'},
          {path: '**', redirectTo: 'dashboard',pathMatch: 'full'},
        ]
      }
    ]
  },
    { path:'',redirectTo:'bar/auth',pathMatch:'full'},
    { path:'**',redirectTo:'bar/auth',pathMatch:'full'}
];
