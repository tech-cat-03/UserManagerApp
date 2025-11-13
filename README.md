# UserManagerApp (Password manager)

A full-stack **User Management System** built with:

- **ASP.NET Core 8 + Entity Framework + SQL Server**
- **React (Vite + TypeScript)** frontend
- **JWT Authentication + API Key Middleware**
- **Daily log files** with request info (IP, host, user agent, etc.)

---
### Prerequisites

- .NET SDK 8.0+
- Node.js 18+ and npm (or yarn/pnpm)
- SQL Server (LocalDB/Express/Developer/Container)
- VS 2022 (optional but recommended)

---

## Quick Start

### 1 Clone the Repository
```bash
git clone https://github.com/tech-cat-03/UserManagerApp.git
cd UserManagerApp
```
### 2 Backend setup
Go to the server dir
```bash
cd UserManagerApp.Server
```
#### 2.1 Clone the Repository
Open ```UserManagerApp.Server/appsettings.json``` and set your values (if not already set):
```bash
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(local)\\sqlexpress; Database=UserDB; Trusted_Connection=True; TrustServerCertificate=True;"
  },
  "ApiKeys": {
    "ClientA": "12345-ABCDE-APIKEY",
    "ClientB": "67890-ZYXWV-APIKEY"
  },
  "Jwt": {
    "Key": "super_secret_jwt_key_123456789_ABCDEF", // >= 32 chars!
    "Issuer": "UserManagerApp",
    "Audience": "UserManagerAppUsers"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}
```
#### 2.2 Apply migrations
```bash
dotnet ef database update
```
(or create them if missing:)

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
Now run backend:
```bash
dotnet run
```
Swagger UI → http://localhost:5015/swagger

### 3 Frontend setup

#### 3.1 Move to client folder
```bash
cd ../usermanagerapp.client
```
#### 3.2 Install packages
```bash
npm install
```
#### 3.3 Run the app
```bash
npm run dev
```
Frontend runs at → http://localhost:5173

### 4 Create the first user (via Swagger)
POST → ```/api/auth/register```
```bash
{
  "userName": "admin",
  "fullName": "System Administrator",
  "email": "admin@example.com",
  "phone": "0000000000",
  "language": "en",
  "culture": "US",
  "password": "Admin123!",
}
```
Login using:
```bash
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```
But first you need to authorize via the token ```X-API-KEY: 12345-ABCDE-APIKEY```. API calls are logged into /Logs/yyyy-MM-dd.txt

### 5 Logging
Each request logs:

- **Log Level**
- **Timestamp**
- **Client IP**
- **Client Name (User-Agent)** 
- **Host machine**
- **API Method**
- **Request Parameters**
- **Message** 

### 6 API Endpoints
```bash
# Authentication
POST    /api/auth/register                # Create new user
POST    /api/auth/login                   # Login and receive JWT token

# Users (Protected)
GET     /api/users                        # List all users
GET     /api/users/{id}                   # Get user details
POST    /api/users                        # Add new user
PUT     /api/users/{id}                   # Update user
DELETE  /api/users/{id}                   # Remove user
POST    /api/users/{id}/validate-password # Validate password

# Logs
GET     /api/logs                         # List all log files
```
### 7 Troubleshooting

Common issues and how to resolve them:

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Ensure every protected request includes both headers:<br>`Authorization: Bearer <token>` and `X-API-KEY: your-api-key` |
| **JWT Error: IDX10720** | Your JWT signing key must be **at least 32 characters long** in `appsettings.json`. |
| **Phone saved as empty in DB** | Send the field as `"phone"` (not `"mobile"`) in your request body. |
| **CORS blocking requests** | Update the CORS policy in `Program.cs` to allow your frontend origin (e.g., `http://localhost:5173`). |
| **Database/tables missing** | Run Entity Framework migrations:<br>`dotnet ef database update` |

### 8 Project Structure
```bash
UserManagerApp/
├── UserManagerApp.Server/
│   ├── Controllers/           # API controllers (Auth, Users, Logs)
│   ├── Middleware/            # API key validation, logging middleware
│   ├── Models/                # Entity models (PUser, LogEntry)
│   ├── Logs/                  # Auto-generated daily log files
│   ├── appsettings.json       # DB connection, JWT keys, API keys
│   └── Program.cs             # ASP.NET Core startup pipeline
│
├── usermanagerapp.client/
│   ├── src/
│   │   ├── assets/styles/     # All CSS files
│   │   ├── components/        # Reusable UI components (Sidebar, Topbar, Toast, Modals)
│   │   ├── pages/             # Page components (Home, Login, Logs)
│   │   └── App.tsx            # React Router & App root
│   └── package.json           # Frontend dependencies & scripts
│
└── README.md                  # Project documentation
```
## Application Features

This project is a complete **User Management System** built with **ASP.NET Core (backend)** and **React + TypeScript (frontend)**.  
It includes authentication, authorization, user CRUD management, activity logging, and a clean admin UI.

---

### Authentication & Authorization

- User login system  
- JWT-based authentication  
- Password hashing using BCrypt  
- API Key protection for all backend requests  
- Automatic redirect if token is missing or expired  

---

### User Management (CRUD)

Fully functional user management interface:

- **Create user** (username, full name, email, phone, language, culture, password)
- **Edit user** (username, full name, email, phone, language, culture, password)
- **View user**
- **Delete user**  
- Pagination  
- Password validation API  
- Automatic toast notifications for:
  - user added
  - user updated
  - user deleted
  - API errors

---