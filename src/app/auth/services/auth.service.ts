import { Injectable, signal, computed } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { BaseHttpService } from '../../core/services/base-http.service';
import { API_CONFIG } from '../../core/config/api.config';
import {
  LoginRequest,
  RegisterRequest,
  EmailResetRequest,
  PasswordResetRequest,
  AuthResponse,
  ApiResponse,
  User,
  AuthState
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'trackbook_token';
  private readonly USER_KEY = 'trackbook_user';

  // Signals para el estado reactivo
  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  // Computed signals para acceso fácil
  public readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  public readonly currentUser = computed(() => this.authState().user);
  public readonly isLoading = computed(() => this.authState().loading);
  public readonly error = computed(() => this.authState().error);

  constructor(private baseHttp: BaseHttpService) {
    this.initializeAuthState();
  }

  /**
   * Inicializa el estado de autenticación desde localStorage
   */
  private initializeAuthState(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.updateAuthState({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null
      });
    }
  }

  /**
   * Realiza el login del usuario
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.post<ApiResponse<AuthResponse>>(
      API_CONFIG.endpoints.auth.login,
      credentials
    ).pipe(
      map(response => response.data),
      tap(authResponse => {
        this.handleAuthSuccess(authResponse);
      }),
      catchError(error => {
        this.handleAuthError('Error al iniciar sesión');
        return throwError(() => error);
      })
    );
  }

  /**
   * Registra un nuevo usuario
   */
  register(userData: RegisterRequest): Observable<User> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.post<ApiResponse<User>>(
      API_CONFIG.endpoints.auth.register,
      userData
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleAuthError('Error al registrar usuario');
        return throwError(() => error);
      })
    );
  }

  /**
   * Solicita código de reset de contraseña
   */
  requestPasswordReset(email: EmailResetRequest): Observable<any> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.post<ApiResponse<any>>(
      API_CONFIG.endpoints.auth.codeReset,
      email
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleAuthError('Error al solicitar reset de contraseña');
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza la contraseña
   */
  updatePassword(passwordData: PasswordResetRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.baseHttp.post<ApiResponse<AuthResponse>>(
      API_CONFIG.endpoints.auth.updatePassword,
      passwordData
    ).pipe(
      map(response => response.data),
      tap(authResponse => {
        this.handleAuthSuccess(authResponse);
      }),
      catchError(error => {
        this.handleAuthError('Error al actualizar contraseña');
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.clearAuthData();
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.authState().token;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isUserAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  // Métodos privados de utilidad

  private handleAuthSuccess(authResponse: AuthResponse): void {
    this.storeAuthData(authResponse);
    this.updateAuthState({
      isAuthenticated: true,
      user: authResponse.user,
      token: authResponse.acces_token,
      loading: false,
      error: null
    });
  }

  private handleAuthError(message: string): void {
    this.updateAuthState({
      ...this.authState(),
      loading: false,
      error: message
    });
  }

  private setLoading(loading: boolean): void {
    this.updateAuthState({
      ...this.authState(),
      loading
    });
  }

  private clearError(): void {
    this.updateAuthState({
      ...this.authState(),
      error: null
    });
  }

  private updateAuthState(newState: AuthState): void {
    this.authState.set(newState);
  }

  private storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.acces_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
