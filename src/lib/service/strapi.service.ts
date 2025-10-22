import {
   HttpClient,
   HttpErrorResponse,
   HttpHeaders,
   HttpParams,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { StrapiParams } from "../model/strapi-params";
import { StrapiResponse } from "../model/strapi-response";
import { catchError, Observable, retry, throwError } from "rxjs";
import { STRAPI_CONFIG, StrapiConfig } from "../model/strapi-config";
import { StrapiRequestOptions } from "../model/strapi-request-options";

@Injectable({
   providedIn: "root",
})
export abstract class StrapiService<T> {
   private readonly url!: string;
   private authToken: string | undefined;
   abstract path: string;

   constructor(
      protected httpClient: HttpClient,
      @Inject(STRAPI_CONFIG) private strapiConfig: StrapiConfig
   ) {
      this.url = strapiConfig.url;
   }

   setAuthToken(token: string) {
      this.authToken = token;
   }

   clearAuthToken() {
      this.authToken = undefined;
   }

   get(
      id?: string | number,
      params?: StrapiParams<T>,
      options?: StrapiRequestOptions
   ) {
      const url = this.buildUrl(this.path, id);
      const headers = this.buildHeaders(options?.headers);
      const httpParams = this.buildHttpParams(params);

      return this.httpClient
         .get<StrapiResponse<T>>(url, {
            headers,
            params: httpParams,
            withCredentials: options?.withCredentials,
         })
         .pipe(retry({ count: 2, delay: 1000 }), catchError(this.handleError));
   }

   save(
      id: string | number | undefined,
      data: Partial<T>,
      options?: StrapiRequestOptions,
      method?: "POST" | "PUT" | "PATCH"
   ) {
      const url = this.buildUrl(this.path, id);
      const headers = this.buildHeaders(options?.headers);
      const httpMethod = method || (id ? "PUT" : "POST");

      return this.httpClient
         .request<StrapiResponse<T>>(httpMethod.toLowerCase(), url, {
            headers,
            body: { data },
            withCredentials: options?.withCredentials,
         })
         .pipe(catchError(this.handleError));
   }

   delete(id: number | string, options?: StrapiRequestOptions) {
      const url = this.buildUrl(this.path, id);
      const headers = this.buildHeaders(options?.headers);

      return this.httpClient
         .delete<StrapiResponse<T>>(url, {
            headers,
            withCredentials: options?.withCredentials,
         })
         .pipe(catchError(this.handleError));
   }

   private buildUrl(url: string, id?: number | string): string {
      let buildedUrl = url;

      if (id != null) {
         const encodedId = encodeURIComponent(id);
         buildedUrl = url.replace(/:id/, encodedId);
      }

      buildedUrl =
         "/" +
         buildedUrl
            .split("/")
            .filter((s) => !!s && s.length && !s.startsWith(":"))
            .join("/");

      return this.url + buildedUrl;
   }

   private buildHeaders(customHeaders?: Record<string, string>): HttpHeaders {
      let httpHeaders = new HttpHeaders({
         "Content-Type": "application/json",
      });

      if (this.authToken) {
         httpHeaders = httpHeaders.set(
            "Authorization",
            `Bearer ${this.authToken}`
         );
      }

      if (customHeaders) {
         Object.entries(customHeaders).forEach(([key, value]) => {
            httpHeaders = httpHeaders.set(key, value);
         });
      }

      return httpHeaders;
   }

   private buildHttpParams(queryParams?: StrapiParams<T>): HttpParams {
      let params = new HttpParams();

      if (!queryParams) {
         return params;
      }

      if (queryParams.populate) {
         if (Array.isArray(queryParams.populate)) {
            queryParams.populate.forEach((field) => {
               params = params.append("populate[]", field);
            });
         } else if (queryParams.populate === "*") {
            params = params.set("populate", "*");
         } else {
            params = this.buildNestedParams(
               params,
               "populate",
               queryParams.populate
            );
         }
      }

      if (queryParams.fields) {
         queryParams.fields.forEach((field) => {
            params = params.append("fields[]", String(field));
         });
      }

      if (queryParams.filters) {
         params = this.buildNestedParams(
            params,
            "filters",
            queryParams.filters
         );
      }

      if (queryParams.sort) {
         if (Array.isArray(queryParams.sort)) {
            queryParams.sort.forEach((field) => {
               params = params.append("sort[]", String(field));
            });
         } else {
            params = params.set("sort", String(queryParams.sort));
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
         params = params.set("status", queryParams.status);
      }

      if (queryParams.locale) {
         if (Array.isArray(queryParams.locale)) {
            queryParams.locale.forEach((loc) => {
               params = params.append("locale[]", loc);
            });
         } else {
            params = params.set("locale", queryParams.locale);
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

         if (key === "$or" || key === "$and") {
            if (Array.isArray(value)) {
               value.forEach((item, index) => {
                  params = this.buildNestedParams(
                     params,
                     `${paramKey}[${index}]`,
                     item
                  );
               });
            }
         } else if (key === "$not") {
            params = this.buildNestedParams(params, paramKey, value);
         } else if (Array.isArray(value)) {
            if (value.every((item) => typeof item !== "object")) {
               value.forEach((item) => {
                  params = params.append(`${paramKey}[]`, item.toString());
               });
            } else {
               value.forEach((item, index) => {
                  if (typeof item === "object") {
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
         } else if (typeof value === "object") {
            params = this.buildNestedParams(params, paramKey, value);
         } else {
            params = params.set(paramKey, value.toString());
         }
      });

      return params;
   }

   private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = "An unknown error occurred";

      if (error.error instanceof ErrorEvent) {
         errorMessage = `Error: ${error.error.message}`;
      } else {
         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

         if (error.error?.error) {
            const strapiError = error.error.error;
            errorMessage = `${strapiError.name}: ${strapiError.message}`;
         }
      }

      return throwError(() => error);
   }
}
