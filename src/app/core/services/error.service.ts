
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ErrorHandler } from '../interfaces/error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  public errors!: ErrorHandler[];

  constructor() {}

  public handleError(error?: HttpErrorResponse): void {
    if (error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Erro do lado do servidor
        errorMessage = `Erro ${error.status}: ${error.message}`;
      }
      
      this.errors.push({ error: errorMessage })
    }

    // return throwError(() => new Error(errorMessage));
  }
}
