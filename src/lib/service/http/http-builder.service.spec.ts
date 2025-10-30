import { TestBed } from '@angular/core/testing';
import { HttpBuilder } from './http-builder.service';
import { StrapiFilter } from '../../model/strapi-filters';

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
   it('should return empty HttpParams when no queryParams provided', () => {
      const params = httpBuilder.params();
      expect(params.keys().length).toBe(0);
   });

   it('should return empty HttpParams when queryParams is empty object', () => {
      const params = httpBuilder.params({});
      expect(params.keys().length).toBe(0);
   });

   it('should handle multiple parameter types together', () => {
      const params = httpBuilder.params({
         locale: 'pl',
         status: 'draft',
         sort: 'title:asc',
         fields: ['name', 'email'],
         pagination: { page: 1, pageSize: 10 },
      });

      expect(params.get('locale')).toBe('pl');
      expect(params.get('status')).toBe('draft');
      expect(params.get('sort')).toBe('title:asc');
      expect(params.get('fields[]')).toBe('name');
      expect(params.get('pagination[page]')).toBe('1');
      expect(params.get('pagination[pageSize]')).toBe('10');
   });

   it('should handle pagination with all parameters', () => {
      const params = httpBuilder.params({
         pagination: { page: 2, pageSize: 50, start: 50, limit: 50 },
      });
      expect(params.get('pagination[page]')).toBe('2');
      expect(params.get('pagination[pageSize]')).toBe('50');
      expect(params.get('pagination[start]')).toBe('50');
      expect(params.get('pagination[limit]')).toBe('50');
   });

   it('should skip undefined pagination values', () => {
      const params = httpBuilder.params({
         pagination: { page: 1, pageSize: undefined },
      });
      expect(params.get('pagination[page]')).toBe('1');
      expect(params.has('pagination[pageSize]')).toBe(false);
   });

   it('should handle populate as wildcard', () => {
      const params = httpBuilder.params({ populate: '*' });
      expect(params.get('populate')).toBe('*');
   });

   it('should handle populate as array with single field', () => {
      const populateArray = ['name'];
      const params = httpBuilder.params({ populate: populateArray });
      expect(params.getAll('populate[]')).toEqual(populateArray);
   });

   it('should handle populate as array with multiple fields', () => {
      const populateArray = ['name', 'author', 'book'];
      const params = httpBuilder.params({ populate: populateArray });
      expect(params.getAll('populate[]')).toEqual(populateArray);
   });

   it('should handle populate as nested object with single level', () => {
      const params = httpBuilder.params({
         populate: { author: { fields: ['name'] } },
      });
      expect(params.getAll('populate[author][fields][]')).toEqual(['name']);
   });

   it('should handle populate as nested object with multiple levels', () => {
      const params = httpBuilder.params({
         populate: {
            author: {
               fields: ['name'],
               populate: {
                  book: { fields: ['name'] },
               },
            },
         },
      });

      expect(params.getAll('populate[author][fields][]')).toEqual(['name']);
      expect(
         params.getAll('populate[author][populate][book][fields][]')
      ).toEqual(['name']);
   });

   it('should handle simple filter with string value', () => {
      const params = httpBuilder.params({ filters: { title: 'Testing' } });
      expect(params.get('filters[title]')).toBe('Testing');
   });

   it('should handle simple filter with number value', () => {
      const params = httpBuilder.params({ filters: { views: 1000 } });
      expect(params.get('filters[views]')).toBe('1000');
   });

   it('should handle multiple simple filters', () => {
      const params = httpBuilder.params({
         filters: { views: 1000, title: 'Testing' },
      });
      expect(params.get('filters[views]')).toBe('1000');
      expect(params.get('filters[title]')).toBe('Testing');
   });

   it('should handle nested object filters', () => {
      const params = httpBuilder.params({
         filters: {
            author: {
               book: 'Potop',
            },
         },
      });
      expect(params.get('filters[author][book]')).toBe('Potop');
   });

   it('should handle $not operator', () => {
      const params = httpBuilder.params({
         filters: { $not: { title: 'Excluded' } },
      });

      expect(params.get('filters[$not][title]')).toBe('Excluded');
   });

   it('should handle complex filter combinations', () => {
      const params = httpBuilder.params({
         filters: {
            published: true,
            $not: {
               name: 'Stroustrup',
               $and: [{ title: 'C++' }],
            },
            $or: [
               { title: { $contains: 'Angular' } },
               { tags: { $in: ['Strapi'] } },
            ],
            $and: [
               { name: { $contains: 'Sienkiewicz' } },
               { books: { $contains: 'Potop' } },
            ],
         } as StrapiFilter<any>,
      });
      expect(params.get('filters[published]')).toBe('true');
      expect(params.get('filters[$not][name]')).toBe('Stroustrup');
      expect(params.get('filters[$not][$and][0][title]')).toBe('C++');
      expect(params.get('filters[$or][0][title][$contains]')).toBe('Angular');
      expect(params.getAll('filters[$or][1][tags][$in][]')).toEqual(['Strapi']);
      expect(params.get('filters[$and][0][name][$contains]')).toBe(
         'Sienkiewicz'
      );
      expect(params.get('filters[$and][1][books][$contains]')).toBe('Potop');
   });
});
