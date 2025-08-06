import fs from 'fs';
import path from 'path';

describe('README Documentation', () => {
  let readmeContent: string;

  beforeAll(() => {
    const readmePath = path.join(__dirname, '../../README.md');
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  });

  it('should exist in project root', () => {
    expect(fs.existsSync(path.join(__dirname, '../../README.md'))).toBe(true);
  });

  describe('Required Sections', () => {
    const requiredSections = [
      '## Prerequisites',
      '## Installation',
      '## Environment Variables',
      '## Deployment',
      '## API Examples',
      '### Create Podcast',
      '### Upload Episode File',
      '### Get Listening Analytics',
      '## Documentation'
    ];

    test.each(requiredSections)('should contain %s section', (section) => {
      expect(readmeContent).toContain(section);
    });
  });

  describe('Environment Variables', () => {
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'S3_BUCKET_NAME',
      'S3_REGION',
      'PORT'
    ];

    test.each(requiredEnvVars)('should include %s variable', (envVar) => {
      const envSection = readmeContent.split('## Environment Variables')[1];
      expect(envSection).toContain(envVar);
    });
  });

  describe('API Examples', () => {
    it('should contain valid create podcast curl command', () => {
      expect(readmeContent).toContain('curl -X POST http://localhost:3000/api/podcasts');
      expect(readmeContent).toContain('Authorization: Bearer YOUR_JWT_TOKEN');
    });

    it('should contain valid file upload example', () => {
      expect(readmeContent).toContain('curl -X POST http://localhost:3000/api/episodes/upload');
      expect(readmeContent).toContain('-F "file=@/path/to/episode.mp3"');
    });

    it('should contain valid analytics endpoint example', () => {
      expect(readmeContent).toContain('curl -X GET "http://localhost:3000/api/analytics/listens?');
      expect(readmeContent).toContain('device=mobile');
    });
  });

  describe('Deployment Steps', () => {
    it('should include migration command', () => {
      expect(readmeContent).toContain('npm run typeorm migration:run');
    });

    it('should include production start command', () => {
      expect(readmeContent).toContain('npm start');
    });
  });
}