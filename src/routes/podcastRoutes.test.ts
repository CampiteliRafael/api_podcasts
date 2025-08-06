import request from 'supertest';
import express from 'express';
import podcastRoutes from './podcastRoutes';
import { createConnection } from 'typeorm';

const app = express();
app.use(express.json());
app.use('/api', podcastRoutes);

// Mock TypeORM getRepository
jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  getRepository: jest.fn(),
}));

// Mock auth middleware
jest.mock('../middleware/authMiddleware', () => ({
  authenticateJWT: jest.fn((req, res, next) => {
    req.user = { id: 123 }; // Mock user ID
    next();
  }),
}));

describe('POST /podcasts', () => {
    let connection;

    beforeAll(async () => {
        connection = await createConnection(); // Cria a conexão com o banco de dados
    });

    afterAll(async () => {
        await connection.close(); // Fecha a conexão após os testes
    });

    it('should create a new podcast and return it', async () => {
        const newPodcast = {
            title: 'Test Podcast',
            description: 'This is a test podcast.',
            creatorId: 1, // Required by Zod but will be overwritten
            coverImage: 'http://example.com/image.jpg',
            publicationDate: new Date(),
        };

        const response = await request(app)
            .post('/api/podcasts')
            .send(newPodcast);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newPodcast.title);
        expect(response.body.creatorId).toBe(123); // Assert that creatorId is from the mock user
    });

    it('should return 400 if validation fails', async () => {
        const invalidPodcast = {
            title: '',
            description: 'This is a test podcast.',
            creatorId: -1,
            coverImage: 'not-a-url',
            publicationDate: 'invalid-date',
        };

        const response = await request(app)
            .post('/api/podcasts')
            .send(invalidPodcast);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should return 500 status when database save fails', async () => {
        const mockPodcastData = {
            title: 'Test Podcast',
            description: 'Test Description',
            creatorId: 1,
            coverImage: 'https://example.com/image.jpg',
            publicationDate: '2023-01-01T00:00:00.000Z',
        };

        const mockRepository = {
            create: jest.fn().mockReturnValue(mockPodcastData),
            save: jest.fn().mockRejectedValue(new Error('Database error')),
        };

        (typeorm.getRepository as jest.Mock).mockReturnValue(mockRepository);

        const response = await request(app)
            .post('/api/podcasts')
            .send(mockPodcastData);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});