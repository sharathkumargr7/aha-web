import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SongRequest {
  title: string;
  artists: string;
}

export interface PlaylistResponse {
  playlistUrl: string;
  playlistId?: string;
  videoCount: number;
  requestedCount: number;
  addedCount?: number;
  alreadyAddedCount?: number;
  notFoundCount?: number;
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
      headers = headers.set('X-YouTube-Token', token);
    }

    // Include stored playlist ID if available
    const storedPlaylistId = this.getStoredPlaylistId();
    let params = new HttpParams();
    if (storedPlaylistId) {
      params = params.set('playlistId', storedPlaylistId);
    }

    return this.http.post<PlaylistResponse>(`${this.apiUrl}/create-playlist`, songs, {
      headers,
      params,
    });
  }

  /**
   * Gets the stored playlist ID for the current user
   */
  getStoredPlaylistId(): string | null {
    return localStorage.getItem('youtube_playlist_id');
  }

  /**
   * Stores the playlist ID for the current user
   */
  storePlaylistId(playlistId: string): void {
    localStorage.setItem('youtube_playlist_id', playlistId);
  }

  /**
   * Clears the stored playlist ID (useful when switching accounts)
   */
  clearStoredPlaylistId(): void {
    localStorage.removeItem('youtube_playlist_id');
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
