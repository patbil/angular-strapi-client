import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';

describe('AuthService', () => {
   const token = 'auth-token';
   let authService: AuthService;

   beforeEach(() => {
      TestBed.configureTestingModule({});
      authService = TestBed.inject(AuthService);
   });

   it('should be injected', () => {
      expect(authService).toBeTruthy();
   });

   it('should be singleton across injection', () => {
      const service2 = TestBed.inject(AuthService);
      authService.setAuthToken(token);
      expect(service2.getAuthToken()).toBe(token);
   });

   it('should set token', () => {
      authService.setAuthToken(token);
      expect(authService.getAuthToken()).toBe(token);
   });

   it('should handle empty string', () => {
      const emptyToken = '';
      authService.setAuthToken(emptyToken);
      expect(authService.getAuthToken()).toBe(emptyToken);
   });

   it('should override existing token', () => {
      const newToken = 'new-auth-token';
      authService.setAuthToken(token);
      authService.setAuthToken(newToken);
      expect(authService.getAuthToken()).toBe(newToken);
   });

   it('should clear token', () => {
      authService.setAuthToken(token);
      authService.clearAuthToken();
      expect(authService.getAuthToken()).toBeUndefined();
   });

   it('should return undefined if not set', () => {
      expect(authService.getAuthToken()).toBeUndefined();
   });
});
