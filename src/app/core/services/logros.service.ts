import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logro } from '../models/logros.model';

@Injectable({ providedIn: 'root' })
export class LogrosService {
  private apiUrl = 'http://localhost:8080/api/logros';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Logro[]> {
    return this.http.get<Logro[]>(`${this.apiUrl}/`);
  }

  getOne(id: string): Observable<Logro> {
    return this.http.get<Logro>(`${this.apiUrl}/${id}`);
  }

  create(body: { userId: string; nombre: string; iconoUrl: string }): Observable<Logro> {
    return this.http.post<Logro>(`${this.apiUrl}/`, body);
  }

  update(id: string, body: Partial<Logro>): Observable<Logro> {
    return this.http.put<Logro>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

