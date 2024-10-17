// tests/auth.test.js
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authRoutes = require('../routes/auth'); // Path to your auth route
const User = require('../models/user'); // Path to your User model
const hashService = require('../services/hashService')(); // Path to your hashService

// Create an Express app instance for testing
const app = express();
app.use(express.json()); // To parse JSON bodies
app.use('/api/login', authRoutes); // Use the login/auth route

// Mock the User model
jest.mock('../models/user');

// Mock dotenv to return a secret key for JWT
process.env.SECRET = 'mysecretkey'; // Set the secret key

// Tests for Auth API
describe('Auth API - POST /api/login', () => {

    // Test for successful login
    it('should return a token and expiration time on successful login', async () => {
        const hashedPassword = await hashService.hashPassword('password123');

        const mockUser = { email: 'test@example.com', password: hashedPassword };

        // Mock the User model to return a user with the given email
        User.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.status).toBe(200); // Success status code
        expect(res.body).toHaveProperty('token'); // Check for token in the response
        expect(res.body).toHaveProperty('expires'); // Check for expiration time in the response

        const decodedToken = jwt.verify(res.body.token, process.env.SECRET);
        expect(decodedToken).toHaveProperty('email', 'test@example.com'); // Verify token content
    });

    // Test for incorrect email
    it('should return an error for incorrect email', async () => {
        User.findOne.mockResolvedValue(null); // No user found with the given email

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'wrong@example.com', password: 'password123' });

        expect(res.status).toBe(500); // Error status code
        expect(res.body).toHaveProperty('error', 'Incorrect email or password'); // Check error message
    });

    // Test for incorrect password
    it('should return an error for incorrect password', async () => {
        const hashedPassword = await hashService.hashPassword('password123');

        const mockUser = { email: 'test@example.com', password: hashedPassword };

        // Mock the User model to return a user
        User.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(res.status).toBe(500); // Error status code  
        expect(res.body).toHaveProperty('error', 'Incorrect email or password'); // Check error message
    });

    // Test for token generation error
    it('should return an error if the token is invalid', async () => {
        const hashedPassword = await hashService.hashPassword('password123');

        const mockUser = { email: 'test@example.com', password: hashedPassword };

        // Mock the User model to return a user
        User.findOne.mockResolvedValue(mockUser);

        // Mock jwt.sign to generate an invalid token
        jest.spyOn(jwt, 'sign').mockReturnValue('invalid.token.value');

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'test@example.com', password: 'password123' });

        // Expect the token verification to fail
        expect(res.status).toBe(500); // Error status code
        expect(res.body).toHaveProperty('error', 'Token is invalid'); // Check error message
    });
});
