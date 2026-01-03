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
    if (this.auth.getAccessToken()) return true;
    try {
      await this.auth.silentRefreshOnStart();
      return !!this.auth.getAccessToken();
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
