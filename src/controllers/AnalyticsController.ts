import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Listen } from '../models/Listen'; // Supondo que exista um modelo Listen
import { z } from 'zod';

const analyticsSchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    device: z.enum(['mobile', 'desktop', 'tablet', 'other']).optional()
});

class AnalyticsController {
    public async getListens(req: Request, res: Response): Promise<Response> {
        const validationResult = analyticsSchema.safeParse(req.query);
        
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.errors });
        }

        const { startDate, endDate, device } = validationResult.data;

        try {
            const listensRepository = getRepository(Listen);
            const query = listensRepository.createQueryBuilder('listen');

            if (startDate) {
                query.andWhere('listen.date >= :startDate', { startDate });
            }

            if (endDate) {
                query.andWhere('listen.date <= :endDate', { endDate });
            }

            if (device) {
                query.andWhere('listen.device = :device', { device });
            }

            const listens = await query.getMany();
            return res.status(200).json(listens);
        } catch (error) {
            console.error('Error fetching listens:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new AnalyticsController();