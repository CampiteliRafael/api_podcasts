import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fileUploadService } from './FileUploadService';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

const s3Mock = mockClient(S3Client);

describe('FileUploadService', () => {
    beforeEach(() => {
        s3Mock.reset();
        process.env.AWS_BUCKET_NAME = 'test-bucket';
    });

    describe('uploadFile', () => {
        it('should throw error for invalid file type', async () => {
            const mockFile = {
                mimetype: 'image/png',
                size: 5000000,
                originalname: 'test.png',
                buffer: Buffer.from('test')
            } as Express.Multer.File;

            await expect(fileUploadService.uploadFile({} as Request, mockFile, 'test-bucket'))
                .rejects.toThrow('Invalid file type. Only MP3/WAV allowed');
        });

        it('should throw error for file size exceeding limit', async () => {
            const mockFile = {
                mimetype: 'audio/mpeg',
                size: 15 * 1024 * 1024,
                originalname: 'large.mp3',
                buffer: Buffer.from('test')
            } as Express.Multer.File;

            await expect(fileUploadService.uploadFile({} as Request, mockFile, 'test-bucket'))
                .rejects.toThrow('File size exceeds 10MB limit');
        });

        it('should upload valid file successfully', async () => {
            const mockFile = {
                mimetype: 'audio/mpeg',
                size: 5 * 1024 * 1024,
                originalname: 'test.mp3',
                buffer: Buffer.from('test')
            } as Express.Multer.File;

            s3Mock.on(PutObjectCommand).resolves({});

            const result = await fileUploadService.uploadFile({} as Request, mockFile, 'test-bucket');
            expect(result).toMatch(/episodes\/[a-f0-9-]+\.mp3/);
        });

        it('should handle S3 upload failure', async () => {
            const mockFile = {
                mimetype: 'audio/mpeg',
                size: 5 * 1024 * 1024,
                originalname: 'test.mp3',
                buffer: Buffer.from('test')
            } as Express.Multer.File;

            s3Mock.on(PutObjectCommand).rejects(new Error('S3 Error'));

            await expect(fileUploadService.uploadFile({} as Request, mockFile, 'test-bucket'))
                .rejects.toThrow('File upload failed');
        });
    });

    describe('getFileStream', () => {
        it('should generate signed URL successfully', async () => {
            const testKey = 'episodes/test-file.mp3';
            s3Mock.on(GetObjectCommand).resolves({});

            const result = await fileUploadService.getFileStream('test-bucket', testKey);
            expect(result).toContain('amazonaws.com');
        });

        it('should handle signed URL generation failure', async () => {
            const testKey = 'episodes/test-file.mp3';
            s3Mock.on(GetObjectCommand).rejects(new Error('URL Error'));

            await expect(fileUploadService.getFileStream('test-bucket', testKey))
                .rejects.toThrow('File retrieval failed');
        });
    });
});