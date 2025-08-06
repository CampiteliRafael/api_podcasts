import { Podcast } from './models/Podcast';
import { Episode } from './models/Episode';
import { getRepository } from 'typeorm';
import { create } from 'xmlbuilder2';

export class FeedGenerator {
  private async generateChaptersXML(chapters: any[]): Promise<string> {
    return JSON.stringify(chapters.map(chapter => ({
      startTime: chapter.startTime,
      title: chapter.title,
      url: chapter.url,
      image: chapter.image
    })));
  }

  private async generateTranscriptsXML(transcripts: any[]): Promise<any[]> {
    return transcripts.map(transcript => ({
      '@type': transcript.type,
      '@url': transcript.url,
      '@language': transcript.language
    }));
  }

  public async generateFeed(podcastId: number): Promise<string> {
    const podcastRepository = getRepository(Podcast);
    const podcast = await podcastRepository.findOne({
      where: { id: podcastId },
      relations: ['episodes', 'creator']
    });

    if (!podcast) {
      throw new Error('Podcast not found');
    }

    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('rss', {
        version: '2.0',
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        'xmlns:podcast': 'https://podcastindex.org/namespace/1.0'
      })
      .ele('channel')
        .ele('title').txt(podcast.title).up()
        .ele('description').txt(podcast.description).up()
        .ele('link').txt('https://example.com/podcast').up()
        .ele('itunes:owner')
          .ele('itunes:name').txt(podcast.creator.username).up()
          .ele('itunes:email').txt(podcast.creator.email).up()
        .up()
        .ele('itunes:image', { href: podcast.coverImage }).up();

    for (const episode of podcast.episodes) {
      const item = root.ele('item')
        .ele('title').txt(episode.title).up()
        .ele('description').txt(episode.description).up()
        .ele('enclosure', {
          url: episode.audioUrl,
          length: episode.fileSize,
          type: episode.mimeType
        }).up()
        .ele('guid').txt(episode.guid).up()
        .ele('pubDate').txt(episode.publicationDate.toUTCString()).up()
        .ele('itunes:duration').txt(episode.duration.toString()).up();

      if (episode.chapters && episode.chapters.length > 0) {
        item.ele('podcast:chapters', {
          version: '1.0',
          data: await this.generateChaptersXML(episode.chapters)
        }).up();
      }

      if (episode.transcripts && episode.transcripts.length > 0) {
        const transcripts = await this.generateTranscriptsXML(episode.transcripts);
        transcripts.forEach(transcript => {
          item.ele('podcast:transcript', transcript).up();
        });
      }

      item.up();
    }

    return root.end({ prettyPrint: true });
  }
}