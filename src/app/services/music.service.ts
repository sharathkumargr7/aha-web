import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AhaMusic } from '../models/aha-music.model';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private apiUrl = 'http://localhost:8080/api/music';

  constructor(private http: HttpClient) {}

  getAllMusic(): Observable<AhaMusic[]> {
    return this.http.get<AhaMusic[]>(`${this.apiUrl}/all`);
  }

  importCsv(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/import`, {});
  }

  cleanupDuplicates(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/cleanup`, {});
  }
}
