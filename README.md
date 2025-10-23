# Angular Strapi Client

[![npm version](https://badge.fury.io/js/angular-strapi-client.svg)](https://www.npmjs.com/package/angular-strapi-client)

A type-safe Angular HTTP client library for Strapi v5+ with support for filtering, sorting, pagination, population, and localization.

## Features

-  Full TypeScript support with generics
-  Strapi v5 compatible
-  Advanced filtering, sorting, and population
-  Built-in pagination and localization support
-  Bearer token authentication
-  Automatic retry and error handling

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

// Fetch by ID
this.articlesService.get(123).subscribe((response) => {
   console.log(response.data);
});

// Create
this.articlesService
   .save(undefined, { title: 'New Article' })
   .subscribe((response) => console.log(response.data));

// Update
this.articlesService
   .save(123, { title: 'Updated' })
   .subscribe((response) => console.log(response.data));

// Delete
this.articlesService.delete(123).subscribe();
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

-  :asc - for ascending (default, can be omitted)
-  :desc - for descending

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
this.articlesService.setAuthToken('your-jwt-token');
this.articlesService.clearAuthToken();
```

## API Reference

### StrapiService Methods

-  `get(id?, params?, options?)` - Fetch entries or single entry
-  `save(id, data, options?, method?)` - Create or update entry
-  `delete(id, options?)` - Delete entry
-  `setAuthToken(token)` - Set authentication token
-  `clearAuthToken()` - Remove authentication token

### StrapiEntry Interface

```typescript
interface StrapiEntry {
   id: number;
   documentId: string;
   createdAt: string;
   updatedAt: string;
   publishedAt: string;
   active?: boolean;
}
```

## Building

```bash
ng build angular-strapi-client
```

## Publishing

```bash
ng build angular-strapi-client
cd dist/angular-strapi-client
npm publish
```

## Requirements

-  Angular 19.2.0+
-  Strapi v5+
