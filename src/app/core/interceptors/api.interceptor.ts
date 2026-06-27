import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UiService } from '../services/ui.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private uiService: UiService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.uiService.showLoading();

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
          if (error.status === 0) {
            errorMsg = 'Network Error. Please check your connection.';
          } else if (error.status >= 500) {
            errorMsg = 'Server Error. Please try again later.';
          }
        }
        this.uiService.showToast(errorMsg, 'danger');
        return throwError(() => error);
      }),
      finalize(() => {
        this.uiService.hideLoading();
      })
    );
  }
}
