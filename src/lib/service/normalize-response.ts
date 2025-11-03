import { map } from 'rxjs';
import { StrapiResponse } from '../model/strapi-response';

export function normalize() {
   return map((response: StrapiResponse) => ({
      ...response,
      data: Array.isArray(response.data) ? response.data : [response.data],
   }));
}
