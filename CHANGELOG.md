# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.3 (2025-10-23)


### Features

* automatic deploy on npm ([0318da9](https://github.com/patbil/angular-strapi-client/commit/0318da9eb872a0188e323e01c14c32681b23412c))
* automatic deploy on npm ([30f8f4c](https://github.com/patbil/angular-strapi-client/commit/30f8f4c8eadaa61ea7421f9ee2f09a771374e66c))
* automatic deploy on npm ([0dbd9f7](https://github.com/patbil/angular-strapi-client/commit/0dbd9f725c2ae9a6bd458d06cdd051dc308fa331))
* automatic deploy on npm ([8d5fcd9](https://github.com/patbil/angular-strapi-client/commit/8d5fcd98b9aa8d320e9c27592ee2f5b72d8ab2cb))
* automatic deploy on npm ([5534bce](https://github.com/patbil/angular-strapi-client/commit/5534bce7787b38bd381a3ec14667cb9577ac9958))
* automatic deploy on npm ([bd8983c](https://github.com/patbil/angular-strapi-client/commit/bd8983c7629b9208a9307e159bddca52dd07a9a1))
* automatic deploy on npm ([487b2e4](https://github.com/patbil/angular-strapi-client/commit/487b2e4b7e7a41964a9ba8f48728beaffec6d134))

## [0.0.2] - 2025-01-23

### Added

-  **AuthService**: Separated authentication logic into dedicated service with `setAuthToken()`, `getAuthToken()`, and `clearAuthToken()` methods
-  **HttpBuilderService**: New internal service for building HTTP requests with proper header management
-  **Prettier configuration**: Added `.prettierrc` for consistent code formatting

### Changed

-  **Project structure**: Reorganized services into dedicated subdirectories
-  **README.md**: Improved documentation with detailed examples and API reference
-  **package.json**: Updated author information and repository URLs

### Breaking Changes

-  Authentication methods (`setAuthToken`, `clearAuthToken`) moved from `StrapiService` to `AuthService`
-  Migration guide: Inject `AuthService` separately for authentication operations

## [0.0.1] - 2025-01-XX

### Added

-  Initial release
-  Type-safe Angular HTTP client for Strapi v5+
-  Support for filtering, sorting, pagination, population
-  Bearer token authentication
-  Full TypeScript support with generics
