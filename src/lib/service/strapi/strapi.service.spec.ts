import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StrapiService } from './strapi.service';
import { AuthService } from '../auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpBuilder } from '../http/http-builder.service';
import { STRAPI_CONFIG, StrapiConfig } from '../../model/strapi-config';
import { provideHttpClientTesting } from '@angular/common/http/testing';

@Injectable({ providedIn: 'root' })
class StrapiServiceInstance extends StrapiService<unknown> {
   path = '/test-entities';
}

describe('StrapiService', () => {
   let strapiService: StrapiServiceInstance;
   const mockConfig: StrapiConfig = {
      url: 'http://localhost:1337',
   };

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
            StrapiServiceInstance,
            HttpBuilder,
            AuthService,
            { provide: STRAPI_CONFIG, useValue: mockConfig },
         ],
      });
      strapiService = TestBed.inject(StrapiServiceInstance);
   });

   it('should be injected', () => {
      expect(strapiService).toBeTruthy();
   });

   it('should initialize with correct URL from config', () => {
      expect(strapiService['url']).toBe(mockConfig.url);
   });

   it('should have correct path', () => {
      expect(strapiService.path).toBe('/test-entities');
   });
});
