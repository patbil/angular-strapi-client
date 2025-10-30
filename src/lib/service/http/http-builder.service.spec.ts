import { TestBed } from '@angular/core/testing';
import { HttpBuilder } from './http-builder.service';

describe('HttpBuilder', () => {
   let httpBuilder: HttpBuilder;

   const authToken = 'testing-token';
   const url = 'https://testing-api';
   const path = '/users';

   beforeEach(() => {
      TestBed.configureTestingModule({});
      httpBuilder = TestBed.inject(HttpBuilder);
   });

   //  URL METHOD
   it('should be injected', () => {
      expect(httpBuilder).toBeTruthy();
   });

   it('should append path to base URL correctly', () => {
      expect(httpBuilder.url(url, path)).toBe(url + path);
   });

   it('should remove id placeholder if id is not provided', () => {
      expect(httpBuilder.url(url, `${path}/:id`, undefined)).toBe(url + path);
   });

   it('should normalize URL by removing extra slashes', () => {
      expect(httpBuilder.url(url, path + '/////////')).toBe(url + path);
   });

   it('should remove empty segments in the middle of path', () => {
      const extraPath = '/post';
      expect(httpBuilder.url(url, path + '//' + extraPath)).toBe(
         url + path + extraPath
      );
   });

   it('should replace :id placeholder with numeric id', () => {
      const id = 1;
      expect(httpBuilder.url(url, `${path}/:id`, id)).toBe(
         `${url}${path}/${id}`
      );
   });

   it('should replace :id placeholder with string id', () => {
      const id = '1';
      expect(httpBuilder.url(url, `${path}/:id`, id)).toBe(
         `${url}${path}/${id}`
      );
   });

   it('should encode special characters when replacing :id placeholder', () => {
      const id = 'testing@gmail.com';
      expect(httpBuilder.url(url, `${path}/:id`, id)).toBe(
         `${url}${path}/${encodeURIComponent(id)}`
      );
   });

   // HEADERS METHOD
   it('should return only default headers when no parameters provided', () => {
      const headers = httpBuilder.headers();
      expect(headers.keys().length).toBe(1);
      expect(headers.has('Content-Type')).toBe(true);
      expect(headers.get('Content-Type')).toBe('application/json');
   });

   it('should include Authorization header when authToken is provided', () => {
      const headers = httpBuilder.headers(authToken);
      expect(headers.keys().length).toBe(2);
      expect(headers.has('Authorization')).toBe(true);
      expect(headers.get('Authorization')).toBe(`Bearer ${authToken}`);
   });

   it('should not include Authorization header when authToken is empty string', () => {
      const headers = httpBuilder.headers('');
      expect(headers.keys().length).toBe(1);
      expect(headers.has('Authorization')).toBe(false);
      expect(headers.get('Content-Type')).toBe('application/json');
   });

   it('should include custom headers when customHeaders are provided', () => {
      const customHeaders = { testHeader: 'test-header' };
      const headers = httpBuilder.headers(undefined, customHeaders);
      expect(headers.keys().length).toBe(2);
      expect(headers.has('testHeader')).toBe(true);
      expect(headers.get('testHeader')).toBe(customHeaders.testHeader);
   });

   it('should allow custom headers to override Content-Type', () => {
      const customHeaders = { 'Content-Type': 'application/xml' };
      const headers = httpBuilder.headers(undefined, customHeaders);
      expect(headers.get('Content-Type')).toBe(customHeaders['Content-Type']);
   });

   it('should include Authorization and custom header when both are provided', () => {
      const customHeaders = { testHeader: 'test-header' };
      const headers = httpBuilder.headers(authToken, customHeaders);
      expect(headers.keys().length).toBe(3);
      expect(headers.has('testHeader')).toBe(true);
      expect(headers.has('Authorization')).toBe(true);
      expect(headers.get('testHeader')).toBe(customHeaders.testHeader);
      expect(headers.get('Authorization')).toBe(`Bearer ${authToken}`);
   });

   // PARAMS METHOD
});
