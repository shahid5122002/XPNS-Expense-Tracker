# XPNS — Personal Expense Tracker

XPNS is a web-based personal expense tracker designed to help users record income and expenses, organize spending by category, and monitor their budget through a dashboard.

## Features

- User registration and login
- Income and expense tracking
- Budget management
- Expense categories
- Transaction history
- Dashboard with charts and summaries
- CSV import
- AI assistant powered by the Gemini API

> **Development status:** Some features, including expense creation and category loading, are still being tested and fixed.

## Tech Stack

**Frontend**

- React
- Vite
- CSS

**Backend**

- Node.js
- Express
- MySQL
- `mysql2`

**Other tools and services**

- Google Gemini API
- Git and GitHub

## Project Structure

```text
expense-tracker/
├── database/
│   └── xpns_schema.sql
├── server/
│   ├── .env.example
│   ├── db.js
│   ├── index.js
│   └── package.json
├── src/
│   ├── components/
│   ├── pages/
│   └── store/
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL Server
- MySQL Workbench (optional, for database management)
- A Gemini API key (optional if you don't use the AI assistant)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/shahid5122002/XPNS-Expense-Tracker.git
cd XPNS-Expense-Tracker
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory using `.env.example` as a reference.

Configure the required database variables and your Gemini API key. Never commit your real `.env` file or publish API keys and passwords.

### 5. Create the database

Create a MySQL database named `expense_tracker`, then import `database/xpns_schema.sql` using MySQL Workbench or the MySQL command line.

### 6. Run the backend

From the `server` directory, run:

```bash
node index.js
```

### 7. Run the frontend

Open a second terminal in the project root and run:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## Environment Variables

Refer to `server/.env.example` for the required variable names. Set your own local database credentials and Gemini API key in `server/.env`.

## Security

- Keep `.env` files and API keys private.
- Do not commit passwords, private user data, or uploaded personal files.
- Use your own credentials when setting up the project.

## Future Improvements

- Fix and verify expense creation and category loading.
- Improve error handling and form validation.
- Test the complete registration, login, and transaction workflows.
- Add screenshots and deployment instructions after the application is fully tested.

## Author

**Md Shahid**

GitHub: [shahid5122002](https://github.com/shahid5122002)
