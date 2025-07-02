import {CustomRequest} from "../interface/custom_request";

import multer from 'multer';
import {v4 as uuidV4} from 'uuid';

const storage = multer.diskStorage({
    destination: function (req: CustomRequest, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, 'file/');
    },
    filename: function (req: CustomRequest, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, uuidV4() + file.originalname);
    }
});

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB file size limit
    }
});

export {upload};