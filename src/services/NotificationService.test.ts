import NotificationService from './NotificationService';
import { Server } from 'socket.io';
import http from 'http';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { Podcast } from '../models/Podcast';

jest.mock('socket.io');
jest.mock('typeorm');

const mockServer = { close: jest.fn() } as unknown as http.Server;
const mockSocket = {
  id: 'test-socket-id',
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn()
} as unknown as Socket;

describe('NotificationService', () => {
  let notificationService: NotificationService;
  
  beforeEach(() => {
    (Server as jest.Mock).mockImplementation(() => ({
      on: jest.fn(),
      emit: jest.fn(),
      sockets: {
        sockets: new Map([[mockSocket.id, mockSocket]])
      }
    }));
    
    notificationService = new NotificationService(mockServer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create singleton instance', () => {
    const instance2 = new NotificationService();
    expect(notificationService).toBe(instance2);
  });

  it('should handle subscription to podcast', () => {
    const podcastId = '123';
    (notificationService as any).activeSubscriptions = new Map();
    
    // Simulate subscribe event
    const subscribeHandler = (Server.prototype.on as jest.Mock).mock.calls[0][1];
    subscribeHandler(mockSocket);
    const podcastHandler = (mockSocket.on as jest.Mock).mock.calls[0][1];
    podcastHandler(podcastId);
    
    expect((notificationService as any).activeSubscriptions.get(podcastId)).toContain(mockSocket);
  });

  it('should handle client disconnect', () => {
    const podcastId = '123';
    (notificationService as any).activeSubscriptions.set(podcastId, [mockSocket]);
    
    // Simulate disconnect
    const disconnectHandler = (mockSocket.on as jest.Mock).mock.calls[1][1];
    disconnectHandler();
    
    expect((notificationService as any).activeSubscriptions.get(podcastId)?.length).toBe(0);
  });

  it('should notify subscribers about new episode', async () => {
    const mockEpisode = {
      podcastId: '123',
      title: 'Test Episode',
      description: 'Test Description'
    };
    
    const mockPodcast = {
      id: '123',
      coverImage: 'test.jpg',
      creator: { id: 1 }
    };
    
    const mockUser = {
      id: 1,
      subscription_status: 'active',
      subscriptions: [{ id: '123' }]
    };
    
    // mock typeorm calls
    (getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Podcast) {
        return { findOne: jest.fn().mockResolvedValue(mockPodcast) };
      }
      if (entity === User) {
        return { find: jest.fn().mockResolvedValue([mockUser]) };
      }
    });
    
    await notificationService.notifyNewEpisode(mockEpisode);
    
    expect(notificationService['io'].emit).toHaveBeenCalledWith(
      `user-${mockUser.id}`,
      expect.objectContaining({
        type: 'NEW_EPISODE',
        data: expect.objectContaining({
          podcastId: mockPodcast.id
        })
      })
    );
  });

  it('should handle missing podcast', async () => {
    (getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null)
    });
    
    await notificationService.notifyNewEpisode({ podcastId: 'invalid' });
    expect(notificationService['io'].emit).not.toHaveBeenCalled();
  });
});