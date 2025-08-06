import request from 'supertest';
import express from 'express';
import AnalyticsController from './AnalyticsController';
import { getRepository } from 'typeorm';
import { Listen } from '../models/Listen';

jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  getRepository: jest.fn(),
}));

const mockQueryBuilder = {
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

const mockRepository = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

(getRepository as jest.Mock).mockReturnValue(mockRepository);

const app = express();
app.use(express.json());
app.get('/analytics/listens', (req, res) => {
  AnalyticsController.getListens(req, res).catch(err => {
    res.status(500).json({ message: 'Internal server error' });
  });
});

describe('AnalyticsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when validation fails', async () => {
    const response = await request(app)
      .get('/analytics/listens')
      .query({ device: 'invalid_device' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should return filtered listens with valid parameters', async () => {
    const mockListens = [{
      id: 1,
      device: 'mobile',
      date: '2023-01-01T00:00:00.000Z'
    }];
    
    mockQueryBuilder.getMany.mockResolvedValue(mockListens);

    const response = await request(app)
      .get('/analytics/listens')
      .query({
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        device: 'mobile'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockListens);
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
  });

  it('should return all listens when no filters provided', async () => {
    const mockListens = [{ id: 1 }, { id: 2 }];
    mockQueryBuilder.getMany.mockResolvedValue(mockListens);

    const response = await request(app)
      .get('/analytics/listens');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockListens);
    expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
  });

  it('should return 500 on database error', async () => {
    mockQueryBuilder.getMany.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/analytics/listens')
      .query({ device: 'mobile' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});