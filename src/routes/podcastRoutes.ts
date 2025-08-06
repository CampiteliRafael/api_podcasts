import { Router } from 'express';
import { z } from 'zod';
import { Podcast } from '../models/Podcast';
import { authenticateJWT } from '../middleware/authMiddleware'; // Supondo que exista um middleware de autenticação
import { getRepository } from 'typeorm';

const router = Router();

// Schema de validação usando Zod
const podcastSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    creatorId: z.number().int().positive("Creator ID must be a positive integer"),
    coverImage: z.string().url("Cover image must be a valid URL"),
    publicationDate: z.coerce.date(),
});

// Rota para criar um novo podcast
router.post('/podcasts', authenticateJWT, async (req, res) => {
    try {
        // Validação dos dados de entrada
        const parsedData = podcastSchema.parse(req.body);

        const podcastRepository = getRepository(Podcast);
        const newPodcast = podcastRepository.create({
            ...parsedData,
            creatorId: req.user.id // Atribuindo o ID do criador a partir do token JWT
        });
        await podcastRepository.save(newPodcast);

        return res.status(201).json(newPodcast);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;