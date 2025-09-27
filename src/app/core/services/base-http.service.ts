import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  observe?: 'body';
  responseType?: 'json';
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  private readonly baseUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Construye la URL completa para un endpoint
   */
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Realiza una petición GET
   */
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), options);
  }

  /**
   * Realiza una petición POST
   */
  post<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * Realiza una petición PUT
   */
  put<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * Realiza una petición DELETE
   */
  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), options);
  }

  /**
   * Realiza una petición PATCH
   */
  patch<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body, options);
  }
}
