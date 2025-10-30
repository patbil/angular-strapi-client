import { StrapiEntry } from '../../model/strapi-entry';
import { StrapiPagination } from '../../model/strapi-pagination';
import { StrapiResponse } from '../../model/strapi-response';

export interface Article extends StrapiEntry {
   title: string;
   content: string;
   author: string;
}

export const mockResponse: StrapiResponse<Article> = {
   data: [
      {
         id: 1,
         documentId: 'doc-1',
         title: 'Angular Guide',
         content: 'Introduction to Angular',
         author: 'John',
         createdAt: '2024-01-01',
         updatedAt: '2024-01-01',
         publishedAt: '2024-01-01',
      },
      {
         id: 2,
         documentId: 'doc-2',
         title: 'Strapi Guide',
         content: 'Introduction to Strapi',
         author: 'Jane',
         createdAt: '2024-01-02',
         updatedAt: '2024-01-02',
         publishedAt: '2024-01-02',
      },
   ],
   meta: {
      pagination: { page: 1, pageCount: 1, pageSize: 25, total: 2 },
   },
};

export const createMockArticle = (overrides?: Partial<Article>): Article => ({
   id: 1,
   documentId: 'doc-1',
   title: 'Test Article',
   content: 'Content',
   author: 'Test Author',
   createdAt: '2024-01-01',
   updatedAt: '2024-01-01',
   publishedAt: '2024-01-01',
   ...overrides,
});

export const createMockResponse = (
   data: Article[],
   pagination?: Partial<StrapiPagination>
): StrapiResponse<Article> => ({
   data,
   meta: {
      pagination: {
         page: 1,
         pageCount: 1,
         pageSize: 25,
         total: data.length,
         ...pagination,
      },
   },
});
