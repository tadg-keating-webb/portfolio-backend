# PORTFOLIO API
This is a simple backend API for managing portfolio items, built using Express.js and MongoDB. The API provides both protected and open routes for interacting with portfolio data and includes a command to create an admin user for authentication.

## Features
- Protected Routes
  - Create, read, update, and delete portfolio items (requires authentication).
- Open Routes
  - View the list of portfolio items.
  - View an individual portfolio item.
- Create User Command
  - A command-line tool to create a new admin user for login purposes.

## Technologies Used
- Node.js with Express.js for the server.
- MongoDB as the database.
- Mongoose for MongoDB object modeling.
- JWT (JSON Web Token) for route protection and authentication.

## Installation
Clone the repo:
```bash
git clone https://github.com/your-username/your-repo.git
```
Navigate to the project directory:
```bash
cd portfolio-backend
```
Install Dependencies:
```bash
npm install
```
Set up your environment variables. Copy the .env.default file rename it to env:
```bash
cp .env.default .env
```
Inside the .env file, define the following variables:
```bash
DATABASE_URL=mongodb://localhost:27017/your-database-name
SECRET=your_jwt_secret
```
Start the server
```bash
npm start
```

## API Routes
Coming soon...

## Authentication
The API uses JWT for authentication. To access protected routes, you need to:
1. Login to the system (admin only) to get a token: 
```bash 
POST /login
```
- Body: ```{ "email": "admin@example.com", "password": "adminpassword" }```
- Response: ```{ "token": "your_jwt_token", "expires": "expire_timestamp" }```

2. Pass the token in the Authorization header when making requests to protected routes:
```bash
Authorization: Bearer your_jwt_token
```

## Command to Create Admin User
To create an admin user who can log in and manage the portfolio, run the following command:
```bash
node commands/addUser.js add-user --email admin@example.com --password adminpassword
```
This will create a new user in the database with the provided email and password.

## Running the API
After setting up your environment and starting the server, the API will be available at http://localhost:3000. You can use tools like Postman or cURL to interact with the routes.

## License 
This project is licensed under the MIT License.

