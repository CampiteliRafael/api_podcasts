import { FeedGenerator } from './feed-generator';
import { Podcast } from './models/Podcast';
import { getRepository } from 'typeorm';

jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
}));

describe('FeedGenerator', () => {
  let feedGenerator: FeedGenerator;

  beforeEach(() => {
    feedGenerator = new FeedGenerator();
  });

  it('should generate a valid RSS feed', async () => {
    const mockPodcast = {
      id: 1,
      title: 'Test Podcast',
      description: 'This is a test podcast.',
      creator: { username: 'testuser', email: 'test@example.com' },
      coverImage: 'http://example.com/image.jpg',
      episodes: [
        {
          title: 'Episode 1',
          description: 'This is the first episode.',
          audioUrl: 'http://example.com/audio1.mp3',
          fileSize: 123456,
          mimeType: 'audio/mpeg',
          guid: 'unique-guid-1',
          publicationDate: new Date(),
          duration: 300,
          chapters: [],
          transcripts: []
        }
      ]
    };

    (getRepository(Podcast).findOne as jest.Mock).mockResolvedValue(mockPodcast);

    const rssFeed = await feedGenerator.generateFeed(1);
    expect(rssFeed).toContain('<rss');
    expect(rssFeed).toContain('<title>Test Podcast</title>');
    expect(rssFeed).toContain('<item>');
  });

  it('should throw an error if podcast is not found', async () => {
    (getRepository(Podcast).findOne as jest.Mock).mockResolvedValue(null);

    await expect(feedGenerator.generateFeed(999)).rejects.toThrow('Podcast not found');
  });
}