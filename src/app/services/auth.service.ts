import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

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
    this.isAuthenticated$.next(!!token);
  }

  getAccessToken() {
    return this.accessToken;
  }

  refresh() {
    return this.http
      .post<{ accessToken: string }>('/api/auth/refresh', {}, { withCredentials: true })
      .pipe(tap(res => this.setAccessToken(res.accessToken)));
  }

  logout() {
    return this.http.post('/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.setAccessToken(null);
      }),
    );
  }

  async silentRefreshOnStart(): Promise<void> {
    try {
      await firstValueFrom(this.refresh());
    } catch (e) {
      this.setAccessToken(null);
    }
  }
}
