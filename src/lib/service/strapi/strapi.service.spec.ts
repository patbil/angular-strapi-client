import {
   HttpTestingController,
   provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StrapiService } from './strapi.service';
import { AuthService } from '../auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpBuilder } from '../http/http-builder.service';
import { STRAPI_CONFIG, StrapiConfig } from '../../model/strapi-config';
import {
   Article,
   createMockArticle,
   createMockResponse,
   mockResponse,
} from './mock-data';

@Injectable({ providedIn: 'root' })
class StrapiServiceInstance extends StrapiService<Article> {
   path = '/test-entities';
}

describe('StrapiService', () => {
   let strapiService: StrapiServiceInstance;
   let httpMock: HttpTestingController;
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
      httpMock = TestBed.inject(HttpTestingController);
   });

   afterEach(() => {
      httpMock.verify();
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

   it('should fetch all articles', () => {
      strapiService.get().subscribe((result) => {
         expect(result.data.length).toBe(2);
         expect(result.data[1].title).toBe('Strapi Guide');
      });

      const request = httpMock.expectOne(mockConfig.url + strapiService.path);
      expect(request.request.method).toBe('GET');
      request.flush(mockResponse);
   });

   it('should fetch article with filters', () => {
      strapiService
         .get(undefined, {
            filters: {
               author: 'John',
            },
         })
         .subscribe((result) => {
            expect(result.data.length).toBe(1);
            expect(result.meta?.pagination?.total).toBe(1);
            expect(result.data.at(0)?.author).toBe('John');
         });

      const request = httpMock.expectOne(
         (request) =>
            request.url === mockConfig.url + strapiService.path &&
            request.params.get('filters[author]') === 'John'
      );

      request.flush(
         createMockResponse([mockResponse.data[0]], {
            total: 1,
         })
      );
   });

   it('should save new article', () => {
      const newArticle = createMockArticle({
         id: 3,
         documentId: 'doc-3',
         author: 'Bil',
         content: 'Introduction to Strapi Testing',
      });

      strapiService.save(undefined, newArticle).subscribe((result) => {
         expect(result.data.length).toBe(3);
         expect(result.data[2].author).toBe('Bil');
         expect(result.meta?.pagination?.total).toBe(3);
      });

      const request = httpMock.expectOne(mockConfig.url + strapiService.path);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({ data: newArticle });
      request.flush(
         createMockResponse([...mockResponse.data, newArticle], { total: 3 })
      );
   });

   it('should delete article', () => {
      strapiService.delete(1).subscribe((result) => {
         expect(result.data.length).toBe(1);
         expect(result.data[0].author).toBe('Jane');
      });

      const request = httpMock.expectOne(mockConfig.url + strapiService.path);
      expect(request.request.method).toBe('DELETE');
      request.flush(createMockResponse([mockResponse.data[1]], { total: 1 }));
   });

   it('should be handle error', () => {
      strapiService.get().subscribe({
         next: () => {},
         error: (error) => expect(error.status).toBe(404),
      });

      const request = httpMock.expectOne(mockConfig.url + strapiService.path);
      request.flush('Not found', { status: 404, statusText: 'Not Found' });
   });
});
