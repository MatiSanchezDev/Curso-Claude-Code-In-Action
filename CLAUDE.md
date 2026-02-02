# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Descripción del Proyecto

UIGen es un generador de componentes React potenciado por IA, construido con Next.js 15. Los usuarios describen componentes en una interfaz de chat, Claude genera código React, y una vista previa en vivo renderiza el resultado. Los componentes se almacenan en un sistema de archivos virtual (en memoria, no en disco) y se persisten en SQLite mediante Prisma.

## Comandos

```bash
npm run setup        # Configuración inicial: instala deps, genera cliente Prisma, ejecuta migraciones
npm run dev          # Inicia servidor de desarrollo con Turbopack
npm run build        # Build de producción
npm run lint         # ESLint
npm test             # Ejecuta tests con Vitest
npm run db:reset     # Resetea la base de datos (flag force)
```

## Arquitectura

### Sistema de Archivos Virtual (`src/lib/file-system.ts`)
La abstracción central. Todo el código generado vive en memoria, nunca se escribe en disco. Soporta archivos/directorios, operaciones CRUD, y serializa a JSON para persistencia en base de datos. La herramienta `str_replace_editor` usa comandos basados en texto (view, create, str_replace, insert) para ediciones dirigidas por IA.

### Integración con IA
- **Provider** (`src/lib/provider.ts`): Usa `@ai-sdk/anthropic` con Claude cuando `ANTHROPIC_API_KEY` está configurada, de lo contrario recurre a un provider mock que genera componentes demo estáticos
- **Endpoint de chat** (`src/app/api/chat/route.ts`): Transmite respuestas de IA usando Vercel AI SDK, invoca herramientas `str_replace_editor` y `file_manager`, persiste conversación + estado de archivos en base de datos
- **System prompt** (`src/lib/prompts/generation.tsx`): Instruye a la IA a crear `/App.jsx` como punto de entrada, usar Tailwind CSS, mantener respuestas breves

### Contextos
- `FileSystemContext`: Estado del FS virtual, archivo seleccionado
- `ChatContext`: Mensajes, estado del input, estado de streaming

### Layout de UI (`src/app/main-content.tsx`)
Paneles redimensionables: Chat (izquierda 35%) | Preview+Code (derecha 65%). El preview renderiza componentes en iframe mediante compilación runtime de Babel.

### Auth (`src/lib/auth.ts`)
Sesiones JWT (HS256), cookies HTTP-only, expiración de 7 días, hash de contraseñas con bcrypt.

### Base de Datos
SQLite con Prisma. Dos modelos:
- `User`: email, password (hasheado)
- `Project`: name, messages (JSON), data (FS virtual serializado), userId opcional

## Patrones Clave

- Alias de rutas: `@/*` mapea a `./src/*`
- Componentes UI usan shadcn/ui (primitivos Radix) en `src/components/ui/`
- Server actions en `src/actions/` manejan auth y CRUD de proyectos
- Middleware (`src/middleware.ts`) protege rutas `/api/projects` y `/api/filesystem`
