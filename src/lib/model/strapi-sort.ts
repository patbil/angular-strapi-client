type SortOrder = "asc" | "desc";
type SortField<T> = Extract<keyof T, string>;
type SortWithOrder<T> = `${SortField<T>}:${SortOrder}`;

export type StrapiSort<T> =
   | SortField<T>
   | SortWithOrder<T>
   | Array<SortField<T> | SortWithOrder<T>>;
