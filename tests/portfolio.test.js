const request = require('supertest');
const express = require('express');
const portfolioRoutes = require('../routes/portfolio');
const Portfolio = require('../models/portfolio');
const authenticated = require('../middleware/authenticated');

const app = express();
app.use(express.json());
app.use('/api/portfolio', portfolioRoutes);

// Mock the Portfolio model
jest.mock('../models/portfolio');

// Mock the authentication middleware
jest.mock('../middleware/authenticated', () => jest.fn((req, res, next) => next())); // Always pass auth

// Tests for Portfolio API
describe('Portfolio API', () => {

    // INDEX: Get all portfolio items
    describe('GET /api/portfolio', () => {
        it('should return a list of portfolio items', async () => {
            const mockPortfolioItems = [
                { title: 'Portfolio Item 1', description: 'Description 1' },
                { title: 'Portfolio Item 2', description: 'Description 2' }
            ];
            Portfolio.find.mockResolvedValue(mockPortfolioItems); // Mock the find method

            const res = await request(app).get('/api/portfolio');

            expect(res.status).toBe(200); // Success status code
            expect(res.body.length).toBe(2); // Check the response body
            expect(res.body[0]).toHaveProperty('title', 'Portfolio Item 1');
        });

        it('should handle errors when getting portfolio items', async () => {
            Portfolio.find.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/portfolio');

            expect(res.status).toBe(500); // Internal server error
            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });

    // SHOW: Get a specific portfolio item by ID
    describe('GET /api/portfolio/:id', () => {
        it('should return a portfolio item by ID', async () => {
            const mockPortfolioItem = { title: 'Portfolio Item 1', description: 'Description 1' };
            Portfolio.findById.mockResolvedValue(mockPortfolioItem); // Mock findById

            const res = await request(app).get('/api/portfolio/1');

            expect(res.status).toBe(200); // Success status code
            expect(res.body).toHaveProperty('title', 'Portfolio Item 1'); // Check the returned data
        });

        it('should return 404 if portfolio item is not found', async () => {
            Portfolio.findById.mockResolvedValue(null); // Mock findById returning null

            const res = await request(app).get('/api/portfolio/1');

            expect(res.status).toBe(404); // Not found
        });

        it('should handle errors when fetching portfolio item by ID', async () => {
            Portfolio.findById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/portfolio/1');

            expect(res.status).toBe(500); // Internal server error
            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });

    // CREATE: Create a new portfolio item (POST)
    describe('POST /api/portfolio', () => {
        it('should create a portfolio item when authenticated', async () => {
            const mockPortfolioItem = { title: 'New Portfolio Item', description: 'New Description' };
            Portfolio.prototype.save = jest.fn().mockResolvedValue(mockPortfolioItem); // Mock the save method

            const res = await request(app)
                .post('/api/portfolio')
                .send(mockPortfolioItem); // Send a new portfolio item

            expect(authenticated).toHaveBeenCalled(); // Check if the auth middleware was called
            expect(res.status).toBe(200); // Check for success status code
            expect(res.body).toHaveProperty('title', 'New Portfolio Item'); // Check the saved data
        });

        it('should return 401 if not authenticated', async () => {
            authenticated.mockImplementationOnce((req, res, next) => res.sendStatus(401));

            const res = await request(app)
                .post('/api/portfolio')
                .send({ title: 'Unauthenticated Item' });

            expect(res.status).toBe(401); // Unauthenticated status code
        });

        it('should handle errors during creation', async () => {
            Portfolio.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/portfolio')
                .send({ title: 'Error Item', description: 'Error Desc' });

            expect(res.status).toBe(400); // Bad request (your catch block)
            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });

    // UPDATE: Update a portfolio item (PATCH)
    describe('PATCH /api/portfolio/:id', () => {
        it('should update a portfolio item when authenticated', async () => {
            const mockUpdatedPortfolio = { id: '1', title: 'Updated Portfolio Item', description: 'Updated Description' };
            Portfolio.findByIdAndUpdate.mockResolvedValue(mockUpdatedPortfolio); // Mock the update method

            const res = await request(app)
                .patch('/api/portfolio/1')
                .send({ title: 'Updated Portfolio Item', description: 'Updated Description' });

            expect(authenticated).toHaveBeenCalled(); // Check if the auth middleware was called
            expect(res.status).toBe(200); // Success status code
            expect(res.body).toHaveProperty('title', 'Updated Portfolio Item'); // Check the updated data
        });

        it('should return 401 if not authenticated', async () => {
            authenticated.mockImplementationOnce((req, res, next) => res.sendStatus(401)); // Unauthenticated

            const res = await request(app)
                .patch('/api/portfolio/1')
                .send({ title: 'Updated Unauthenticated Item' });

            expect(res.status).toBe(401); // Unauthenticated status code
        });

        it('should return 400 if update fails', async () => {
            Portfolio.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/portfolio/1')
                .send({ title: 'Update Error Item' });

            expect(res.status).toBe(400); // Bad request status code
            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });

    // DELETE: Delete a portfolio item (DELETE)
    describe('DELETE /api/portfolio/:id', () => {
        it('should delete a portfolio item when authenticated', async () => {
            const mockDeletedPortfolio = { id: '1', title: 'Deleted Portfolio Item' };
            Portfolio.findByIdAndDelete.mockResolvedValue(mockDeletedPortfolio); // Mock the delete method

            const res = await request(app).delete('/api/portfolio/1');

            expect(authenticated).toHaveBeenCalled(); // Check if the auth middleware was called
            expect(res.status).toBe(200); // Success status code
            expect(res.text).toContain('Item: Deleted Portfolio Item has been deleted.'); // Check response text
        });

        it('should return 401 if not authenticated', async () => {
            authenticated.mockImplementationOnce((req, res, next) => res.sendStatus(401)); // Unauthenticated

            const res = await request(app).delete('/api/portfolio/1');

            expect(res.status).toBe(401); // Unauthenticated status code
        });

        it('should return 400 if delete fails', async () => {
            Portfolio.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/portfolio/1');

            expect(res.status).toBe(400); // Bad request status code
            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });
});
