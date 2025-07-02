import express from 'express';
import NotificationController from './controller';
import {upload} from '../../config/multer';
import { protect, authorize, deviceHeaderValid } from '../../middleware/auth';
import { Permissions } from "../../middleware/permission";

import { NotificationValidator } from "./validator";

const NotificationRouter = express.Router();
export { NotificationRouter };

NotificationRouter.route('/send-notification')
    .post(
        deviceHeaderValid,
        protect,
        upload.single('image'),
        NotificationValidator.validateCreateNotification(),
        NotificationValidator.validate,
        NotificationController.sendNotification
    );

NotificationRouter.route('/read-notification/:id')
    .put(
        deviceHeaderValid,
        protect,
        upload.single('image'),
        NotificationValidator.validateGetNotification(),
        NotificationValidator.validate,
        NotificationController.readNotification
    );

NotificationRouter.route('/count')
    .get(
        deviceHeaderValid,
        protect,
        NotificationController.countNotification
    );

NotificationRouter.route('/')
    .get(
        deviceHeaderValid,
        protect,
        NotificationValidator.validatePaginate(),
        NotificationValidator.validate,
        NotificationController.getNotifications
    );

NotificationRouter.route('/:id')
    .get(
        deviceHeaderValid,
        protect,
        NotificationValidator.validateGetNotification(),
        NotificationValidator.validate,
        NotificationController.getSingleNotification
    );
