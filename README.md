# News Portal

A small full-stack application that displays public news headlines behind a login.

- **Backend**: ASP.NET Core Web API (.NET 10), Entity Framework Core, JWT authentication, BCrypt password hashing.
- **Frontend**: React 19 + Vite, React Router, Axios.
- **Database**: Microsoft SQL Server 2025 (Docker).
- **Upstream news**: `https://saurav.tech/NewsAPI` (proxied through the backend).

## Repository layout

```
News-Portal/
├── backend/NewsPortal.Api      ASP.NET Core Web API
├── frontend/news-portal-web    React + Vite SPA
├── database/                   SQL scripts (schema + seed)
├── docker-compose.yml          MS SQL Server container
└── README.md
```

## Prerequisites

- Docker
- .NET SDK 10
- Node.js 20+

## 1. Start the database

```bash
docker compose up -d
```

This starts MS SQL Server 2025 on `localhost:1433` with:

- User: `sa`
- Password: `NewsPortal@2025`

The database (`NewsPortal`) and `Users` table are created automatically by EF Core migrations when the backend first runs. The application also seeds two default users on startup if the table is empty.

If you'd rather create the schema manually, run the scripts in `database/` against the server in order:

```bash
docker exec -i newsportal-sql /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P 'NewsPortal@2025' -C \
    -i /tmp/00_create_database.sql
# (copy each script in or use -Q with the file contents)
```

## 2. Run the backend

```bash
cd backend/NewsPortal.Api
dotnet restore
dotnet run --launch-profile http
```

The API listens on `http://localhost:5100`. Swagger UI is available at `http://localhost:5100/swagger`.

On startup the backend:

1. Applies pending EF Core migrations against the `NewsPortal` database.
2. Seeds two default users if no users exist.

### Default credentials

| Username | Password   |
|----------|------------|
| `admin`  | `Admin@123`|
| `demo`   | `Demo@123` |

### API endpoints

| Method | Path                      | Auth | Description                                              |
|--------|---------------------------|------|----------------------------------------------------------|
| POST   | `/api/auth/login`         | No   | Creates an HttpOnly authentication cookie.               |
| POST   | `/api/auth/logout`        | No   | Clears the authentication cookie.                        |
| GET    | `/api/auth/me`            | Yes  | Returns the current user's username.                     |
| GET    | `/api/news`               | Yes  | Top headlines. Query: `category`, `country`.             |
| GET    | `/api/news/{id}`          | Yes  | Single persisted article by UUID.                        |

Supported categories: `general`, `business`, `entertainment`, `health`, `science`, `sports`, `technology`. Supported countries: see `Services/NewsService.cs`.

## 3. Run the frontend

```bash
cd frontend/news-portal-web
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` (or the next free port). The API base URL is set in `.env`:

```
VITE_API_BASE_URL=http://localhost:5100
```

Open the URL printed by Vite, sign in with one of the default users, and browse headlines.

## Database scripts

- `database/00_create_database.sql` — creates the `NewsPortal` database.
- `database/01_schema.sql` — full schema (generated from EF Core migrations).
- `database/02_seed.sql` — inserts the two default users with BCrypt-hashed passwords.

## Configuration

Backend (`backend/NewsPortal.Api/appsettings.json`):

- `ConnectionStrings:Default` — SQL Server connection string.
- `Jwt:Key` — HMAC signing key (replace in production; must be ≥ 32 chars).
- `Jwt:ExpiresHours` — token lifetime.
- `News:BaseUrl` — upstream news API root.
- `Cors:AllowedOrigins` — origins allowed by the API.

Frontend (`frontend/news-portal-web/.env`):

- `VITE_API_BASE_URL` — backend base URL.

## Notes

- Articles are stored in SQL Server with permanent UUIDs. Feed refreshes update matching source URLs without changing their UUIDs, and saved detail links continue to resolve after an article leaves the upstream feed.
- Passwords are stored as BCrypt hashes (cost 11). The login endpoint returns a generic "invalid credentials" message; no user-existence leak.
- JWTs are sent only in HttpOnly cookies and are never exposed to frontend JavaScript.
