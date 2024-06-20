import { Title } from '@angular/platform-browser';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'app',
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
    { path:'',redirectTo:'app/login',pathMatch:'full'},
    { path:'**',redirectTo:'app/login',pathMatch:'full'}
];
