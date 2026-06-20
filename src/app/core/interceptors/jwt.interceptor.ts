import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.accessToken;

    if (isLoggedIn) {
      let cloneConfig: any = {
        setHeaders: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      };

      if (currentUser.tenantId) {
        cloneConfig.setHeaders['X-Tenant-ID'] = currentUser.tenantId.toString();
      }

      request = request.clone(cloneConfig);
    }

    return next.handle(request);
  }
}
