import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Load access token from localStorage on startup
    const stored = localStorage.getItem('access_token');
    if (stored) {
      this.accessToken = stored;
      this.isAuthenticated$.next(true);
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<{
        accessToken: string;
      }>('/api/auth/login', { username, password }, { withCredentials: true })
      .pipe(
        tap(res => {
          this.setAccessToken(res.accessToken);
        }),
      );
  }

  private setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
    this.isAuthenticated$.next(!!token);
  }

  setAccessTokenFromOAuth(token: string) {
    this.setAccessToken(token);
  }

  getAccessToken() {
    return this.accessToken;
  }

  refresh() {
    // Try to refresh using the refresh token cookie
    // If the refresh token is invalid/expired, the backend will return 401
    return this.http
      .post<{ accessToken: string }>('/api/auth/refresh', {}, { withCredentials: true })
      .pipe(
        tap(res => this.setAccessToken(res.accessToken)),
        catchError(err => {
          // If refresh fails (e.g., 401 Unauthorized), clear the stored token
          // This is expected if the refresh token cookie expired
          this.setAccessToken(null);
          throw err;
        }),
      );
  }

  logout() {
    return this.http.post('/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.setAccessToken(null);
        localStorage.removeItem('access_token');
      }),
    );
    2;
  }

  async silentRefreshOnStart(): Promise<void> {
    console.log('[AuthService] silentRefreshOnStart - access token exists:', !!this.accessToken);

    // Only attempt refresh if we have an access token stored
    // If no token exists, user hasn't logged in yet - skip refresh
    if (!this.accessToken) {
      console.log('[AuthService] No stored access token - skipping refresh on startup');
      return;
    }

    // Attempt to refresh the access token using the refresh token cookie
    try {
      await firstValueFrom(this.refresh());
      console.log('[AuthService] Silent refresh successful');
    } catch (e) {
      // Refresh failed - this is expected if refresh token expired
      // The token was already cleared in the refresh() catchError handler
      console.log('[AuthService] Silent refresh failed - user will need to login again');
    }
  }
}
