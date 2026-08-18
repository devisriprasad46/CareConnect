-- CareConnect PostgreSQL Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  userId SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- "NGO" or "Volunteer"
  location VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests Table (NGO Requests)
CREATE TABLE IF NOT EXISTS requests (
  requestId SERIAL PRIMARY KEY,
  orgId INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  urgencyLevel VARCHAR(50) NOT NULL, -- "Low", "Medium", "High"
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orgId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
  donationId SERIAL PRIMARY KEY,
  requestId INT NOT NULL,
  donorId INT NOT NULL,
  donationType VARCHAR(50) NOT NULL, -- "Money", "Item"
  status VARCHAR(50) DEFAULT 'Pending', -- "Pending", "Confirmed", "Completed"
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES requests(requestId) ON DELETE CASCADE,
  FOREIGN KEY (donorId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  eventId SERIAL PRIMARY KEY,
  creatorId INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creatorId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Event Participants Junction Table
CREATE TABLE IF NOT EXISTS event_participants (
  id SERIAL PRIMARY KEY,
  eventId INT NOT NULL,
  userId INT NOT NULL,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (eventId, userId),
  FOREIGN KEY (eventId) REFERENCES events(eventId) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);