import { retry, map } from 'rxjs';
import { normalize } from '../normalize-response';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StrapiParams } from '../../model/strapi-params';
import { HttpBuilder } from '../http/http-builder.service';
import { STRAPI_CONFIG, StrapiConfig } from '../../model/strapi-config';
import { StrapiRequestOptions } from '../../model/strapi-request-options';
import { StrapiObservable, StrapiResponse } from '../../model/strapi-response';

@Injectable({
   providedIn: 'root',
})
export abstract class StrapiService<T> {
   protected readonly url!: string;
   abstract path: string;

   constructor(
      protected readonly httpClient: HttpClient,
      private readonly httpBuilder: HttpBuilder,
      private readonly authService: AuthService,
      @Inject(STRAPI_CONFIG) private readonly strapiConfig: StrapiConfig
   ) {
      this.url = strapiConfig.url;
   }

   get<U extends string | number | undefined = undefined>(
      id?: U,
      params?: StrapiParams<T>,
      options?: StrapiRequestOptions
   ) {
      const url = this.httpBuilder.url(this.url, this.path, id);
      const httpParams = this.httpBuilder.params(params);
      const headers = this.httpBuilder.headers(
         this.authService.getAuthToken(),
         options?.headers
      );

      return this.httpClient
         .get<StrapiResponse>(url, {
            headers,
            params: httpParams,
            withCredentials: options?.withCredentials,
         })
         .pipe(
            normalize(typeof id !== 'undefined'),
            retry({ count: 2, delay: 1000 })
         ) as StrapiObservable<T, U>;
   }

   save(
      id: string | number | undefined,
      data: Partial<T>,
      options?: StrapiRequestOptions,
      method?: 'POST' | 'PUT' | 'PATCH'
   ) {
      const url = this.httpBuilder.url(this.url, this.path, id);
      const headers = this.httpBuilder.headers(
         this.authService.getAuthToken(),
         options?.headers
      );
      const httpMethod = method || (id ? 'PUT' : 'POST');
      return this.httpClient.request<StrapiResponse<T>>(
         httpMethod.toLowerCase(),
         url,
         {
            headers,
            body: { data },
            withCredentials: options?.withCredentials,
         }
      );
   }

   delete(id: number | string, options?: StrapiRequestOptions) {
      const url = this.httpBuilder.url(this.url, this.path, id);
      const headers = this.httpBuilder.headers(
         this.authService.getAuthToken(),
         options?.headers
      );

      return this.httpClient.delete<void>(url, {
         headers,
         withCredentials: options?.withCredentials,
      });
   }
}
