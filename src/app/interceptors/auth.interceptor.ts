import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RefreshTokenResponse } from '../models/refresh-token-response.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Don't add backend token if request already has Authorization header (e.g., YouTube OAuth token)
    if (req.headers.has('Authorization')) {
      return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            return this.handle401Error(req, next);
          }
          return throwError(() => err);
        }),
      );
    }

    const token = this.auth.getAccessToken();

    const authReq = token
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => err);
      }),
    );
  }

  private handle401Error(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.tokenSubject.next(null);

      return this.auth.refresh().pipe(
        switchMap((res: RefreshTokenResponse) => {
          const newToken = res.accessToken;
          this.isRefreshing = false;
          this.tokenSubject.next(newToken);

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
          });

          return next.handle(retryReq);
        }),
        catchError((err: HttpErrorResponse) => {
          this.isRefreshing = false;
          // Don't call logout here, just let the error propagate
          // The auth guard will handle redirecting to login if needed
          console.log('[AuthInterceptor] Token refresh failed:', err);
          return throwError(() => err);
        }),
      );
    }

    return this.tokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token =>
        next.handle(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          }),
        ),
      ),
    );
  }
}
