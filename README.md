# CareConnect - NGO & Volunteer Platform

A full-stack web application that connects NGOs with volunteers to facilitate donations, requests, and community events.

## 🏗️ Architecture

- **Frontend**: React.js with Bootstrap
- **Backend**: PHP (XAMPP)
- **Database**: MySQL
- **API**: RESTful APIs with JSON responses

## 📋 Features

### For NGOs:
- Create and manage donation requests
- View donations received
- Track request status and urgency levels
- Dashboard with statistics

### For Volunteers:
- Browse available requests
- Make donations (money/items)
- View donation history
- Participate in community events

### For Everyone:
- View upcoming events
- Create and manage events
- User authentication and role-based access

## 🚀 Setup Instructions

### Prerequisites
- XAMPP (Apache + MySQL)
- Node.js and npm
- Git

### 1. Database Setup

1. Start XAMPP and ensure Apache and MySQL are running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import the database schema:
   ```sql
   -- Run the SQL commands from database_setup.sql
   CREATE DATABASE careconnect;
   USE careconnect;
   -- ... (rest of the schema)
   ```

### 2. Backend Setup (PHP)

1. Copy the `htdocs/careconnect-backend/` folder to your XAMPP htdocs directory
2. The API endpoints will be available at:
   - `http://localhost/careconnect-backend/api/users.php`
   - `http://localhost/careconnect-backend/api/requests.php`
   - `http://localhost/careconnect-backend/api/donations.php`
   - `http://localhost/careconnect-backend/api/events.php`
   - `http://localhost/careconnect-backend/api/login.php`

### 3. Frontend Setup (React)

1. Navigate to the project root directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
CareConnect/
├── htdocs/careconnect-backend/api/
│   ├── db.php              # Database connection
│   ├── users.php           # User management API
│   ├── requests.php        # Request management API
│   ├── donations.php       # Donation management API
│   ├── events.php          # Event management API
│   └── login.php           # Authentication API
├── src/
│   ├── components/
│   │   ├── Navbar.js       # Navigation component
│   │   ├── HomePage.js     # Landing page
│   │   ├── SignupForm.js   # User registration
│   │   ├── LoginForm.js    # User login
│   │   ├── NGODashboard.js # NGO dashboard
│   │   ├── VolunteerDashboard.js # Volunteer dashboard
│   │   └── EventsPage.js   # Events management
│   ├── App.js              # Main app component
│   ├── index.js            # App entry point
│   └── index.css           # Global styles
├── public/
│   └── index.html          # HTML template
├── package.json            # Dependencies
└── database_setup.sql      # Database schema
```

## 🔧 API Endpoints

### Users API (`users.php`)
- `POST` - Create new user
- `GET` - Fetch all users

### Requests API (`requests.php`)
- `POST` - Create new request
- `GET` - Fetch all requests

### Donations API (`donations.php`)
- `POST` - Create new donation
- `GET` - Fetch all donations

### Events API (`events.php`)
- `POST` - Create new event
- `GET` - Fetch all events

### Login API (`login.php`)
- `POST` - User authentication

## 📝 Sample API Usage

### Create User
```javascript
const userData = {
  name: "John Doe",
  email: "john@example.com",
  password: "123456",
  role: "Volunteer",
  location: "New York"
};

axios.post('http://localhost/careconnect-backend/api/users.php', userData)
  .then(response => console.log(response.data));
```

### Create Request
```javascript
const requestData = {
  orgId: 1,
  category: "Food",
  title: "Need rice bags",
  description: "Requesting 20kg rice bags for orphanage",
  quantity: 5,
  urgencyLevel: "High"
};

axios.post('http://localhost/careconnect-backend/api/requests.php', requestData)
  .then(response => console.log(response.data));
```

## 🎨 UI Features

- Responsive design with Bootstrap
- Role-based navigation
- Real-time data updates
- Form validation
- Loading states
- Success/error messages
- Modern card-based layout

## 🔐 Security Features

- Password hashing (PHP password_hash)
- CORS headers for API security
- Input validation
- SQL injection prevention (PDO prepared statements)
- Role-based access control

## 🚀 Deployment

### Backend (XAMPP)
1. Ensure XAMPP is running
2. Place backend files in htdocs directory
3. Configure database connection in `db.php`

### Frontend (React)
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the database schema
- Test API endpoints with tools like Postman
- Ensure XAMPP services are running

---

**Happy Coding! 🚀**
