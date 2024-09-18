import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const username = sessionStorage.getItem('username');
  const router = inject(Router)

  if (!username){
    router.navigate(['/bar/auth/login']).then(r => console.log(r));
    return false
  }

  if (/admin/.test(username)){
    return true;
  } else {
    // Verificar si ya estás en la ruta de almacenes para evitar el bucle
    if (state.url !== '/bar/user/almacenes') {
      router.navigate(['/bar/user/almacenes']);
      return false; // Denegar acceso a rutas de admin
    }
    return true; // Permitir acceso a rutas de usuario
  }
};
