import { StrapiSort } from "./strapi-sort";
import { StrapiFilter } from "./strapi-filters";
import { PopulateValue } from "./strapi-populate";
import { StrapiPaginationRequest } from "./strapi-pagination";

export interface StrapiParams<T> {
   locale?: string | string[];
   status?: "published" | "draft";
   sort?: StrapiSort<T>;
   fields?: Array<keyof T>;
   filters?: StrapiFilter<T>;
   populate?: PopulateValue<T>;
   pagination?: StrapiPaginationRequest;
}
