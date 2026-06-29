import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Add auth token to request headers
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq).pipe(
      catchError((error) => {
        // If 401 Unauthorized, logout and redirect to login
        if (error.status === 401) {
          authService.logout().subscribe(() => {
            router.navigate(['/login']);
          });
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};