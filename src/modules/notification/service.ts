import {prisma} from "../../config/dbInstance";

const NotificationModel = prisma.notification;

class NotificationService {
    static async allNotifications(query: any, page: number, limit: number) {
        const [notifications, total] = await Promise.all([
            NotificationModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    title: true,
                    message: true,
                    category: true,
                    isRead: true,
                    createdAt: true,
                    updatedAt: true,
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            countryCode: true,
                            phoneNumber: true,
                            profilePicture: true,
                        },
                    },
                },
            }),
            NotificationModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...notifications];
        return {total, pages, page, limit, docs};
    }

    static async countNotifications(userId: bigint) {
        const total = await NotificationModel.count({
            where: {receiverId: userId, isRead: false},
        });

        return total;
    }

    static async getNotificationById(id: bigint) {
        const doc = await NotificationModel.findUnique({
            where: {id: id},
            select: {
                id: true,
                title: true,
                message: true,
                category: true,
                isRead: true,
                createdAt: true,
                updatedAt: true,
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        countryCode: true,
                        phoneNumber: true,
                        profilePicture: true,
                    },
                },
            },
        });

        return doc;
    }

    static async updateNotification(
        notificationObject: any,
        notificationId: bigint
    ) {
        const user = await NotificationModel.update({
            where: {
                id: notificationId,
            },
            data: notificationObject,
            select: {
                id: true,
                title: true,
                message: true,
                category: true,
                isRead: true,
                createdAt: true,
                updatedAt: true,
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        countryCode: true,
                        phoneNumber: true,
                        profilePicture: true,
                    },
                },
            },
        });
        return user;
    }

    static async createNotification(notificationObject: any) {
        const user = await NotificationModel.create({
            data: {
                title: notificationObject.title,
                message: notificationObject.message,
                category: notificationObject.category,
                receiverId: notificationObject.receiverId,
            },
            select: {
                id: true,
                title: true,
                message: true,
                category: true,
                isRead: true,
                createdAt: true,
                updatedAt: true,
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        countryCode: true,
                        phoneNumber: true,
                        profilePicture: true,
                    },
                },
            },
        });
        return user;
    }
}

export {NotificationService};
