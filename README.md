# MoneyMapper

A mini finance tracker with a React/Vite frontend and an ASP.NET Core API backed by MySQL.

## Frontend

```powershell
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to the backend at `http://localhost:5083`.

Run frontend tests:

```powershell
npm test
```

## Backend

The API lives in `server/MoneyMapper.Api` and exposes:

- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`
- `GET /api/health`

Start MySQL locally:

```powershell
docker compose up -d mysql
```

Store the local connection string with user secrets:

```powershell
dotnet user-secrets set "ConnectionStrings:MoneyMapperDb" "server=localhost;port=3306;database=money_mapper;user=money_mapper;password=money_mapper_password" --project "server\MoneyMapper.Api\MoneyMapper.Api.csproj"
```

Apply the EF Core migration:

```powershell
dotnet ef database update --project "server\MoneyMapper.Api\MoneyMapper.Api.csproj" --startup-project "server\MoneyMapper.Api\MoneyMapper.Api.csproj"
```

Run the backend:

```powershell
dotnet run --project "server\MoneyMapper.Api\MoneyMapper.Api.csproj"
```

Run backend tests:

```powershell
dotnet test "MoneyMapper.sln"
```

For deployed environments, set the connection string with the `ConnectionStrings__MoneyMapperDb` environment variable instead of user secrets.
