# Alty - Alt Text Management System

## Overview

Alty is a modern web application designed to help manage and optimize alt text for product images, particularly for e-commerce platforms. The application provides AI-powered alt text generation, bulk editing capabilities, and comprehensive analytics to improve accessibility and SEO for product catalogs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared TypeScript schemas and types
├── migrations/      # Database migration files
└── dist/           # Built application files
```

## Key Components

### Database Schema
- **Products Table**: Stores product information including title, vendor, price, image URL, alt text, and status
- **Metrics Table**: Tracks application-wide statistics including total images, missing alt text count, and time saved metrics
- **Status Types**: "missing", "needs-work", "optimized" for alt text quality tracking

### API Endpoints
- `GET /api/products` - Retrieve all products
- `GET /api/metrics` - Get application metrics and statistics
- `POST /api/generate-alt-text` - AI-powered alt text generation for selected products
- `POST /api/bulk-save` - Bulk update alt text for multiple products
- `PUT /api/products/:id/alt-text` - Update alt text for individual products

### Frontend Components
- **Dashboard**: Main application view with metrics and product management
- **StatusMetrics**: Real-time display of alt text statistics
- **ProductsActions**: Bulk operations interface for product management
- **Sidebar**: Navigation and user account information
- **TimeSaved**: Progress tracking and time savings visualization

## Data Flow

1. **Product Data**: Products are stored in PostgreSQL and retrieved via Express API
2. **Alt Text Generation**: Frontend requests AI generation → Backend simulates AI processing → Database updates
3. **Bulk Operations**: Multiple product selections → Bulk API calls → Database transactions
4. **Metrics Updates**: Real-time calculation of statistics based on product status changes
5. **State Management**: TanStack Query handles caching, synchronization, and optimistic updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui**: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with HMR for frontend
- **Server Restart**: tsx with file watching for backend changes
- **Database**: Neon serverless PostgreSQL for development

### Production Build
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database Migrations**: Drizzle Kit manages schema migrations
4. **Environment Variables**: `DATABASE_URL` required for PostgreSQL connection

### Key Scripts
- `npm run dev`: Development mode with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Apply database schema changes

### Architecture Decisions

**Database Choice**: PostgreSQL with Drizzle ORM was chosen for strong typing, excellent tooling, and compatibility with serverless environments like Neon.

**State Management**: TanStack Query provides excellent caching, background updates, and optimistic UI updates without the complexity of Redux.

**Component Library**: Radix UI + shadcn/ui combination offers accessible components with full customization control and consistent design system.

**Monorepo Structure**: Shared types between frontend and backend ensure type safety across the full stack while maintaining clear separation of concerns.