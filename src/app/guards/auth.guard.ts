import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    console.log('[AuthGuard] canActivate called');

    // Always try to restore/refresh token on app start
    if (!this.auth.getAccessToken()) {
      console.log('[AuthGuard] No access token, attempting silent refresh');
      try {
        await this.auth.silentRefreshOnStart();
      } catch (e) {
        console.log('[AuthGuard] Silent refresh failed, redirecting to login:', e);
        this.router.navigate(['/login']);
        return false;
      }
    }

    const hasToken = !!this.auth.getAccessToken();
    console.log('[AuthGuard] Access token present:', hasToken);

    if (!hasToken) {
      console.log('[AuthGuard] No token after refresh attempt, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
