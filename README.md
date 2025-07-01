# ReactJS + Laravel Template

This project combines **ReactJS** (Vite + TypeScript) for the frontend and **Laravel** for the backend, following a modern development workflow.

## Features

- Frontend: ReactJS 19 with Vite and TypeScript
- Backend: Laravel 12 framework
- Pre-configured development environment

## Setup Instructions

### Prerequisites

- Node.js (>= 18.x)
- PHP (>= 8.2)
- Composer (>= 2.0)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jimweldev/reactjs_laravel_07_2025.git
```

2. Install backend dependencies:

```bash
cd reactjs19-laravel12-template/backend
composer install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
   - Update database credentials and other settings

### Running the Project

- Start development server for backend and frontend:

```bash
npm run dev
```

## Project Structure

### Frontend

```
frontend/
├── src/
│   ├── 01_pages/        # Page components
│   ├── 02_layouts/      # Layout components
│   ├── 03_templates/    # Reusable templates
│   ├── 04_types/        # TypeScript types
│   ├── 05_stores/       # State management
│   ├── 06_providers/    # Context providers
│   ├── 07_instances/    # Service instances
│   ├── 08_configs/      # Configuration files
```

### Backend

```
backend/
├── app/
│   ├── Http/            # Controllers and requests
│   ├── Models/          # Database models
├── config/              # Configuration files
├── database/            # Migrations and seeders
├── routes/              # Application routes
├── tests/               # Feature and unit tests
```

## Available Scripts

### Frontend

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Lint code
- `npm run format`: Format code with prettier

### Backend

- `php artisan serve`: Start development server
- `php artisan test`: Run tests

## Documentation

- [ReactJS](https://reactjs.org/docs/getting-started.html)
- [Laravel](https://laravel.com/docs/12.x)

## License

[MIT License](LICENSE)
