import { Routes } from '@angular/router';

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
        children:[
          {
            path: 'almacenes',
            title: 'Almacenes',
            loadComponent: () => import('./views/user/almacenes/almacenes.component')
          },
          {path: '',redirectTo: 'almacenes',pathMatch: 'full'},
          {path: '**',redirectTo: 'almacenes',pathMatch: 'full'}
        ]
      }
    ]
  },
    { path:'',redirectTo:'bar/auth',pathMatch:'full'},
    { path:'**',redirectTo:'bar/auth',pathMatch:'full'}
];
