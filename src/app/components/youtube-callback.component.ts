import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-youtube-callback',
  template: `
    <div
      style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;"
    >
      <h2>Authentication Successful!</h2>
      <p *ngIf="!error">Redirecting to your music...</p>
      <p *ngIf="error" style="color: red;">Error: {{ error }}</p>
    </div>
  `,
})
export class YouTubeCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Parse tokens from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const backendAccessToken = urlParams.get('access_token');
    const youtubeToken = urlParams.get('youtube_token');
    const error = urlParams.get('error');

    if (backendAccessToken && youtubeToken) {
      // Store backend access token through AuthService
      this.authService.setAccessTokenFromOAuth(backendAccessToken);
      // Store YouTube API token separately
      localStorage.setItem('youtube_access_token', youtubeToken);
      console.log('[YouTubeCallback] Authentication successful, tokens stored');
      // Notify other components about login status change
      window.dispatchEvent(new CustomEvent('youtube-login-status-changed'));
      // Redirect to home - use replaceUrl to avoid keeping tokens in history
      setTimeout(() => {
        this.router.navigate(['/'], { replaceUrl: true });
      }, 1000);
    } else if (error) {
      this.error = 'Authentication failed: ' + decodeURIComponent(error);
    } else {
      this.error = 'Authentication failed: Missing tokens.';
    }
  }
}
