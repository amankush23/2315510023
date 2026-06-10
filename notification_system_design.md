# Notification System Design

## Overview

The repository is organized as a small monorepo with a shared logging package, an Express backend, and a React frontend.

## Structure

- `logging_middleware`: reusable logging client used by both applications
- `notification_app_be`: Node.js and Express API layer
- `notification_app_fe`: React and Material UI frontend

## Backend Flow

1. The backend reads configuration from environment variables.
2. It configures the shared logger with the logging API endpoint and Bearer token.
3. `/api/notifications` fetches notifications from the upstream API, normalizes the payload, and returns the full list.
4. `/api/priority-notifications` fetches the same upstream data, filters by notification type when requested, ranks by type weight and latest timestamp, and returns the paginated result.
5. All major operations are logged through the shared logging package.

## Priority Rules

The ranking engine applies the following rules:

1. Placement notifications rank above Result notifications.
2. Result notifications rank above Event notifications.
3. Within the same type, newer timestamps rank higher.
4. Pagination is applied after ranking and filtering.

## Frontend Flow

1. The frontend configures the shared logger on startup.
2. The all-notifications page fetches the full notification list from the backend and renders it responsively.
3. The priority page fetches ranked notifications from the backend with `notification_type`, `limit`, and `page` filters.
4. Viewed notification ids are stored in `localStorage` and used to style items differently.

## Logging

The shared logger exposes `Log(stack, level, packageName, message)` and posts structured log payloads to the logging API using Bearer authentication when configured.

## Runtime Configuration

Backend environment variables:

- `PORT`
- `FRONTEND_ORIGIN`
- `NOTIFICATION_API_URL`
- `NOTIFICATION_API_TOKEN`
- `LOGGING_API_URL`
- `LOGGING_API_TOKEN`

Frontend environment variables:

- `VITE_BACKEND_BASE_URL`
- `VITE_BACKEND_API_TOKEN`
- `VITE_LOGGING_API_URL`
- `VITE_LOGGING_API_TOKEN`


Screenshots:

![alt text](<Priority Nouncations.png>)

![alt text](<Carous hottkainni.png>)

![alt text](<Carous hottkainni-1.png>)

<video controls src="Screen Recording 2026-06-10 at 12.56.59 PM.mov" title="Title"></video>