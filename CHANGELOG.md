# Changelog

## [0.0.4] - 2025-10-24

### Changed

- **StrapiService**: Shared the Strapi URL with services extending StrapiService — marked as protected

## [0.0.3] - 2025-10-23

### Infrastructure

- **CI/CD Pipeline**: GitHub Actions workflow for automatic NPM deployment on release

## [0.0.2] - 2025-01-23

### Added

- **AuthService**: Separated authentication logic into dedicated service with `setAuthToken()`, `getAuthToken()`, and `clearAuthToken()` methods
- **HttpBuilderService**: New internal service for building HTTP requests with proper header management
- **Prettier configuration**: Added `.prettierrc` for consistent code formatting

### Changed

- **Project structure**: Reorganized services into dedicated subdirectories
- **README.md**: Improved documentation with detailed examples and API reference
- **package.json**: Updated author information and repository URLs

### Breaking Changes

- Authentication methods (`setAuthToken`, `clearAuthToken`) moved from `StrapiService` to `AuthService`
- Migration guide: Inject `AuthService` separately for authentication operations

## [0.0.1] - 2025-01-22

### Added

- Initial release
- Type-safe Angular HTTP client for Strapi v5+
- Support for filtering, sorting, pagination, population
- Bearer token authentication
- Full TypeScript support with generics
