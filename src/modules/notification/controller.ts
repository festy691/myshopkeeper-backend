import {NotificationService} from "./service";
import {AuthService} from "../auth/service";
import {Response} from "express";
import {CustomRequest} from "../../interface/custom_request";

import {
    HttpStatusCode,
    ResponseStatus,
    createResponse,
} from "../../middleware/response_formatter";

export default {
    async getNotifications(req: CustomRequest, res: Response) {
        try {
            const authUser = req.user;

            const {
                category,
            } = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);

            let query: any = {
                receiverId: req.user.id,
                ...category && {category}
            };

            const notifications = await NotificationService.allNotifications(query, page, limit);

            const response = {
                message: "Notifications fetched successfully",
                data: notifications,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );

        } catch (error: any) {
            throw error;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${error.message}`
            );*/
        }
    },

    async countNotification(req: CustomRequest, res: Response) {
        try {
            const authUser = req.user;
            const count = await NotificationService.countNotifications(authUser.Id);

            const response = {
                message: "Notification fetched successfully",
                data: count,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (error: any) {
            throw error;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${error.message}`
            );*/
        }
    },

    async readNotification(req: CustomRequest, res: Response) {
        try {
            const {id} = req.params;
            const notify = await NotificationService.getNotificationById(BigInt(id));

            if (!notify) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Failure,
                    `Notification does not exist`
                );
            }

            const notification = await NotificationService.updateNotification({isRead: true}, BigInt(id));

            const response = {
                message: "Notification marked as read",
                data: notification,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (error: any) {
            throw error;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${error.message}`
            );*/
        }
    },

    async getSingleNotification(req: CustomRequest, res: Response) {
        try {
            const {id} = req.params;

            const notify = await NotificationService.getNotificationById(BigInt(id));

            if (!notify) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Failure,
                    `Notification does not exist`
                );
            }

            const response = {
                message: "Notification fetched",
                data: notify,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (error: any) {
            throw error;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${error.message}`
            );*/
        }
    },

    async sendNotification(req: CustomRequest, res: Response) {
        try {
            const {userId, title, message, category} = req.body;
            const user = await AuthService.getSingleUser(userId);
            if (!user) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Failure,
                    `User does not exist`
                );
            }

            const notification = await NotificationService.createNotification({
                title,
                message,
                receiverId: userId,
                category
            });

            const response = {
                message: "Notification sent",
                data: notification,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (error: any) {
            throw error;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${error.message}`
            );*/
        }
    },

}
