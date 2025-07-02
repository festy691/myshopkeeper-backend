import * as fs from 'fs';
import {CustomFile} from '../../interface/custom_file';
import {S3Client, PutObjectCommand, PutObjectCommandInput} from '@aws-sdk/client-s3';

import {configData} from "../../config/env_config";

const {
    STORAGE_END_POINT,
    STORAGE_SECRET_ACCESS_KEY,
    STORAGE_ACCESS_KEY,
    STORAGE_SPACE_NAME,
    STORAGE_REGION,
    DOWNLOAD_SPACES_ENDPOINT
} = configData;

const s3 = new S3Client({
    endpoint: STORAGE_END_POINT,
    region: STORAGE_REGION,
    credentials: undefined,
});


class ImageServices {
    // Function to upload a single file and return the URL
    static async uploadImageToS3AndGetURL(imagePath: string, bucketName: string, filename: string) {
        try {
            //const fileStream = fs.createReadStream(imagePath);

            // Read the uploaded file
            const fileStream = fs.createReadStream(imagePath);
            // Automatically detect content type from the file extension
            const contentType = this.getContentType(filename);

            const uploadParams: PutObjectCommandInput = {
                Bucket: STORAGE_SPACE_NAME,
                Key: filename,
                Body: fileStream,
                ACL: 'public-read',
                ContentType: contentType,
            };

            // Upload the file using PutObjectCommand
            const command = new PutObjectCommand(uploadParams);
            const uploadResult = await s3.send(command);

            // Remove the local file after upload
            fs.unlinkSync(imagePath);


            return `${DOWNLOAD_SPACES_ENDPOINT}/${filename}`;
        } catch (error: any) {
            console.error('Upload failed:', error);
            throw error;
        }
    }

    // Function to upload multiple images and return an array of URLs
    static async uploadMultipleImagesToS3AndGetURLs(imagePaths: CustomFile[], bucketName: string) {
        try {
            const uploadPromises = imagePaths.map(image =>
                this.uploadImageToS3AndGetURL(image.path, bucketName, image.filename)
            );

            return Promise.all(uploadPromises);
        } catch (err) {
            console.error('Upload failed:', err);
            return [];
        }
    }

    // Helper function to determine the content type from the file extension
    static getContentType(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',
        };
        return mimeTypes[extension || ''] || 'application/octet-stream'; // Default to binary
    }
}

export {ImageServices};