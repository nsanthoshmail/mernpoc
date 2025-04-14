.
├── config/ # Application configuration files (environment-specific)
│ ├── default.json
│ ├── development.json
│ ├── production.json
│ └── custom-environment-variables.json # Maps env vars to config keys (e.g., using 'config' package)
│
├── dist/ # Compiled JavaScript output (from TypeScript)
│
├── docs/ # API documentation (e.g., OpenAPI/Swagger specs, architecture diagrams)
│
├── node*modules/ # Project dependencies
│
├── src/ # Main application source code
│ ├── app.ts # Application entry point (server setup, middleware registration)
│ ├── server.ts # Server bootstrap (listens on port)
│ │
│ ├── core/ # Core functionalities shared across modules
│ │ ├── config/ # Configuration loading and validation logic
│ │ │ └── index.ts
│ │ │ └── env.validation.ts # Optional: Zod/Joi schema for env validation
│ │ ├── database/ # Database connection, base repository, ORM setup
│ │ │ └── postgres/ # Example for PostgreSQL
│ │ │ └── index.ts # Connection pool setup
│ │ │ └── base.repository.ts # Optional: Base class/interface for repositories
│ │ ├── errors/ # Custom error classes (e.g., HttpError, NotFoundError)
│ │ │ └── http-exception.ts
│ │ │ └── ...
│ │ ├── middleware/ # Common application-level middleware
│ │ │ └── error.handler.ts
│ │ │ └── request.logger.ts
│ │ │ └── auth.guard.ts # Core authentication check (e.g., validating JWT)
│ │ │ └── rate.limiter.ts
│ │ ├── providers/ # Wrappers for external services (Email, SMS, Cache, etc.)
│ │ │ └── email/
│ │ │ └── email.service.ts
│ │ │ └── email.interface.ts
│ │ │ └── cache/
│ │ │ └── cache.service.ts
│ │ │ └── cache.constants.ts
│ │ ├── types/ # Shared TypeScript types and interfaces (global)
│ │ │ └── index.d.ts # Or specific files like pagination.types.ts
│ │ ├── utils/ # Generic utility functions (crypto, logging, helpers)
│ │ │ └── logger.ts
│ │ │ └── hash.utils.ts
│ │ │ └── ...
│ │ └── constants/ # Application-wide constants
│ │ └── http-status.constants.ts
│ │ └── ...
│ │
│ └── modules/ # Feature modules (The core of the plug-and-play design)
│ │ # --- Example: Authentication Module ---
│ ├── auth/
│ │ ├── auth.controller.ts # Handles HTTP requests (routes -> controller)
│ │ ├── auth.service.ts # Contains business logic for authentication
│ │ ├── auth.repository.ts # Data access specific to auth (might use user repo)
│ │ ├── auth.routes.ts # Defines API routes for this module (e.g., /api/v1/auth/login)
│ │ ├── dto/ # Data Transfer Objects & Validation Schemas (e.g., using class-validator or Zod)
│ │ │ └── login.dto.ts
│ │ │ └── register.dto.ts
│ │ │ └── token.response.dto.ts
│ │ ├── types/ # Types/Interfaces specific to the auth module
│ │ │ └── jwt-payload.interface.ts
│ │ ├── strategies/ # Authentication strategies (e.g., Local, JWT, OAuth)
│ │ │ └── jwt.strategy.ts
│ │ │ └── local.strategy.ts
│ │ ├── constants/ # Constants specific to the auth module
│ │ └── index.ts # Module entry point (registers routes, services for DI)
│ │
│ │ # --- Example: User Management Module ---
│ ├── users/
│ │ ├── users.controller.ts
│ │ ├── users.service.ts
│ │ ├── users.repository.ts # Primary data access for users
│ │ ├── users.routes.ts # e.g., /api/v1/users
│ │ ├── dto/
│ │ │ └── create-user.dto.ts
│ │ │ └── update-profile.dto.ts
│ │ │ └── user.response.dto.ts
│ │ ├── types/
│ │ │ └── user.interface.ts # Or use ORM entity/model directly if appropriate
│ │ ├── models/ # Database models/entities/schemas (if using ORM/ODM)
│ │ │ └── user.entity.ts
│ │ ├── constants/
│ │ └── index.ts
│ │
│ │ # --- Example: MFA Module (Pluggable) ---
│ ├── mfa/
│ │ ├── mfa.controller.ts
│ │ ├── mfa.service.ts
│ │ ├── mfa.repository.ts # (Might store TOTP secrets, recovery codes)
│ │ ├── mfa.routes.ts # e.g., /api/v1/mfa/setup, /api/v1/mfa/verify
│ │ ├── dto/
│ │ │ └── setup-mfa.dto.ts
│ │ │ └── verify-mfa.dto.ts
│ │ ├── types/
│ │ ├── providers/ # Specific providers for MFA (TOTP, SMS) if not in core
│ │ │ └── totp.provider.ts
│ │ └── index.ts
│ │
│ │ # --- Add new modules here following the pattern ---
│ └── health/ # Simple health check module
│ └── health.controller.ts
│ └── health.routes.ts
│ └── index.ts
│
├── tests/ # Automated tests
│ ├── unit/ # Unit tests (mirror src structure)
│ │ └── core/
│ │ └── modules/
│ │ └── auth/
│ │ └── auth.service.spec.ts
│ │ └── users/
│ │ └── users.repository.spec.ts
│ ├── integration/ # Integration tests (testing module interactions)
│ │ └── auth.integration.spec.ts
│ │ └── users.integration.spec.ts
│ ├── e2e/ # End-to-end tests (testing API endpoints)
│ │ └── auth.e2e-spec.ts
│ │ └── health.e2e-spec.ts
│ ├── mocks/ # Mock objects and functions
│ ├── factories/ # Test data factories
│ └── setup.ts # Global test setup (e.g., initializing test DB)
│
├── .env # Local environment variables (DO NOT COMMIT)
├── .env.example # Example environment variables
├── .eslintignore
├── .eslintrc.js # ESLint configuration
├── .gitignore
├── .prettierrc.js # Prettier configuration
├── nodemon.json # Nodemon configuration for development restarts
├── package.json
├── README.md
└── tsconfig.json # TypeScript compiler options (use paths for aliases like @core/*, @modules/\_)

tsc --init
