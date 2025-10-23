# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.0.2] - 2025-01-23

### Added

-  **AuthService**: Separated authentication logic into dedicated service with `setAuthToken()`, `getAuthToken()`, and `clearAuthToken()` methods
-  **HttpBuilderService**: New internal service for building HTTP requests with proper header management
-  **Prettier configuration**: Added `.prettierrc` for consistent code formatting

### Changed

-  **Project structure**: Reorganized services into dedicated subdirectories (`service/auth/`, `service/http/`, `service/strapi/`)
-  **StrapiService**: Refactored to use `AuthService` and `HttpBuilderService` internally
-  **Public API**: Updated exports to include `AuthService` and new models
-  **README.md**: Improved documentation with detailed examples and API reference
-  **package.json**: Updated author information and repository URLs

### Removed

-  **Test files**: Removed placeholder spec files (will be replaced with comprehensive tests in future release)

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
