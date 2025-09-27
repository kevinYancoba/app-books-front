import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { BaseHttpService } from '../../core/services/base-http.service';
import { API_CONFIG } from '../../core/config/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, BaseHttpService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockLoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockAuthResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        last_name: 'User',
        created_at: new Date()
      },
      acces_token: 'mock-jwt-token'
    };

    const mockApiResponse = {
      statusCode: 200,
      message: 'Success',
      data: mockAuthResponse
    };

    service.login(mockLoginRequest).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()).toEqual(mockAuthResponse.user);
    });

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockApiResponse);
  });

  it('should logout successfully', () => {
    // Simular usuario logueado
    localStorage.setItem('trackbook_token', 'mock-token');
    localStorage.setItem('trackbook_user', JSON.stringify({ id: '1', email: 'test@example.com' }));
    
    service.logout();
    
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('trackbook_token')).toBeNull();
    expect(localStorage.getItem('trackbook_user')).toBeNull();
  });

  it('should register successfully', () => {
    const mockRegisterRequest = {
      name: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test',
      last_name: 'User',
      created_at: new Date()
    };

    const mockApiResponse = {
      statusCode: 201,
      message: 'User created',
      data: mockUser
    };

    service.register(mockRegisterRequest).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(mockApiResponse);
  });
});
