import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-youtube-callback',
  template: `
    <div>
      <h2>Authenticating with YouTube...</h2>
      <p *ngIf="error">Error: {{ error }}</p>
    </div>
  `,
})
export class YouTubeCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    // Parse access token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const error = urlParams.get('error');

    if (accessToken) {
      localStorage.setItem('youtube_access_token', accessToken);
      // Redirect to home or desired page
      this.router.navigate(['/']);
      // Notify other components about login status change
      window.dispatchEvent(new CustomEvent('youtube-login-status-changed'));
    } else if (error) {
      this.error = 'Authentication failed: ' + decodeURIComponent(error);
    } else {
      this.error = 'No access token found.';
    }
  }
}
