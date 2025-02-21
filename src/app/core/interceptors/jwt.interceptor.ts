import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }

  //if (!token) {
  //  console.error('Token não encontrado');
  //  return throwError(() => new Error('Token não encontrado'));
  //}

  const request = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(request);
};
