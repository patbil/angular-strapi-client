# Angular Strapi Client

[![npm version](https://badge.fury.io/js/angular-strapi-client.svg?cacheSeconds=600)](https://www.npmjs.com/package/angular-strapi-client)

A type-safe Angular HTTP client library for Strapi v5+ with support for filtering, sorting, pagination, population, and localization.

## Features

- Full TypeScript support with generics
- Strapi v5 compatible
- Advanced filtering, sorting, and population
- Built-in pagination and localization support
- Bearer token authentication

## Installation

```bash
npm install angular-strapi-client
```

## Quick Start

### 1. Configure Provider

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { STRAPI_CONFIG } from 'angular-strapi-client';

export const appConfig: ApplicationConfig = {
   providers: [
      provideHttpClient(),
      {
         provide: STRAPI_CONFIG,
         useValue: { url: 'https://your-strapi-api.com' },
      },
   ],
};
```

### 2. Create Service

```typescript
import { Injectable } from '@angular/core';
import { StrapiService, StrapiEntry } from 'angular-strapi-client';

export interface Article extends StrapiEntry {
   title: string;
   content: string;
}

@Injectable({ providedIn: 'root' })
export class ArticlesService extends StrapiService<Article> {
   path = '/articles';
}
```

### 3. Use Service

```typescript
// Fetch all
this.articlesService.get().subscribe((response) => {
   console.log(response.data);
});

// Fetch by numeric ID (legacy)
this.articlesService.get(123).subscribe((response) => {
   console.log(response.data);
});

// Create (no ID)
this.articlesService
   .save(null, { title: 'New Article' })
   .subscribe((response) => console.log(response.data));

// Update (with ID)
this.articlesService
   .save('abc123xyz', { title: 'Updated' })
   .subscribe((response) => console.log(response.data));

// Delete
this.articlesService.delete('abc123xyz').subscribe();
```

## Advanced Usage

### Filtering

```typescript
this.articlesService
   .get(undefined, {
      filters: {
         title: { $contains: 'Angular' },
         publishedAt: { $notNull: true },
         $or: [{ category: { name: { $eq: 'Tech' } } }],
      },
   })
   .subscribe((response) => console.log(response.data));
```

**Available operators:** `$eq`, `$ne`, `$lt`, `$lte`, `$gt`, `$gte`, `$in`, `$notIn`, `$contains`, `$containsi`, `$startsWith`, `$endsWith`, `$null`, `$notNull`, `$between`, `$or`, `$and`, `$not`.

For more details see this page: [Strapi filters](https://docs.strapi.io/cms/api/rest/filters)

### Sorting

You can sort one or more fields.
Sorting order can be defined by operators:

- :asc - for ascending (default, can be omitted)
- :desc - for descending

```typescript
// Single field
this.articlesService
   .get(undefined, {
      sort: 'title',
   })
   .subscribe((response) => console.log(response.data));

// Multiple fields
this.articlesService
   .get(undefined, {
      sort: ['publishedAt:desc', 'title:asc'],
   })
   .subscribe((response) => console.log(response.data));
```

### Population

```typescript
// All relations
this.articlesService
   .get(undefined, {
      populate: '*',
   })
   .subscribe((response) => console.log(response.data));

// Specific fields
this.articlesService
   .get(undefined, {
      populate: ['author', 'category'],
   })
   .subscribe((response) => console.log(response.data));

// Deep population
this.articlesService
   .get(undefined, {
      populate: {
         author: { fields: ['name', 'email'] },
         category: { populate: ['parent'] },
      },
   })
   .subscribe((response) => console.log(response.data));
```

### Pagination

```typescript
this.articlesService
   .get(undefined, {
      pagination: { page: 1, pageSize: 10, withCount: true },
   })
   .subscribe((response) => {
      console.log(response.data);
      console.log(response.meta.pagination);
   });
```

### Field Selection

```typescript
this.articlesService
   .get(undefined, {
      fields: ['title', 'publishedAt'],
   })
   .subscribe((response) => console.log(response.data));
```

### Localization

```typescript
// Specific locale
this.articlesService
   .get(undefined, {
      locale: 'en',
   })
   .subscribe((response) => console.log(response.data));

// Multiple locales
this.articlesService
   .get(undefined, {
      locale: ['en', 'pl'],
   })
   .subscribe((response) => console.log(response.data));
```

### Authentication

```typescript
import { AuthService } from 'angular-strapi-client';

constructor(private authService: AuthService) {}

// Set authentication token (will be used for all requests)
this.authService.setAuthToken('your-jwt-token');

// Get current token
const token = this.authService.getAuthToken();

// Clear authentication token
this.authService.clearAuthToken();
```

## API Reference

### StrapiService Methods

- `get(id?, params?, options?)` - Fetch entries or single entry
- `save(id, data, options?, method?)` - Create (id=null) or update entry
- `delete(id, options?)` - Delete entry

### AuthService Methods

- `setAuthToken(token: string)` - Set authentication token for all requests
- `getAuthToken()` - Get current authentication token
- `clearAuthToken()` - Remove authentication token

### StrapiResponse Interface

```typescript
interface StrapiResponse<T> {
   data: T[]; // Array of entries or single entry
   meta?: {
      pagination?: {
         page: number;
         pageSize: number;
         pageCount: number;
         total: number;
      };
   };
}
```

### StrapiEntry Interface

```typescript
interface StrapiEntry {
   id: number; // Numeric ID (legacy)
   documentId: string; // Document ID (Strapi v5+)
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   active?: boolean;
}
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your Strapi backend is configured to accept requests from your Angular app origin.

### 401 Unauthorized

Check that your JWT token is valid and properly set using `AuthService.setAuthToken()`.

### 404 Not Found

Verify the API path in your service matches your Strapi content type (e.g., `/api/articles` not `/articles`).

## Requirements

- Angular 19.2.0+
- Strapi v5+
