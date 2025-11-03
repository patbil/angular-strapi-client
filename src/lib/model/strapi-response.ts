import { StrapiMetadata } from './strapi-metadata';

export interface StrapiResponse<T = any> {
   data: T[];
   meta?: Partial<StrapiMetadata>;
}
