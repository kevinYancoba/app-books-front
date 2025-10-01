import { User } from './user.interface';

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


export interface AuthResponse {
  user: User;
  acces_token: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
