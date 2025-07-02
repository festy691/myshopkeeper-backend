import express from 'express';
import ImageController from './controller';
import {upload} from '../../config/multer';
import {protect, authorize, deviceHeaderValid} from '../../middleware/auth';

const ImageRouter = express.Router();
export {ImageRouter};

ImageRouter.route('/upload-single-file')
    .post(
        deviceHeaderValid,
        upload.single('image'),
        ImageController.uploadSingle
    );

ImageRouter.route('/upload-multiple-files')
    .post(
        deviceHeaderValid,
        upload.array('image'),
        ImageController.uploadMultiple
    );
