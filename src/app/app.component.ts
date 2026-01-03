import { Component, OnInit } from '@angular/core';
import { YouTubeService } from './services/youtube.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary">
        <span>Aha Music Grid</span>
        <span class="spacer"></span>
        <button *ngIf="!isLoggedIn" mat-raised-button color="accent" (click)="loginWithYouTube()">
          Login with YouTube
        </button>
        <button *ngIf="isLoggedIn" mat-button (click)="logout()">Logout</button>
      </mat-toolbar>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }

      .content {
        flex: 1;
        overflow: hidden;
        padding: 20px;
      }

      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private youtubeService: YouTubeService,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private router: Router,
  ) {
    this.auth.isAuthenticated$.subscribe(v => (this.isLoggedIn = v));
  }

  ngOnInit() {
    this.checkLoginStatus();
    // Listen for login status changes from other components
    window.addEventListener('youtube-login-status-changed', () => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    // prefer auth service state; fallback to the youtube token for backwards compatibility
    this.isLoggedIn =
      !!this.auth.getAccessToken() || !!localStorage.getItem('youtube_access_token');
  }

  loginWithYouTube() {
    this.youtubeService.getLoginUrl().subscribe(
      url => {
        if (url) {
          window.location.href = url;
        } else {
          this.snackBar.open('Failed to get YouTube login URL', 'Close', { duration: 3000 });
        }
      },
      () => {
        this.snackBar.open('Error during YouTube login', 'Close', { duration: 3000 });
      },
    );
  }

  async logout() {
    try {
      await firstValueFrom(this.auth.logout());
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('youtube_access_token');
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
    // Notify other components about login status change
    window.dispatchEvent(new CustomEvent('youtube-login-status-changed'));
    this.router.navigate(['/login']);
  }
}
