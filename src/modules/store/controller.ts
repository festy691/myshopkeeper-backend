import {StoreService} from "./service";
import {CustomRequest} from "../../interface/custom_request";
import {createResponse, HttpStatusCode, ResponseStatus} from "../../middleware/response_formatter";
import {Response} from "express";
import {AuthService} from "../auth/service";
import {checkUserWorksStore, checkUserWorksStoreBranch, extractValues, generateStoreId} from "../../config/util";
import {Permissions} from "../../middleware/permission";
import {APIRequest} from "../../config/APIRequest";
import {configData} from "../../config/env_config";

const {
    TMS_API,
} = configData;

export default {
    async fetchGenericRoles(req: CustomRequest, res: Response) {
        try {
            let cashierRole = await StoreService.singleGenericRoleByName("Cashier");
            if (!cashierRole) {
                let cashierPermission = extractValues(Permissions.Cashier);
                cashierRole = await StoreService.createStoreRole({
                    title: 'Cashier',
                    description: 'Cashier role',
                    permissions: cashierPermission.join(","),
                    isGeneric: true
                });
            }
            let adminRole = await StoreService.singleGenericRoleByName('Admin');
            if (!adminRole) {
                let adminPermission = extractValues(Permissions.SuperAdmin);
                adminRole = await StoreService.createStoreRole({
                    title: 'Admin',
                    description: 'Admin role',
                    permissions: adminPermission.join(","),
                    isGeneric: true
                });
            }
            let salesRole = await StoreService.singleGenericRoleByName('Manager');
            if (!salesRole) {
                let salesPermission = extractValues(Permissions.SalesAdmin);
                salesRole = await StoreService.createStoreRole({
                    title: 'Manager',
                    description: 'Manager role',
                    permissions: salesPermission.join(","),
                    isGeneric: true
                });
            }

            let response: any = {
                message: `Roles created successfully!!!`,
                data: {
                    cashierRole,
                    salesRole,
                    adminRole
                },
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllPermissions(req: CustomRequest, res: Response) {
        try {
            const response = {
                message: `Data fetched!!!`,
                data: extractValues(Permissions.SuperAdmin),
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllStoreRoles(req: CustomRequest, res: Response) {
        try {
            const storeId: any = req.store.id;

            let searchQuery: any = {};

            searchQuery = {
                OR: [
                    {storeId: BigInt(storeId)},
                    {isGeneric: true},
                ],
            }

            const result = await StoreService.allStoreRoles(searchQuery);
            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllWorkers(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const branchId: any = req.query.branchId;
            const storeId: any = req.store.id;

            let query: any = {};
            let searchQuery: any = {};

            if (storeId) {
                searchQuery = {
                    storeProfileRole: {storeId: BigInt(storeId)},
                    ...branchId && {storeBranchId: BigInt(branchId)},
                }
            }

            if (startDate || endDate) {
                const date = endDate ? new Date(endDate) : new Date();
                const dateEnd = new Date(date.setDate(date.getDate()));
                dateEnd.setHours(23, 59, 59, 999);
                const date2 = startDate ? new Date(startDate) : new Date("2000-06-12");
                const dateStart = new Date(date2.setDate(date2.getDate() - 1));
                dateStart.setHours(23, 59, 59, 999);
                searchQuery.createdAt = {
                    gte: dateStart,
                    lte: dateEnd
                };
            }

            if (search) {
                query.AND = [
                    searchQuery, // Ensure the product is available
                    {
                        OR: [
                            {user: {firstName: {contains: search}}},
                            {user: {lastName: {contains: search}}},
                            {user: {email: {contains: search}}},
                            {user: {phoneNumber: {contains: search}}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await StoreService.allWorkers(query, page, limit);
            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllBranchWorkers(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const branchId: any = req.params.id;

            let searchQuery: any;

            searchQuery = {
                storeBranchId: BigInt(branchId),
            }

            const result = await StoreService.allBranchWorkers(searchQuery);

            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllStoreWorkers(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const storeId: any = req.params.id;

            let searchQuery: any;

            searchQuery = {
                storeId: BigInt(storeId),
            }

            const result = await StoreService.allBranchWorkers(searchQuery);
            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllStores(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const userId: any = req.user.id;

            let query: any = {};
            let searchQuery: any = {};

            // Filter by userId
            if (userId) {
                searchQuery.OR = [
                    // If the user is a worker
                    {workers: {some: {user: {id: BigInt(userId)}}}},
                    // If the user is the owner
                    {createdBy: BigInt(userId)},
                ];
            }

            // Filter by date range
            if (startDate || endDate) {
                const date = endDate ? new Date(endDate) : new Date();
                const dateEnd = new Date(date.setDate(date.getDate()));
                dateEnd.setHours(23, 59, 59, 999);

                const date2 = startDate ? new Date(startDate) : new Date("2000-06-12");
                const dateStart = new Date(date2.setDate(date2.getDate() - 1));
                dateStart.setHours(0, 0, 0, 0); // Start of the day

                searchQuery.createdAt = {
                    gte: dateStart,
                    lte: dateEnd,
                };
            }

            // Filter by search term
            if (search) {
                query.AND = [
                    searchQuery, // Ensure the product is available
                    {
                        OR: [
                            {name: {contains: search,}},
                            {description: {contains: search,}},
                            {businessEmail: {contains: search,}},
                            {contactEmail: {contains: search,}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await StoreService.allStores(query, page, limit);
            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllMerchants(req: CustomRequest, res: Response) {
        try {
            const result = await StoreService.allStoresNoPagination();
            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async getAllStoreBranches(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;

            let query: any = {};
            let searchQuery: any = {};

            searchQuery.storeId = BigInt(req.store.id);

            // Filter by date range
            if (startDate || endDate) {
                const date = endDate ? new Date(endDate) : new Date();
                const dateEnd = new Date(date.setDate(date.getDate()));
                dateEnd.setHours(23, 59, 59, 999);

                const date2 = startDate ? new Date(startDate) : new Date("2000-06-12");
                const dateStart = new Date(date2.setDate(date2.getDate() - 1));
                dateStart.setHours(0, 0, 0, 0); // Start of the day

                searchQuery.createdAt = {
                    gte: dateStart,
                    lte: dateEnd,
                };
            }

            // Filter by search term
            if (search) {
                query.AND = [
                    searchQuery, // Ensure the product is available
                    {
                        OR: [
                            {name: {contains: search,}},
                            {description: {contains: search,}},
                            {contactEmail: {contains: search,}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await StoreService.allStoreBranches(query, page, limit);
            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async getStoreBranches(req: CustomRequest, res: Response) {
        try {
            let searchQuery: any = {};

            searchQuery.storeId = BigInt(req.store.id);

            const result = await StoreService.allBranches(searchQuery);
            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async getSingleStoreRole(req: CustomRequest, res: Response) {
        try {
            const roleId: any = req.params.id;

            const result = await StoreService.singleStoreRole(roleId);
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Role does not exist!!!`
                );
            }

            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async getSingleWorker(req: CustomRequest, res: Response) {
        try {
            const workerId: any = req.params.id;

            const result = await StoreService.singleWorker(workerId);
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Worker does not exist!!!`
                );
            }

            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async getSingleStore(req: CustomRequest, res: Response) {
        try {
            const storeId: any = req.params.id;

            const result = await StoreService.singleStore(storeId);
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Store does not exist!!!`
                );
            }

            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async getSingleBranch(req: CustomRequest, res: Response) {
        try {
            const branchId: any = req.params.id;

            const result = await StoreService.singleStoreBranch(branchId);
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Store branch does not exist!!!`
                );
            }

            const response = {
                message: `Data fetched!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async createStoreRole(req: CustomRequest, res: Response) {
        try {
            const {title, description, permissions} = req.body;

            const exist = await StoreService.singleStoreRoleByName(BigInt(req.store.id), title);
            if (exist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Role with title '${title}' already exist!!!`
                );
            }

            let genericRole = await StoreService.singleGenericRoleByName(title);
            if (genericRole) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Role with title '${title}' already exist!!!`
                );
            }

            let query = {
                title,
                description,
                permissions: permissions.join(", "),
                storeId: BigInt(req.store.id)
            }

            const result = await StoreService.createStoreRole(query)

            const response = {
                message: `Role created!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async updateStoreRole(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {title, description, permissions} = req.body;

            await checkUserWorksStore(BigInt(req.user.id), BigInt(req.store.id));
            if (title) {
                const exist = await StoreService.singleStoreRole(BigInt(id));
                if (!exist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusNotFound,
                        ResponseStatus.Error,
                        `Role does not exist!!!`
                    );
                }

                let genericRole = await StoreService.singleGenericRoleByName(title);
                if (genericRole) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Role with title '${title}' already exist!!!`
                    );
                }
            }

            let query = {
                ...title && {title},
                ...description && {description},
                ...permissions && {permissions: permissions.join(", ")},
            }

            const result = await StoreService.updateStoreRole(query, BigInt(id))

            const response = {
                message: `Role created!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async assignRoleToUser(req: CustomRequest, res: Response) {
        try {
            const {roleId, branchId, userId} = req.body;

            const branchExist = await StoreService.singleStoreBranch(BigInt(branchId));
            if (!branchExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Branch does not exist!!!`
                );
            }

            await checkUserWorksStoreBranch(BigInt(req.user.id), BigInt(branchId));

            const roleExist = await StoreService.singleStoreRole(BigInt(roleId));
            if (!roleExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Roles does not exist!!!`
                );
            }

            const userExist = await AuthService.getSingleUser(BigInt(userId));
            if (!userExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User does not exist!!!`
                );
            }

            const userHasRoleForStore = await StoreService.singleWorkerByUserAndStoreId(BigInt(req.store.id), BigInt(userId));
            let result = {}
            if (userHasRoleForStore) {
                let query = {
                    roleId: BigInt(roleId),
                    userId: BigInt(userId)
                }

                result = await StoreService.updateWorker(query, BigInt(userHasRoleForStore.id));
            } else {
                let query = {
                    roleId: BigInt(roleId),
                    storeBranchId: BigInt(branchId),
                    userId: BigInt(userId),
                    storeId: BigInt(branchExist.store.id)
                }

                result = await StoreService.createWorker(query);
            }

            const response = {
                message: `Role assigned to user!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async createStore(req: CustomRequest, res: Response) {
        try {
            const {name, description, businessEmail, contactEmail, phoneNumber} = req.body;
            const userHasStore = await StoreService.singleStoreByOwnerId(BigInt(req.user.id));
            if (userHasStore) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User already have an existing store!!!`
                );
            }

            if (req.user.userType != "storeOwner") {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `This user does not have the permission to create a store!!!`
                );
            }
            let query = {
                name,
                description,
                businessEmail,
                ...contactEmail && {contactEmail},
                ...phoneNumber && {phoneNumber},
                storeNumber: generateStoreId(name),
                createdBy: BigInt(req.user.id)
            }

            const result = await StoreService.createStore(query);
            if (result) {
                let branchQuery = {
                    name,
                    description,
                    ...contactEmail && {contactEmail},
                    ...phoneNumber && {phoneNumber},
                    storeId: BigInt(result.id),
                    branchNumber: generateStoreId(name),
                }
                await StoreService.createStoreBranch(branchQuery);
                await StoreService.createDiscountConfig({storeId: BigInt(result.id)});
            }
            const response = {
                message: `Store created!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async updateStore(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                name, description, businessEmail,
                contactEmail, phoneNumber, country,
                state, city, address, defaultCurrency,
                websiteUrl, lowStockCount, allowPayLater,
                allowMobileMoney, allowCardPayment, allowCash,
                applyVat, vatAmount, applyTax, taxAmount, logo,
                applyCovidLevy,
                covidLevyAmount,
                applyGEFL,
                geflAmount,
                applyNHIL,
                nhilAmount,
                applyServiceCharge,
                serviceCharge,
                applyTRLevy,
                trLevyAmount
            } = req.body;

            const storeExist = await StoreService.singleStore(BigInt(id));
            if (!storeExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Store does not exist!!!`
                );
            }

            await checkUserWorksStore(BigInt(req.user.id), BigInt(id));

            let query = {
                ...name && {name},
                ...description && {description},
                ...businessEmail && {businessEmail},
                ...contactEmail && {contactEmail},
                ...phoneNumber && {phoneNumber},
                ...country && {country},
                ...state && {state},
                ...city && {city},
                ...address && {address},
                ...defaultCurrency && {defaultCurrency},
                ...websiteUrl && {websiteUrl},
                ...lowStockCount && {lowStockCount},
                ...(allowPayLater !== null) && {allowPayLater},
                ...(allowMobileMoney !== null) && {allowMobileMoney},
                ...(allowCardPayment !== null) && {allowCardPayment},
                ...(allowCash !== null) && {allowCash},
                ...(applyVat !== null) && {applyVat},
                ...vatAmount && {vatAmount},
                ...(applyTax !== null) && {applyTax},
                ...taxAmount && {taxAmount},
                ...(applyNHIL !== null) && {applyNHIL},
                ...nhilAmount && {nhilAmount},
                ...(applyServiceCharge !== null) && {applyServiceCharge},
                ...serviceCharge && {serviceCharge},
                ...(applyGEFL !== null) && {applyGEFL},
                ...geflAmount && {geflAmount},
                ...(applyCovidLevy !== null) && {applyCovidLevy},
                ...covidLevyAmount && {covidLevyAmount},
                ...(applyTRLevy !== null) && {applyTRLevy},
                ...trLevyAmount && {trLevyAmount},
                ...logo && {logo},
            }

            const result = await StoreService.updateStore(query, BigInt(id));

            const response = {
                message: `Store updated!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async verifyTerminal(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                terminalSerial, tid
            } = req.body;
            const storeExist = await StoreService.singleStore(BigInt(id));
            if (!storeExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Store does not exist!!!`
                );
            }

            await checkUserWorksStore(BigInt(req.user.id), BigInt(id));

            let http = new APIRequest();
            const headers = {
                'Content-Type': 'application/json'
                // Add any other headers as needed
            };
            let url = `${TMS_API}/configurations/get/parameters?terminalId=${tid}&terminalSerial=${terminalSerial}`;
            const resultData: any = await http.get(url, headers);
            if (!resultData.status) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Failed to verify terminal!!!`
                );
            }
            let query = {
                terminalSerial,
                tid,
                mid: resultData.data.merchantId,
                terminalVerified: true
            }

            const result = await StoreService.updateStore(query, BigInt(id));

            const response = {
                message: `Terminal Verified!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async updateDiscount(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                discountCapValue, discountMinValue, discountCapApplied,
                discountMinApplied, discountType, discountActive,
                discountValue, discountStart, discountEnd
            } = req.body;

            let discountExist = await StoreService.singleDiscountConfig(BigInt(id));
            if (!discountExist) {
                discountExist = await StoreService.createDiscountConfig({storeId: BigInt(id)});
            }

            await checkUserWorksStore(BigInt(req.user.id), BigInt(req.store.id));

            let query = {
                ...discountCapValue && {discountCapValue: Number(discountCapValue)},
                ...discountMinValue && {discountMinValue: Number(discountMinValue)},
                ...discountValue && {discountValue: Number(discountValue)},
                ...(discountCapApplied === true || discountCapApplied === false) && {discountCapApplied: discountCapApplied},
                ...(discountMinApplied === true || discountMinApplied === false) && {discountMinApplied: discountMinApplied},
                ...(discountActive === true || discountActive === false) && {discountActive: discountActive},
                ...discountType && {discountType},
                ...discountStart && {discountStart: new Date(discountStart)},
                ...discountEnd && {discountEnd: new Date(discountEnd)},
            }

            const result = await StoreService.updateDiscountConfig(query, BigInt(discountExist.id));

            const response = {
                message: `Discount updated!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async createStoreBranch(req: CustomRequest, res: Response) {
        try {
            const {name, description, contactEmail, phoneNumber} = req.body;

            await checkUserWorksStore(BigInt(req.user.id), BigInt(req.store.id));

            let query = {
                name,
                description,
                ...contactEmail && {contactEmail},
                ...phoneNumber && {phoneNumber},
                storeId: BigInt(req.store.id),
                branchNumber: generateStoreId(name),
            }
            const result = await StoreService.createStoreBranch(query)
            const response = {
                message: `Branch created!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async updateStoreBranch(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                name, description,
                contactEmail, phoneNumber, country,
                state, city, address, defaultCurrency
            } = req.body;

            await checkUserWorksStoreBranch(BigInt(req.user.id), BigInt(id));

            const branchExist = await StoreService.singleStoreBranch(BigInt(id));
            if (!branchExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Branch does not exist!!!`
                );
            }

            let query = {
                ...name && {name},
                ...description && {description},
                ...contactEmail && {contactEmail},
                ...phoneNumber && {phoneNumber},
                ...country && {country},
                ...state && {state},
                ...city && {city},
                ...address && {address},
                ...defaultCurrency && {defaultCurrency},
            }

            const result = await StoreService.updateStoreBranch(query, BigInt(id));

            const response = {
                message: `Branch updated!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );*/
        }
    },

    async fetchMerchantOverview(req: CustomRequest, res: Response) {
        try {

            const overview = await StoreService.merchantsOverview();

            const response = {
                message: `Overview fetched!!!`,
                data: overview,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async fetchMerchantSummary(req: CustomRequest, res: Response) {
        try {
            const {search, status} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;

            let query: any = {};
            let queryStore: any = {};
            let searchQuery: any = {};

            if (startDate || endDate) {
                const date = endDate ? new Date(endDate) : new Date();
                const dateEnd = new Date(date.setDate(date.getDate()));
                dateEnd.setHours(23, 59, 59, 999);
                const date2 = startDate ? new Date(startDate) : new Date("2000-06-12");
                const dateStart = new Date(date2.setDate(date2.getDate() - 1));
                dateStart.setHours(23, 59, 59, 999);
                searchQuery.createdAt = {
                    gte: dateStart,
                    lte: dateEnd
                };
            }

            if (status) {
                if (status.toString().toLowerCase() === 'active') {
                    queryStore.store.terminalVerified = true
                } else if (status.toString().toLowerCase() === 'inactive') {
                    queryStore.store.terminalVerified = false
                }
            }

            if (search) {
                query.AND = [
                    searchQuery, // Ensure the product is available
                    {
                        OR: [
                            {store: {name: {contains: search}}},
                            {name: {contains: search}},
                            {contactEmail: {contains: search}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }
            const summary = await StoreService.merchantSummary(query, page, limit);

            const response = {
                message: `Merchant summary!!!`,
                data: summary,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },
}