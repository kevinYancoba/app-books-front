import { User } from './user.interface';

// Request interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface EmailResetRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
  password: string;
  code: string;
}

export interface CodeResetResponse {
  message: string;
  email: string;
  expiresIn: string;
}

// Response interfaces
export interface AuthResponse {
  user: User;
  acces_token: string; // Mantengo el typo del backend para consistencia
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
