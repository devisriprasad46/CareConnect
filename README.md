# CareConnect — NGO & Volunteer Platform

A modern, full-stack web application designed to connect Non-Governmental Organizations (NGOs) with community volunteers to coordinate donation requests, physical/monetary contributions, and volunteer events.

---

## 🏗️ Architecture & Tech Stack

This project was successfully migrated from a legacy PHP + MySQL monolith to a modern decoupled full-stack architecture:

### 1. Frontend
* **Core:** React.js, React Context (Authentication & Session State)
* **Styling:** TailwindCSS, Vanilla CSS, Lucide Icons
* **HTTP Client:** Axios (configured with interceptors to automatically attach Bearer JWT tokens)

### 2. Backend (Java / Spring Boot)
* **Core:** Java 17+, Spring Boot 3.x, Maven
* **Data Layer:** Spring Data JPA, Hibernate, PostgreSQL
* **Security:** Spring Security (Stateless JWT authentication and role-based access control)
* **Features:**
  * **Local File Uploads:** Dedicated image upload endpoint storing files locally on the server filesystem.
  * **Robust JSON Handling:** Case-insensitive enum deserialization for flexible API inputs.
  * **Unified Response Format:** All endpoints wrap payloads inside a standard `ApiResponse<T>` envelope for seamless frontend state mapping.

### 3. Database
* **Engine:** PostgreSQL 15+

---

## 📋 Features

### For NGOs:
* **Create Requests:** Post request campaigns selecting **multiple categories** (e.g. Food, Clothes, Money, Beds) and uploading a **local request image** directly.
* **Events Hosted:** Create, host, and manage volunteer-driven community events.
* **Donations Received:** Track and verify incoming donations from volunteers.

### For Volunteers:
* **Browse & Filter:** Search and filter active donation requests by location, urgency, and category.
* **Make Donations:** Donate physical items or make monetary payments (integrated with secure payment flows).
* **Create & Join Events:** Volunteers can browse and join NGO events or even host their own community events.

---

## 📁 Project Structure

```
CareConnect/
├── backend/                  # Java Spring Boot REST API
│   ├── src/main/java/        # Backend Source Code
│   │   └── com/careconnect/
│   │       ├── config/       # Security & Static Resource Mappings
│   │       ├── controller/   # REST Controllers (Auth, Request, Event, Donation, Upload)
│   │       ├── dto/          # Data Transfer Objects & ApiResponse Envelope
│   │       ├── entity/       # JPA Entities (User, DonationRequest, Donation, Event)
│   │       ├── enums/        # Roles, urgencies, and statuses
│   │       ├── exception/    # Custom exceptions & Global Handlers
│   │       ├── repository/   # JpaRepositories
│   │       └── service/      # Transactional Business Services
│   ├── src/main/resources/   # Application properties
│   └── pom.xml               # Maven Dependency Configuration
│
├── frontend/                 # React SPA Client
│   ├── src/
│   │   ├── components/       # Forms, Cards, and layout elements
│   │   ├── contexts/         # Authentication context (JWT management)
│   │   ├── pages/            # View Pages (Dashboards, Event Details, Auth)
│   │   └── utils/            # Axios API config
│   ├── package.json          # Node dependencies
│   └── .env                  # API Base URL config
│
└── database/
    └── schema.sql            # PostgreSQL database creation schema
```

---

## 🚀 Local Setup Instructions

### Prerequisites
* Java 17 or higher (fully tested on Java 25)
* Node.js and npm
* PostgreSQL installed and running locally

### 1. Database Setup
Create a local database named `careconnect` using psql or pgAdmin:
```sql
CREATE DATABASE careconnect;
```

### 2. Backend Setup
1. Navigate to the `backend/` folder.
2. Open `src/main/resources/application.properties` and edit the database configuration with your local PostgreSQL credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/careconnect
   spring.datasource.username=postgres
   spring.datasource.password=your_postgres_password
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   *The server will start up on `http://localhost:8080` and auto-generate the database tables.*

### 3. Frontend Setup
1. Navigate to the `frontend/` folder.
2. Ensure the `.env` file points to the local backend port:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
   *The app will open automatically on `http://localhost:3000`.*

---

## ☁️ Production Deployment (Render)

For a detailed walkthrough on setting up Render PostgreSQL, Spring Boot, and static hosting for React, see the [Render Deployment Guide](deployment_guide.md).

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

**Happy Coding! 🚀**
