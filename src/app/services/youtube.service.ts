import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SongRequest {
  title: string;
  artists: string;
}

export interface PlaylistResponse {
  playlistUrl: string;
  videoCount: number;
  requestedCount: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class YouTubeService {
  private apiUrl = 'http://localhost:8080/api/youtube';

  constructor(private http: HttpClient) {}

  createPlaylist(songs: SongRequest[]): Observable<PlaylistResponse> {
    const token = localStorage.getItem('youtube_access_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<PlaylistResponse>(`${this.apiUrl}/create-playlist`, songs, { headers });
  }

  /**
   * Gets the YouTube login URL from the backend and redirects the user.
   */
  getLoginUrl(): Observable<string> {
    return this.http
      .get<{ authUrl: string }>(`${this.apiUrl}/login`)
      .pipe(map(response => response.authUrl));
  }
}
