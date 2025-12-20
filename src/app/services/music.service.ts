import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AhaMusic } from '../models/aha-music.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private apiUrl = 'http://localhost:8080/api/music';

  constructor(private http: HttpClient) {}

  getAllMusic(): Observable<AhaMusic[]> {
    return this.http.get<AhaMusic[]>(`${this.apiUrl}/all`);
  }

  getMusicPage(page: number, size: number): Observable<PageResponse<AhaMusic>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PageResponse<AhaMusic>>(`${this.apiUrl}/page`, { params });
  }

  importCsv(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/import`);
  }

  cleanupDuplicates(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/cleanup`);
  }
}
