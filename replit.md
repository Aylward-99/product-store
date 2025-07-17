# ProductHub - E-commerce Product Management System

## Overview

ProductHub is a full-stack e-commerce product management system built with React, TypeScript, Express, and PostgreSQL. It provides a modern, responsive interface for managing products, categories, reviews, and shopping cart functionality with features like search, filtering, sorting, and user reviews.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage with session-based cart management
- **API Design**: RESTful API endpoints with proper HTTP status codes

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Schema Management**: Drizzle migrations in `./migrations` directory
- **Validation**: Zod schemas for runtime type checking and validation

## Key Components

### Database Schema
- **Products**: Core product information with pricing, categories, ratings, and metadata
- **Categories**: Product categorization system
- **Reviews**: User-generated product reviews and ratings
- **Cart Items**: Session-based shopping cart management

### API Endpoints
- **Products**: CRUD operations, search, filtering, sorting, and favorite toggling
- **Categories**: Category management and retrieval
- **Reviews**: Product review creation and retrieval
- **Cart**: Session-based cart operations (add, update, remove, clear)

### Frontend Components
- **Product Management**: Product cards, modals, and forms for CRUD operations
- **Shopping Cart**: Sidebar cart with quantity management
- **Search & Filtering**: Advanced filtering by category, price range, and text search
- **Theme System**: Dark/light mode toggle with persistent preferences
- **Responsive Design**: Mobile-first design with adaptive layouts

## Data Flow

1. **Product Display**: Products are fetched from the API and displayed in a responsive grid/list layout
2. **Search & Filter**: Client-side filtering parameters are sent to the backend for server-side processing
3. **Cart Management**: Cart operations use session IDs stored in localStorage for persistence
4. **Reviews**: Users can add reviews which are immediately reflected in product ratings
5. **State Management**: React Query handles caching, background updates, and optimistic updates

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: React Hook Form with Hookform Resolvers for validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type checking

### Development Dependencies
- **Build Tools**: Vite for frontend builds, esbuild for backend bundling
- **TypeScript**: Full TypeScript support across the stack
- **Development**: tsx for TypeScript execution in development

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server to `dist/index.js`
- **Database**: Drizzle migrations are applied via `db:push` command

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Development**: Uses NODE_ENV for environment-specific behavior
- **Production**: Serves static files from Express in production mode

### File Structure
- **Client**: React application in `client/` directory
- **Server**: Express API in `server/` directory  
- **Shared**: Common TypeScript definitions in `shared/` directory
- **Database**: Drizzle configuration and migrations

The application is designed to be easily deployable on platforms like Replit, with proper build scripts and environment variable management for seamless deployment.