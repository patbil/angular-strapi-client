import { Observable } from 'rxjs';
import { StrapiMetadata } from './strapi-metadata';

export type StrapiObservable<T, U> = Observable<
   U extends undefined ? StrapiResponse<T[]> : StrapiResponse<T>
>;

export interface StrapiResponse<T = any> {
   data: T;
   meta?: Partial<StrapiMetadata>;
}
