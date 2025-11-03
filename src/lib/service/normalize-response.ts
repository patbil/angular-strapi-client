import { map } from 'rxjs';
import { StrapiResponse } from '../model/strapi-response';

export function normalize(isSingle: boolean) {
   return map((response: StrapiResponse) => ({
      ...response,
      data: isSingle
         ? Array.isArray(response.data) && response.data.length
            ? response.data[0]
            : response.data
         : Array.isArray(response.data)
         ? response.data
         : [response.data],
   }));
}
