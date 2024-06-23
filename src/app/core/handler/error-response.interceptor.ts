import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  return next(req).pipe(catchError((e: HttpErrorResponse) => {
    if(e) {
      switch (e.status){
        case 400:
          const errors = e.error.errors
          if(errors) {
            const modalStateErrors =[]
            for(const key in errors)
              errors[key] && modalStateErrors.push(errors[key])
            throw modalStateErrors.flat
          } else if (typeof e.error === 'object'){
            toastr.error(e.error, `${e.status}`)
          }
          break
          case 403:
            toastr.error('No tienes permitido hacer esto.', 'No autorizado')
            break
            case 401:
              toastr.error(
                e.error?.title, e.error ?? 'No Autorizado',
              )
              break
              case 404:
                toastr.error(e.error, 'No se encontro')
                break
                case 500:
                  toastr.error(e.error)
                  break
                  default:
                    toastr.error('Se produjo un error extraño', '????')
      }
    }
    return throwError(e)
  }));
};
