import { Podcast } from './Podcast';
import { User } from './User';
import { Episode } from './Episode';

describe('Podcast Entity', () => {
    it('should create a podcast with all properties', () => {
        const user = new User();
        user.id = 1;
        
        const episode = new Episode();
        episode.id = 1;
        
        const podcast = new Podcast();
        podcast.title = 'Test Podcast';
        podcast.description = 'This is a test podcast description';
        podcast.creator = user;
        podcast.coverImage = 'http://example.com/image.jpg';
        podcast.publicationDate = new Date();
        podcast.episodes = [episode];

        expect(podcast).toBeDefined();
        expect(podcast.title).toBe('Test Podcast');
        expect(podcast.description).toBe('This is a test podcast description');
        expect(podcast.creatorId).toBe(1);
        expect(podcast.coverImage).toBe('http://example.com/image.jpg');
        expect(podcast.publicationDate).toBeInstanceOf(Date);
        expect(podcast.episodes).toHaveLength(1);
    });

    it('should maintain relationship with User through creatorId', () => {
        const user = new User();
        user.id = 2;
        
        const podcast = new Podcast();
        podcast.creator = user;

        expect(podcast.creatorId).toBe(2);
        expect(podcast.creator).toBeInstanceOf(User);
        expect(podcast.creator.id).toBe(2);
    });

    it('should handle multiple episodes', () => {
        const podcast = new Podcast();
        const episode1 = new Episode();
        const episode2 = new Episode();
        
        podcast.episodes = [episode1, episode2];

        expect(podcast.episodes).toHaveLength(2);
        expect(podcast.episodes[0]).toBeInstanceOf(Episode);
        expect(podcast.episodes[1]).toBeInstanceOf(Episode);
    });

    it('should handle date types correctly', () => {
        const podcast = new Podcast();
        const testDate = new Date('2023-05-15');
        
        podcast.publicationDate = testDate;

        expect(podcast.publicationDate).toBeInstanceOf(Date);
        expect(podcast.publicationDate.getTime()).toBe(testDate.getTime());
    });
}