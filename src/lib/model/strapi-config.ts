import { InjectionToken } from "@angular/core";

export interface StrapiConfig {
   url: string;
}

export const STRAPI_CONFIG = new InjectionToken<StrapiConfig>("strapi.config");
