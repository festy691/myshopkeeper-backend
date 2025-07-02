import {prisma} from "../../config/dbInstance";

const UserModel = prisma.user;
const DeviceModel = prisma.device
const WorkerModel = prisma.storeWorker;

class AuthService {
    static async allUsers(query: any, page: number, limit: number) {
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phoneNumber: true,
                    countryCode: true,
                    profilePicture: true,
                    accountEnabled: true,
                    accountSuspended: true,
                },
            }),
            prisma.user.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...users];
        return {total, pages, page, limit, docs};
    }

    static async getSingleUserAuthenticate(userId: bigint) {
        return UserModel.findUnique({
            where: {
                id: userId,
            },
        });
    }

    static async getSingleUser(userId: bigint) {
        return UserModel.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                countryCode: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                passwordHint: true,
                userType: true,
                enableTwoFa: true,
                accountEnabled: true,
                loginDisabled: true,
                profilePicture: true,
                accountSuspended: true,
                receiveNewsLetter: true,
                receiveNotification: true,
                resetPasswordCheckCompleted: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
                ownedStores: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        businessEmail: true,
                        contactEmail: true,
                        phoneNumber: true,
                        websiteUrl: true
                    }
                },
                storeWorkers: {
                    select: {
                        id: true,
                        staffCode: true,
                        store: {
                            select: {
                                id: true,
                            }
                        },
                        storeBranch: {
                            select: {
                                id: true,
                            }
                        },
                        storeProfileRole: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                permissions: true,
                            }
                        },
                    }
                }
            },
        });
    }

    static async getUserByCodeAndStoreId(code: string, storeId: bigint) {
        return WorkerModel.findUnique({
            where: {
                storeId_staffCode: {storeId: storeId, staffCode: code}
            },
            select: {
                id: true,
                staffCode: true,
                createdAt: true,
                updatedAt: true,
                storeProfileRole: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        permissions: true,
                    },
                },
                storeBranch: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        contactEmail: true,
                        phoneNumber: true,
                        country: true,
                        state: true,
                        city: true,
                        address: true,
                        branchNumber: true,
                    }
                },
                user: true,
            }
        });
    }

    static async getUserByEmail(email: string) {
        return UserModel.findUnique({
            where: {email},
        });
    }

    static async getUserByPhone(phoneNumber: string, countryCode: string,) {
        return UserModel.findUnique({
            where: {
                countryCode_phoneNumber: {
                    countryCode,
                    phoneNumber,
                },
            },
        });
    }

    static async updateUser(userObject: any, userId: bigint) {
        return UserModel.update({
            where: {
                id: userId,
            },
            data: userObject,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                countryCode: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                passwordHint: true,
                userType: true,
                accountEnabled: true,
                accountSuspended: true,
                receiveNewsLetter: true,
                receiveNotification: true,
                profilePicture: true,
                enableTwoFa: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
                ownedStores: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        businessEmail: true,
                        contactEmail: true,
                        phoneNumber: true,
                        websiteUrl: true
                    }
                },
                storeWorkers: {
                    select: {
                        id: true,
                        store: {
                            select: {
                                id: true,
                            }
                        },
                        storeBranch: {
                            select: {
                                id: true,
                            }
                        },
                        storeProfileRole: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                permissions: true,
                            }
                        },
                    }
                }
            },
        });
    }

    static async createUser(userObject: any) {
        return UserModel.create({
            data: {
                firstName: userObject.firstName,
                lastName: userObject.lastName,
                email: userObject.email,
                ...userObject.phoneNumber && {phoneNumber: userObject.phoneNumber},
                ...userObject.countryCode && {countryCode: userObject.countryCode},
                ...userObject.password && {password: userObject.password},
                ...userObject.profilePicture && {profilePicture: userObject.profilePicture},
                ...userObject.userType && {userType: userObject.userType},
                ...userObject.otpCode && {otpCode: userObject.otpCode},
                ...userObject.otpExpirationTime && {otpExpirationTime: userObject.otpExpirationTime},
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                countryCode: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                profilePicture: true,
                passwordHint: true,
                userType: true,
                enableTwoFa: true,
                accountEnabled: true,
                accountSuspended: true,
                receiveNewsLetter: true,
                receiveNotification: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
                ownedStores: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        businessEmail: true,
                        contactEmail: true,
                        phoneNumber: true,
                        websiteUrl: true
                    }
                },
                storeWorkers: {
                    select: {
                        id: true,
                        store: {
                            select: {
                                id: true,
                            }
                        },
                        storeBranch: {
                            select: {
                                id: true,
                            }
                        },
                        storeProfileRole: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                permissions: true,
                            }
                        },
                    }
                }
            },
        });
    }

    static async addDevice(deviceObject: any) {
        return DeviceModel.create({
            data: {
                name: deviceObject.name,
                deviceUniqueId: deviceObject.deviceUniqueId,
                deviceIp: deviceObject.deviceIp,
                userId: deviceObject.userId
            },
        });
    }

    static async updateDeviceToken(deviceObject: any, deviceId: string) {
        return DeviceModel.update({
            where: {
                deviceUniqueId: deviceId,
            },
            data: {
                token: deviceObject.token,
                refreshToken: deviceObject.refreshToken,
            },
        });
    }

    static async getSingleDevice(deviceId: string) {
        return DeviceModel.findUnique({
            where: {
                deviceUniqueId: deviceId,
            },
            select: {
                id: true,
                name: true,
                deviceUniqueId: true,
                deviceIp: true,
                token: true,
                refreshToken: true,
            },
        });
    }

}

export {AuthService};
