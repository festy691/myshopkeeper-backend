import * as cloudinary from 'cloudinary';

import {configData} from "./env_config";

cloudinary.v2.config({
    cloud_name: "",
    api_key: "",
    api_secret: "",
});

export const uploads = (file: any, folder: string): Promise<{ url: string; id: string }> => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
            file,
            {
                resource_type: 'auto',
                folder: folder,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.url || '',
                        id: result.public_id || '',
                    });
                }
            }
        );
    });
};

export const deleteFile = (file: any): void => {
    cloudinary.v2.uploader.destroy(file, (result: any) => {
        console.log(result);
    });
};
