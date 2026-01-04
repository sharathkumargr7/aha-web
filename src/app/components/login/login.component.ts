import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YouTubeService } from '../../services/youtube.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  error: string | null = null;

  constructor(
    private youtubeService: YouTubeService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Auto-redirect to YouTube OAuth on page load
    this.loginWithYouTube();
  }

  loginWithYouTube() {
    this.loading = true;
    this.error = null;
    this.youtubeService.getLoginUrl().subscribe({
      next: authUrl => {
        // Redirect to YouTube OAuth
        window.location.href = authUrl;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to start authentication. Please try again.';
      },
    });
  }
}
