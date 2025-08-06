import { Server, Socket } from 'socket.io';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { Podcast } from '../models/Podcast';
import http from 'http';

class NotificationService {
    private io: Server;
    private activeSubscriptions = new Map<string, Socket[]>();

    constructor(server?: http.Server) {
        if (NotificationService.instance) {
            return NotificationService.instance;
        }

        this.io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        this.initializeSocketHandlers();
        NotificationService.instance = this;
    }

    private static instance: NotificationService;

    private initializeSocketHandlers() {
        this.io.on('connection', (socket: Socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.on('subscribe', (podcastId: string) => {
                if (!this.activeSubscriptions.has(podcastId)) {
                    this.activeSubscriptions.set(podcastId, []);
                }
                this.activeSubscriptions.get(podcastId)?.push(socket);
                console.log(`User subscribed to podcast ${podcastId}`);
            });

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
                this.activeSubscriptions.forEach((sockets, podcastId) => {
                    this.activeSubscriptions.set(
                        podcastId,
                        sockets.filter(s => s.id !== socket.id)
                    );
                });
            });
        });
    }

    public async notifyNewEpisode(episode: any) {
        try {
            const podcast = await getRepository(Podcast).findOne({
                where: { id: episode.podcastId },
                relations: ['creator']
            });

            if (!podcast) return;

            const subscribers = await getRepository(User).find({
                where: { subscription_status: 'active' },
                relations: ['subscriptions']
            });

            const validSubscribers = subscribers.filter(user => 
                user.subscriptions?.some(sub => sub.id === podcast.id)
            );

            validSubscribers.forEach(user => {
                this.io.emit(`user-${user.id}`, {
                    type: 'NEW_EPISODE',
                    data: {
                        podcastId: podcast.id,
                        title: episode.title,
                        description: episode.description,
                        coverImage: podcast.coverImage
                    }
                });
            });

            console.log(`Notified ${validSubscribers.length} users about new episode`);
        } catch (error) {
            console.error('Error sending notifications:', error);
        }
    }
}

export default new NotificationService();