export type FilterValue = number | string | boolean | Date | null;

export type FilterOperators = {
   $eq?: FilterValue;
   $eqi?: FilterValue;
   $ne?: FilterValue;
   $nei?: FilterValue;
   $lt?: FilterValue;
   $lte?: FilterValue;
   $gt?: FilterValue;
   $gte?: FilterValue;
   $in?: FilterValue[];
   $notIn?: FilterValue[];
   $contains?: string;
   $notContains?: string;
   $containsi?: string;
   $notContainsi?: string;
   $null?: boolean;
   $notNull?: boolean;
   $between?: [FilterValue, FilterValue];
   $startsWith?: string;
   $startsWithi?: string;
   $endsWith?: string;
   $endsWithi?: string;
};

export type StrapiFilter<T> = {
   [K in keyof T]?:
      | FilterValue
      | FilterOperators
      | (T[K] extends object ? StrapiFilter<T[K]> : never);
} & {
   $or?: StrapiFilter<T>[];
   $and?: StrapiFilter<T>[];
   $not?: StrapiFilter<T>;
};
