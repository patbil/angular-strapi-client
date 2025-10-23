import { HttpHeaders, HttpParams } from '@angular/common/http';
import { StrapiParams } from '../../model/strapi-params';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class HttpBuilder {
   url(url: string, path: string, id?: number | string): string {
      let buildedUrl = path;

      if (id != null) {
         const encodedId = encodeURIComponent(id);
         buildedUrl = path.replace(/:id/, encodedId);
      }

      buildedUrl =
         '/' +
         buildedUrl
            .split('/')
            .filter((s) => !!s && s.length && !s.startsWith(':'))
            .join('/');

      return url + buildedUrl;
   }

   headers(
      authToken?: string,
      customHeaders?: Record<string, string>
   ): HttpHeaders {
      let httpHeaders = new HttpHeaders({
         'Content-Type': 'application/json',
      });

      if (authToken) {
         httpHeaders = httpHeaders.set('Authorization', `Bearer ${authToken}`);
      }

      if (customHeaders) {
         Object.entries(customHeaders).forEach(([key, value]) => {
            httpHeaders = httpHeaders.set(key, value);
         });
      }

      return httpHeaders;
   }

   params(queryParams?: StrapiParams): HttpParams {
      let params = new HttpParams();

      if (!queryParams) {
         return params;
      }

      if (queryParams.populate) {
         if (Array.isArray(queryParams.populate)) {
            queryParams.populate.forEach((field) => {
               params = params.append('populate[]', field);
            });
         } else if (queryParams.populate === '*') {
            params = params.set('populate', '*');
         } else {
            params = this.buildNestedParams(
               params,
               'populate',
               queryParams.populate
            );
         }
      }

      if (queryParams.fields) {
         queryParams.fields.forEach((field) => {
            params = params.append('fields[]', String(field));
         });
      }

      if (queryParams.filters) {
         params = this.buildNestedParams(
            params,
            'filters',
            queryParams.filters
         );
      }

      if (queryParams.sort) {
         if (Array.isArray(queryParams.sort)) {
            queryParams.sort.forEach((field) => {
               params = params.append('sort[]', String(field));
            });
         } else {
            params = params.set('sort', String(queryParams.sort));
         }
      }

      if (queryParams.pagination) {
         Object.entries(queryParams.pagination).forEach(([key, value]) => {
            if (value !== undefined) {
               params = params.set(`pagination[${key}]`, value.toString());
            }
         });
      }

      if (queryParams.status) {
         params = params.set('status', queryParams.status);
      }

      if (queryParams.locale) {
         if (Array.isArray(queryParams.locale)) {
            queryParams.locale.forEach((loc) => {
               params = params.append('locale[]', loc);
            });
         } else {
            params = params.set('locale', queryParams.locale);
         }
      }

      return params;
   }

   private buildNestedParams(params: HttpParams, prefix: string, obj: any) {
      Object.entries(obj).forEach(([key, value]) => {
         if (value === null || value === undefined) {
            return;
         }

         const paramKey = `${prefix}[${key}]`;

         if (key === '$or' || key === '$and') {
            if (Array.isArray(value)) {
               value.forEach((item, index) => {
                  params = this.buildNestedParams(
                     params,
                     `${paramKey}[${index}]`,
                     item
                  );
               });
            }
         } else if (key === '$not') {
            params = this.buildNestedParams(params, paramKey, value);
         } else if (Array.isArray(value)) {
            if (value.every((item) => typeof item !== 'object')) {
               value.forEach((item) => {
                  params = params.append(`${paramKey}[]`, item.toString());
               });
            } else {
               value.forEach((item, index) => {
                  if (typeof item === 'object') {
                     params = this.buildNestedParams(
                        params,
                        `${paramKey}[${index}]`,
                        item
                     );
                  } else {
                     params = params.append(`${paramKey}[]`, item.toString());
                  }
               });
            }
         } else if (typeof value === 'object') {
            params = this.buildNestedParams(params, paramKey, value);
         } else {
            params = params.set(paramKey, value.toString());
         }
      });

      return params;
   }
}
