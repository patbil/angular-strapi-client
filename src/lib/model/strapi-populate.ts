import { StrapiSort } from "./strapi-sort";
import { StrapiFilter } from "./strapi-filters";

export interface PopulateOperators<T> {
   populate?: PopulateValue<T>;
   fields?: Array<keyof T>;
   filters?: StrapiFilter<T>;
   sort?: StrapiSort<T>;
   on?: Record<string, { populate?: PopulateValue<any> }>;
}

export type PopulateValue<T> =
   | string[]
   | "*"
   | Record<string, PopulateOperators<T>>;
