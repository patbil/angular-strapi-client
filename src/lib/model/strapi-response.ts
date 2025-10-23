import { StrapiMetadata } from './strapi-metadata';

export interface StrapiResponse<T> {
   data: T[];
   meta?: Partial<StrapiMetadata>;
}
