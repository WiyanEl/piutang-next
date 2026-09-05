# Kasbon

A simple web application for tracking personal debts and receivables.

Kasbon allows users to record, manage, and monitor personal debt transactions in one place.

## Features

### Authentication

* User registration
* User login
* User logout
* Protected dashboard
* Guest-only access for authentication pages

### Debt Management

* Create a new debt record
* Edit an existing debt
* Delete a debt
* Mark a debt as settled
* Track whether money is owed to you or you owe someone else
* Optional due date
* Optional notes

### Dashboard

* Total amount owed to the user
* Total amount the user owes
* Net debt balance
* Transaction list
* Debt status filtering
* Debt type filtering
* Search by counterpart name
* Sort by:

  * Newest
  * Oldest
  * Highest amount
  * Lowest amount
* Group transactions by person
* Expand grouped transactions to see individual records
* Bar chart comparing total receivables and payables

### Security

* Supabase Authentication
* Row Level Security (RLS)
* Users can only access their own debt records
* Server-side validation using Zod

---

## Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Supabase**

  * Authentication
  * PostgreSQL Database
  * Row Level Security
* **Zod** for request validation
* **Recharts** for dashboard visualization

---

## Requirements

Make sure the following are installed:

* Node.js 18+
* npm
* A Supabase project

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd kasbon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project credentials.

> Do not commit `.env.local` to the repository.

### 4. Setup the database

Create the required `debts` table and policies in your Supabase project.

The database contains the following main fields:

| Column             | Type        | Description                   |
| ------------------ | ----------- | ----------------------------- |
| `id`               | UUID        | Primary key                   |
| `user_id`          | UUID        | References authenticated user |
| `type`             | ENUM        | `owed_to_me` or `i_owe`       |
| `counterpart_name` | TEXT        | Name of the other party       |
| `amount`           | BIGINT      | Debt amount in Rupiah         |
| `note`             | TEXT        | Optional note                 |
| `due_date`         | DATE        | Optional due date             |
| `settled_at`       | TIMESTAMPTZ | Settlement timestamp          |
| `created_at`       | TIMESTAMPTZ | Creation timestamp            |
| `updated_at`       | TIMESTAMPTZ | Last update timestamp         |

### 5. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Database Security

Row Level Security (RLS) is enabled on the `debts` table.

Each authenticated user can only:

* View their own debts
* Create their own debts
* Update their own debts
* Delete their own debts

The application also checks the authenticated user before performing debt operations.

---

## API Endpoints

### Get debts

```http
GET /api/debts
```

Optional query parameters:

```text
status=settled
status=unsettled
type=owed_to_me
type=i_owe
```

Example:

```http
GET /api/debts?status=unsettled&type=owed_to_me
```

### Create debt

```http
POST /api/debts
```

Example request body:

```json
{
  "type": "owed_to_me",
  "counterpart_name": "Budi",
  "amount": 150000,
  "note": "Makan bersama",
  "due_date": "2026-09-10"
}
```

### Update debt

```http
PATCH /api/debts/:id
```

Example:

```json
{
  "counterpart_name": "Budi",
  "amount": 200000
}
```

To mark a debt as settled:

```json
{
  "settled_at": "2026-09-05T10:00:00.000Z"
}
```

### Delete debt

```http
DELETE /api/debts/:id
```

---

## Project Structure

```text
app/
├── api/
│   ├── debts/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── ...
│
├── components/
│   └── dashboard/
│       ├── DashboardHeader.tsx
│       ├── SummaryCards.tsx
│       ├── DebtChart.tsx
│       ├── DebtFilters.tsx
│       ├── DebtList.tsx
│       ├── DebtItem.tsx
│       ├── GroupedDebtList.tsx
│       └── DebtFormModal.tsx
│
├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   ├── auth/
│   │   ├── requireAuth.ts
│   │   └── requireGuest.ts
│   ├── supabase/
│   │   └── ...
│   └── validations/
│       └── debt.ts
│
└── ...

types/
└── debt.ts

supabase/
└── migrations/
    └── ...
```

---

## Debt Types

The application supports two types of debt:

### Owed to Me

Someone owes money to the current user.

```text
Type: owed_to_me
```

### I Owe

The current user owes money to someone else.

```text
Type: i_owe
```

The dashboard calculates the net balance using:

```text
Net Balance = Total Owed to Me - Total I Owe
```

Settled debts are excluded from the dashboard summary.

---

## Validation

Debt requests are validated using Zod.

Validation includes:

* Valid debt type
* Required counterpart name
* Maximum counterpart name length
* Positive whole-number amount
* Maximum note length
* Valid date format
* Valid settlement timestamp

Both create and update requests are validated on the server.

---

## Testing

Before deployment, run:

```bash
npm run build
```

The production build should complete successfully before deploying the application.

Recommended manual tests:

### Authentication

* Register a new account
* Login
* Logout
* Access dashboard without authentication

### Debt

* Create debt
* Edit debt
* Mark debt as settled
* Delete debt
* Verify settled debt is excluded from summary

### Filters

* Search by person
* Filter by status
* Filter by debt type
* Sort by newest
* Sort by oldest
* Sort by highest amount
* Sort by lowest amount

### Grouping

* Add multiple transactions for the same person
* Switch to "Per orang"
* Expand the person's transactions
* Edit, settle, and delete transactions

### Security

* Verify a user cannot access another user's debt records
* Verify RLS policies prevent cross-user data access

---

## Production Build

To create a production build locally:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## Deployment

This application can be deployed using Vercel.

Before deploying, configure the required environment variables in the Vercel project:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

After deployment, update the Supabase Authentication URL configuration with the production application URL.

---

## Bonus Features

The application includes several additional features beyond the basic requirements:

* 🔎 Search transactions by person
* ↕️ Sort transactions by date and amount
* 👤 Group transactions by person
* 📊 Dashboard bar chart
* 📱 Responsive dashboard interface

---

## License

This project was created as a technical test project.
