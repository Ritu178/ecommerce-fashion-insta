# Backend Migrations

Run migrations from the `Backend` folder:

```powershell
npm run migrate
```

Before running migrations, create either `Backend/config/.env` or `Backend/.env` with:

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
```

Seed the default admin account:

```powershell
npm run seed:admin
```

Optional `.env` values for the admin seeder:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

What it does:

- creates the configured database if it does not exist
- creates a `schema_migrations` tracking table
- applies SQL files from `Backend/migrations` in filename order

Current tables created by `001_initial_schema.sql`:

- `users`
- `admins`
- `products`
- `contacts`
- `cart`
- `saved`
- `orders`
- `order_items`
