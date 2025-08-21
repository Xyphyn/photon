# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Photon is a Svelte-based Lemmy client built with SvelteKit 2 and Svelte 5. It's a modern frontend for Lemmy instances with extensive customization options and multi-platform support.

### Key Technologies
- **Frontend**: SvelteKit 2 + Svelte 5 with TypeScript
- **Styling**: TailwindCSS v4 + PostCSS
- **Desktop App**: Tauri (optional, in src-tauri/)
- **Package Manager**: Bun (primary) or npm
- **Build Adapters**: Supports Bun, Node, and static builds

## Development Commands

### Development
```bash
# Start development server
bun run dev
# or
npm run dev
```

### Building
```bash
# Build for Bun runtime (fastest)
ADAPTER=bun bun run build

# Build for Node runtime (better compatibility)
ADAPTER=node npm run build

# Build static files
ADAPTER=static npm run build
```

### Code Quality
```bash
# Type checking
bun run check
# or watch mode
bun run check:watch

# Linting
bun run lint

# Formatting
bun run format
# or specific files
bun run format:specific <file>
```

### Running Built Application
```bash
# Start Bun server
bun run bunstart

# Start Node server
bun run start
```

### Testing
The project uses Vitest as configured in package.json, but no test files currently exist:
```bash
bun run test
```

## Architecture

### Core Structure
- **Routes**: SvelteKit file-based routing in `src/routes/`
- **Components**: Organized by domain in `src/lib/components/`
  - `lemmy/`: Lemmy-specific components (posts, comments, communities)
  - `ui/`: Generic UI components
  - `mono/`: Design system components (imported as 'mono-svelte')
- **State Management**: Svelte 5 runes with custom stores for global state
- **Internationalization**: Custom i18n system in `src/lib/i18n/`

### Key Global State
- **Authentication**: `src/lib/auth.svelte.ts` - Profile and user management
- **Settings**: `src/lib/settings.svelte.ts` - User preferences and configuration  
- **Lemmy Client**: `src/lib/lemmy.svelte.ts` - API client and site data
- **Instance**: `src/lib/instance.svelte.ts` - Instance URL management

### Component Organization
- **Lemmy Domain**: Components for posts, comments, communities, moderation
- **UI Components**: Reusable interface elements with design system
- **Layout**: Shell, navbar, sidebar structure
- **Form Components**: Input controls with consistent styling

### Environment Configuration
Photon uses PUBLIC_ prefixed environment variables for client-side configuration. Default values are defined in `src/lib/settings.svelte.ts`. Key configuration includes:
- `PUBLIC_INSTANCE_URL`: Default Lemmy instance
- `PUBLIC_SSR_ENABLED`: Server-side rendering toggle
- `PUBLIC_LOCK_TO_INSTANCE`: Whether to allow instance switching

### Multi-Platform Support
- **Web**: Primary SvelteKit application
- **Desktop**: Optional Tauri wrapper in `src-tauri/` for native desktop app
- **Mobile**: PWA capabilities with responsive design

### Build System
- **Vite**: Primary build tool with SvelteKit integration
- **Adapters**: Dynamic adapter selection via ADAPTER environment variable
- **Aliases**: 'mono-svelte' points to internal design system at `src/lib/mono`

### State Patterns
The codebase uses Svelte 5 runes extensively:
- `$state()` for reactive state
- `$derived()` for computed values  
- `$effect()` for side effects
- Custom classes with reactive properties for complex state management