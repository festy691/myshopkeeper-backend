import {prisma} from "../../config/dbInstance";

const StoreModel = prisma.store;
const TransactionModel = prisma.transaction;
const BranchModel = prisma.storeBranch;
const WorkerModel = prisma.storeWorker;
const BranchRoleModel = prisma.branchRole;
const DiscountModel = prisma.discountConfig;

class StoreService {
    static async allStoreRoles(query: any) {
        return BranchRoleModel.findMany({
            where: query,
            orderBy: {
                title: "asc",
            },
            select: {
                id: true,
                title: true,
                description: true,
                isGeneric: true,
                permissions: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async allWorkers(query: any, page: number, limit: number) {
        const [roles, total] = await Promise.all([
            WorkerModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
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
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            countryCode: true,
                            profilePicture: true,
                            loginDisabled: true,
                        }
                    }
                },
            }),
            WorkerModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...roles];
        return {total, pages, page, limit, docs};
    }

    static async allBranchWorkers(query: any) {
        return WorkerModel.findMany({
            where: query,
            orderBy: {
                createdAt: "desc",
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
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        countryCode: true,
                        profilePicture: true,
                        loginDisabled: true,
                    }
                }
            },
        });
    }

    static async allStores(query: any, page: number, limit: number) {
        const [roles, total] = await Promise.all([
            StoreModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    logo: true,
                    contactEmail: true,
                    businessEmail: true,
                    phoneNumber: true,
                    createdBy: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            StoreModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...roles];
        return {total, pages, page, limit, docs};
    }

    static async allStoresNoPagination() {
        return StoreModel.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                logo: true,
                contactEmail: true,
                businessEmail: true,
                phoneNumber: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async allStoreBranches(query: any, page: number, limit: number) {
        const [roles, total] = await Promise.all([
            BranchModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    contactEmail: true,
                    phoneNumber: true,
                    address: true,
                    city: true,
                    state: true,
                    country: true,
                    createdAt: true,
                    updatedAt: true,
                    workers: {
                        select: {
                            id: true,
                            roleId: true,
                            userId: true,
                        }
                    }
                },
            }),
            BranchModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...roles];
        return {total, pages, page, limit, docs};
    }

    static async allBranches(query: any) {
        return BranchModel.findMany({
            where: query,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                description: true,
                contactEmail: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async singleStoreRole(storeRoleId: bigint) {
        return BranchRoleModel.findUnique(
            {
                where: {id: storeRoleId},
                select: {
                    id: true,
                    title: true,
                    description: true,
                    permissions: true,
                    createdAt: true,
                    updatedAt: true,
                    workers: {
                        select: {
                            id: true,
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
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    phoneNumber: true,
                                    countryCode: true,
                                    profilePicture: true,
                                }
                            }
                        }
                    }
                }
            }
        );
    }

    static async singleStoreRoleByName(storeId: bigint, title: string) {
        return BranchRoleModel.findUnique(
            {
                where: {storeId_title: {storeId, title}},
                select: {
                    id: true,
                    title: true,
                    description: true,
                    permissions: true,
                    createdAt: true,
                    updatedAt: true,
                    workers: {
                        select: {
                            id: true,
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
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    phoneNumber: true,
                                    countryCode: true,
                                    profilePicture: true,
                                }
                            }
                        }
                    }
                }
            }
        );
    }

    static async singleGenericRoleByName(title: string) {
        return BranchRoleModel.findFirst(
            {
                where: {title: title, isGeneric: true},
                select: {
                    id: true,
                    title: true,
                    description: true,
                    permissions: true,
                    createdAt: true,
                    updatedAt: true,
                }
            }
        );
    }

    static async singleRoleByStoreNameAndRoleName(storeId: bigint, title: string) {
        return BranchRoleModel.findUnique(
            {
                where: {storeId_title: {storeId, title}},
                select: {
                    id: true,
                    title: true,
                    description: true,
                    permissions: true,
                    createdAt: true,
                    updatedAt: true,
                }
            }
        );
    }

    static async singleWorkerByUserAndBranchId(branchId: bigint, userId: bigint) {
        return WorkerModel.findUnique(
            {
                where: {storeBranchId_userId: {storeBranchId: branchId, userId}},
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
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            countryCode: true,
                            profilePicture: true,
                        }
                    }
                }
            }
        );
    }

    static async singleWorkerByUserAndStoreId(storeId: bigint, userId: bigint) {
        return WorkerModel.findFirst(
            {
                where: {storeId, userId},
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
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            countryCode: true,
                            profilePicture: true,
                        }
                    }
                }
            }
        );
    }

    static async singleWorker(storeRoleId: bigint) {
        return WorkerModel.findUnique(
            {
                where: {id: storeRoleId},
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
                            createdAt: true,
                            updatedAt: true,
                        }
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
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            countryCode: true,
                            profilePicture: true,
                        }
                    }
                }
            }
        );
    }

    static async singleDiscountConfig(storeRoleId: bigint) {
        return DiscountModel.findUnique(
            {
                where: {storeId: storeRoleId},
            }
        );
    }

    static async singleStore(storeRoleId: bigint) {
        return StoreModel.findUnique(
            {
                where: {id: storeRoleId},
                select: {
                    id: true,
                    mid: true,
                    tid: true,
                    terminalSerial: true,
                    terminalVerified: true,
                    name: true,
                    description: true,
                    logo: true,
                    businessEmail: true,
                    contactEmail: true,
                    phoneNumber: true,
                    country: true,
                    state: true,
                    city: true,
                    address: true,
                    defaultCurrency: true,
                    storeNumber: true,
                    websiteUrl: true,
                    lowStockCount: true,
                    allowPayLater: true,
                    allowMobileMoney: true,
                    allowCardPayment: true,
                    allowCash: true,
                    applyVat: true,
                    vatAmount: true,
                    applyTax: true,
                    taxAmount: true,
                    applyCovidLevy: true,
                    covidLevyAmount: true,
                    applyGEFL: true,
                    geflAmount: true,
                    applyNHIL: true,
                    nhilAmount: true,
                    applyServiceCharge: true,
                    serviceCharge: true,
                    applyTRLevy: true,
                    trLevyAmount: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    discountConfig: true,
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            countryCode: true,
                            profilePicture: true,
                        }
                    },
                    storeBranches: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            contactEmail: true,
                            phoneNumber: true,
                        }
                    }
                }
            }
        );
    }

    static async singleStoreAuth(storeRoleId: bigint) {
        return StoreModel.findUnique(
            {
                where: {id: storeRoleId},
                select: {
                    id: true,
                    mid: true,
                    tid: true,
                    terminalSerial: true,
                    terminalVerified: true,
                    name: true,
                    description: true,
                    logo: true,
                    businessEmail: true,
                    contactEmail: true,
                    phoneNumber: true,
                    country: true,
                    state: true,
                    city: true,
                    address: true,
                    defaultCurrency: true,
                    storeNumber: true,
                    websiteUrl: true,
                    lowStockCount: true,
                    allowPayLater: true,
                    allowMobileMoney: true,
                    allowCardPayment: true,
                    allowCash: true,
                    applyVat: true,
                    vatAmount: true,
                    applyTax: true,
                    taxAmount: true,
                    applyCovidLevy: true,
                    covidLevyAmount: true,
                    applyGEFL: true,
                    geflAmount: true,
                    applyNHIL: true,
                    nhilAmount: true,
                    applyServiceCharge: true,
                    serviceCharge: true,
                    applyTRLevy: true,
                    trLevyAmount: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    discountConfig: true,
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            countryCode: true,
                            profilePicture: true,
                        }
                    },
                }
            }
        );
    }

    static async singleStoreByOwnerId(ownerId: bigint) {
        return StoreModel.findFirst(
            {
                where: {createdBy: ownerId},
                select: {
                    id: true,
                    mid: true,
                    tid: true,
                    terminalSerial: true,
                    terminalVerified: true,
                    name: true,
                    description: true,
                    logo: true,
                    businessEmail: true,
                    contactEmail: true,
                    phoneNumber: true,
                    country: true,
                    state: true,
                    city: true,
                    address: true,
                    defaultCurrency: true,
                    storeNumber: true,
                    websiteUrl: true,
                    lowStockCount: true,
                    allowPayLater: true,
                    allowMobileMoney: true,
                    allowCardPayment: true,
                    allowCash: true,
                    applyVat: true,
                    vatAmount: true,
                    applyTax: true,
                    taxAmount: true,
                    applyCovidLevy: true,
                    covidLevyAmount: true,
                    applyGEFL: true,
                    geflAmount: true,
                    applyNHIL: true,
                    nhilAmount: true,
                    applyServiceCharge: true,
                    serviceCharge: true,
                    applyTRLevy: true,
                    trLevyAmount: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    discountConfig: true,
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            countryCode: true,
                            profilePicture: true,
                        }
                    },
                }
            }
        );
    }

    static async singleStoreBranch(id: bigint) {
        return BranchModel.findUnique(
            {
                where: {id: id},
                select: {
                    id: true,
                    name: true,
                    description: true,
                    contactEmail: true,
                    phoneNumber: true,
                    branchNumber: true,
                    country: true,
                    state: true,
                    city: true,
                    address: true,
                    defaultCurrency: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    workers: {
                        select: {
                            id: true,
                            roleId: true,
                            userId: true,
                        }
                    },
                    store: {
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
                            status: true,
                        }
                    },
                }
            }
        );
    }

    static async singleStoreBranchAuth(id: bigint) {
        return BranchModel.findUnique(
            {
                where: {id: id},
            }
        );
    }

    static async checkUserWorksForStore(storeId: bigint, userId: bigint) {
        return WorkerModel.findFirst({
            where: {
                storeId,
                userId
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
                    }
                }
            },
        });
    }

    static async getBranchUserUserWorks(storeId: bigint, userId: bigint) {
        return WorkerModel.findFirst({
            where: {
                userId: userId,
                storeId: storeId
            },
            select: {
                id: true,
                staffCode: true,
                createdAt: true,
                updatedAt: true,
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
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        countryCode: true,
                        profilePicture: true,
                    }
                },
                storeProfileRole: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        permissions: true,
                    }
                }
            },
        });
    }

    static async createStoreRole(query: any) {
        return BranchRoleModel.create({data: query});
    }

    static async createWorker(query: any) {
        return WorkerModel.create({data: query});
    }

    static async createStore(query: any) {
        return StoreModel.create({data: query});
    }

    static async createStoreBranch(query: any) {
        return BranchModel.create({data: query});
    }

    static async createDiscountConfig(query: any) {
        return DiscountModel.create({data: query});
    }

    static async updateStoreRole(query: any, id: bigint) {
        return BranchRoleModel.update({
            where: {id: id},
            data: query
        });
    }

    static async updateWorker(query: any, id: bigint) {
        return WorkerModel.update({
            where: {id: id},
            data: query
        });
    }

    static async updateStore(query: any, id: bigint) {
        return StoreModel.update({
            where: {id: id},
            data: query
        });
    }

    static async updateStoreBranch(query: any, id: bigint) {
        return BranchModel.update({
            where: {id: id},
            data: query
        });
    }

    static async updateDiscountConfig(query: any, id: bigint) {
        return DiscountModel.update({
            where: {id: id},
            data: query
        });
    }

    static async merchantsOverview() {
        const [activeMerchantCount, inactiveMerchantCount, transactionCount, transactionSum] = await Promise.all([
            StoreModel.count({where: {terminalVerified: true}}),
            StoreModel.count({where: {terminalVerified: false}}),
            TransactionModel.count({where: {status: 'paid'}}),
            TransactionModel.aggregate({
                _sum: {
                    amountPaid: true,
                },
            }),
        ]);

        return {
            activeMerchantCount: activeMerchantCount ?? 0,
            inactiveMerchantCount: inactiveMerchantCount ?? 0,
            transactionCount: transactionCount ?? 0,
            transactionSum: transactionSum._sum.amountPaid ?? 0,
        }
    }

    static async merchantSummary(query: any, page: number, limit: number) {
        const [row, total] = await Promise.all([
            BranchModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    store: true,
                    transactions: {
                        where: {status: 'paid'},
                        select: {
                            amountPaid: true,
                            updatedAt: true,
                        },
                    },
                },
            }),
            BranchModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);

        const result = row.map(branch => {
            const paidTransactions = branch.transactions;
            const transactionAmount = paidTransactions.reduce((sum, tx) => sum + tx.amountPaid, 0);
            const lastTransactionDate = paidTransactions.reduce(
                (latest, tx) => latest > tx.updatedAt ? latest : tx.updatedAt,
                new Date(0)
            );

            return {
                merchant: branch.store.name,
                merchantId: branch.store.mid,
                terminalId: branch.store.tid,
                branch: branch.name,
                businessEmail: branch.store.businessEmail,
                contactEmail: branch.contactEmail,
                phoneNumber: branch.phoneNumber,
                status: branch.store.terminalVerified ? 'Active' : 'Inactive',
                transactionAmount,
                transactionCount: paidTransactions.length,
                lastTransactionDate: paidTransactions.length > 0 ? lastTransactionDate : null,
                createdAt: branch.createdAt,
                updatedAt: branch.updatedAt,
            };
        });

        const docs = [...result];

        return {total, pages, page, limit, docs};
    }
}

export {StoreService}