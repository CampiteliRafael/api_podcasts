import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const s3MimeTypes = ['audio/mpeg', 'audio/wav'];
const maxFileSize = 10 * 1024 * 1024; // Limite de 10 MB

export class FileUploadService {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
    }

    async uploadFile(req: Request, file: Express.Multer.File, bucketName: string) {
        if (!s3MimeTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only MP3/WAV allowed');
        }

        if (file.size > maxFileSize) {
            throw new Error('File size exceeds 10MB limit');
        }

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `episodes/${uuidv4()}.${fileExtension}`;

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        try {
            await this.s3Client.send(new PutObjectCommand(params));
            return fileName;
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw new Error('File upload failed');
        }
    }

    async getFileStream(bucketName: string, fileKey: string) {
        const params = {
            Bucket: bucketName,
            Key: fileKey
        };

        try {
            const command = new GetObjectCommand(params);
            return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
        } catch (error) {
            console.error('Error generating signed URL:', error);
            throw new Error('File retrieval failed');
        }
    }
}

// Multer configuration
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (s3MimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP3/WAV allowed'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: maxFileSize
    }
});

export const fileUploadService = new FileUploadService();