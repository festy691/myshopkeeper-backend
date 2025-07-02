import {ProductService} from "./service";
import {CustomRequest} from "../../interface/custom_request";
import {createResponse, HttpStatusCode, ResponseStatus} from "../../middleware/response_formatter";
import {Response} from "express";
import {generateProductCode} from "../../config/util";
import XLSX from 'xlsx';
import {DiscountType, ProductStaus, StockType} from "@prisma/client";
import {CustomFile} from "../../interface/custom_file";
import * as fs from 'fs';
import filePath from "path";
import {fileURLToPath} from "url";
import {promisify} from 'util';
import * as excel from 'excel4node';
import {prisma} from "../../config/dbInstance";

const writeFileAsync = promisify(fs.writeFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = filePath.dirname(__filename);


export default {
    async getAllCategories(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const storeId: any = req.store.id;

            let query: any = {};
            let searchQuery: any = {};

            if (storeId) {
                searchQuery = {
                    storeId: BigInt(storeId)
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
                    lte: dateEnd,
                };
            }

            if (search) {
                query.AND = [
                    searchQuery, // Ensure the product is available
                    {
                        OR: [
                            {name: {contains: search,}},
                            {description: {contains: search,}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await ProductService.getAllCategories(query, page, limit);
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

    async getAllCategoriesNoPagination(req: CustomRequest, res: Response) {
        try {
            const categories = await ProductService.getCategories(BigInt(req.store.id));

            const response = {
                message: `Data fetched!!!`,
                data: categories,
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

    async getAllSuppliers(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const storeId: any = req.store.id;

            let query: any = {};
            let searchQuery: any = {};

            if (storeId) {
                searchQuery = {
                    storeId: BigInt(storeId)
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
                    lte: dateEnd,
                };
            }

            if (search) {
                query.AND = [
                    searchQuery, // Ensure the product is available
                    {
                        OR: [
                            {name: {contains: search,}},
                            {description: {contains: search,}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await ProductService.getAllSuppliers(query, page, limit);
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

    async getAllSuppliersNoPagination(req: CustomRequest, res: Response) {
        try {
            const suppliers = await ProductService.getSuppliers(BigInt(req.store.id));

            const response = {
                message: `Data fetched!!!`,
                data: suppliers,
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

    async getAllProducts(req: CustomRequest, res: Response) {
        try {
            const {categoryId, supplierId, branchId, minAmount, maxAmount} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const search: any = req.query.search;
            const storeId: any = req.store.id;

            let query: any = {};
            let searchQuery: any = {
                ...(storeId && {storeId: BigInt(storeId)}),
                ...(branchId && {storeBranchId: BigInt(branchId as string)}),
                ...(supplierId && {supplierId: BigInt(supplierId as string)}),
                ...(categoryId && {categoryId: BigInt(categoryId as string)}),
            };

            // Date filtering (Merge with existing searchQuery)
            if (startDate || endDate) {
                const dateEnd = endDate ? new Date(endDate) : new Date();
                dateEnd.setHours(23, 59, 59, 999);

                const dateStart = startDate ? new Date(startDate) : new Date("2000-06-12");
                dateStart.setHours(0, 0, 0, 0);

                searchQuery.createdAt = {
                    gte: dateStart,
                    lte: dateEnd,
                };
            }

            // Amount filtering (Merge with existing searchQuery)
            if (minAmount || maxAmount) {
                const min = minAmount ? Number(minAmount) : 0;
                const max = maxAmount ? Number(maxAmount) : Number.MAX_VALUE;

                searchQuery.amount = {
                    gte: min,
                    lte: max,
                };
            }

            // Search filtering (Merge with existing searchQuery)
            if (search) {
                query.AND = [
                    searchQuery, // Ensure the product is available
                    {
                        OR: [
                            {name: {contains: search,}},
                            {description: {contains: search,}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await ProductService.getAllProducts(query, page, limit);
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

    async getAllProductsNoPagination(req: CustomRequest, res: Response) {
        try {
            const branchId = req.params.branchId;

            const status: any = req.params.status;
            const storeId: any = req.store.id;

            let searchQuery: any = {
                ...(storeId && {storeId: BigInt(storeId)}),
                storeBranchId: BigInt(branchId),
            };

            if (status === "all") {

            } else if (status === "active") {
                searchQuery = {
                    ...searchQuery,
                    quantity: {gt: Number(0)},
                }
            } else if (status === "low") {
                searchQuery = {
                    ...searchQuery,
                    quantity: {lte: Number(req.store.lowStockCount), gt: Number(0)},
                }
            } else if (status === "out") {
                searchQuery = {
                    ...searchQuery,
                    quantity: {lte: Number(0)},
                }
            } else {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid status supplied!!!`
                );
            }

            const result = await ProductService.getAllProductsNoPagination(searchQuery);
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

    async getSingleCategory(req: CustomRequest, res: Response) {
        try {
            const id: any = req.params.id;

            const result = await ProductService.getCategoryById(BigInt(id));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Category does not exist!!!`
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

    async getSingleSupplier(req: CustomRequest, res: Response) {
        try {
            const id: any = req.params.id;

            const result = await ProductService.getSupplierById(BigInt(id));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Supplier does not exist!!!`
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

    async getSingleProduct(req: CustomRequest, res: Response) {
        try {
            const id: any = req.params.id;

            const result = await ProductService.getProductById(BigInt(id));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Product does not exist!!!`
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

    async getProductByCode(req: CustomRequest, res: Response) {
        try {
            const code: any = req.params.code;

            const result = await ProductService.getProductByCode(code);
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Product does not exist!!!`
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

    async updateCategory(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                name, description,
            } = req.body;

            const dataExist = await ProductService.getCategoryById(BigInt(id));
            if (!dataExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Category does not exist!!!`
                );
            }

            let query = {
                ...name && {name: name.toLowerCase()},
                ...description && {description},
            }

            const result = await ProductService.updateCategoryById(BigInt(id), query);

            const response = {
                message: `Category updated!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async updateSupplier(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                name, email, phoneNumber,
            } = req.body;

            const dataExist = await ProductService.getSupplierById(BigInt(id));
            if (!dataExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Supplier does not exist!!!`
                );
            }

            let query = {
                ...name && {name: name.toLowerCase()},
                ...email && {email},
                ...phoneNumber && {phoneNumber},
            }

            const result = await ProductService.updateSupplierById(BigInt(id), query);

            const response = {
                message: `Supplier updated!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async updateProduct(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                name, amount, costAmount, availabilityStatus, isEnabled,
                barCode, productCode, description, productImage,
                quantity, stockType, notifySupplier, hasDiscount,
                discountType, discountValue, supplierId, categoryId
            } = req.body;

            const dataExist = await ProductService.getProductById(BigInt(id));
            if (!dataExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Product does not exist!!!`
                );
            }

            if (hasDiscount) {
                if (!dataExist.discountValue && !discountValue) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `You cannot activate discount for a single product without setting the discount value!!!`
                    );
                }
            }

            let query = {
                ...name && {name: name.toLowerCase()},
                ...barCode && {barCode},
                ...productCode && {productCode},
                ...description && {description},
                ...productImage && {productImage},
                ...quantity && {quantity: Number(quantity)},
                ...discountValue && {discountValue: Number(discountValue)},
                ...supplierId && {supplierId: BigInt(supplierId)},
                ...categoryId && {categoryId: BigInt(categoryId)},
                ...amount && {amount: Number(amount), previousAmount: dataExist.amount},
                ...costAmount && {costAmount: Number(costAmount)},
                ...availabilityStatus && {availabilityStatus: availabilityStatus as ProductStaus},
                ...stockType && {stockType: stockType as StockType},
                ...discountType && {discountType: discountType as DiscountType},
                ...(isEnabled === true || isEnabled === false) && {isEnabled: isEnabled},
                ...(notifySupplier === true || notifySupplier === false) && {notifySupplier: notifySupplier},
                ...(hasDiscount === true || hasDiscount === false) && {hasDiscount: hasDiscount},
            }

            const result = await ProductService.updateProductById(BigInt(id), query);

            const response = {
                message: `Product updated!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async assignProductToSupplier(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                assign,
                supplierId
            } = req.body;

            const dataExist = await ProductService.getProductById(BigInt(id));
            if (!dataExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Product does not exist!!!`
                );
            }

            let query = {
                supplierId: assign ? BigInt(supplierId) : null,
            }

            const result = await ProductService.updateProductById(BigInt(id), query);

            const response = {
                message: `Assigned product to supplier!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async createCategory(req: CustomRequest, res: Response) {
        try {
            const {
                name, description,
            } = req.body;

            const storeId: any = req.store.id;

            const dataExist = await ProductService.getCategoryByStoreIdAndName(BigInt(storeId), name.toLowerCase());
            if (dataExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Category already exist!!!`
                );
            }

            let query = {
                name: name.toLowerCase(),
                storeId: BigInt(storeId),
                ...description && {description},
            }

            const result = await ProductService.createCategory(query);

            const response = {
                message: `Category created!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async createSupplier(req: CustomRequest, res: Response) {
        try {
            const id = req.params.id;
            const {
                name, email, phoneNumber
            } = req.body;

            const storeId: any = req.store.id;

            const dataExist = await ProductService.getSupplierByStoreIdAndName(BigInt(storeId), name.toLowerCase());
            if (dataExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Supplier already exist!!!`
                );
            }

            let query = {
                name: name.toLowerCase(),
                storeId: BigInt(storeId),
                phoneNumber: phoneNumber,
                email: email,
            }

            const result = await ProductService.createSupplier(query);

            const response = {
                message: `Supplier created!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async createProduct(req: CustomRequest, res: Response) {
        try {
            const {
                name, amount, availabilityStatus, isEnabled, costAmount,
                barCode, productCode, description, productImage,
                quantity, stockType, notifySupplier, hasDiscount,
                discountType, discountValue, supplierId, categoryId, storeBranchId
            } = req.body;

            const storeId: any = req.store.id;

            const dataExist = await ProductService.getProductByBranchIdAndName(BigInt(storeBranchId), name.toLowerCase());
            if (dataExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Product already exist!!!`
                );
            }

            let query = {
                storeId: BigInt(storeId),
                storeBranchId: BigInt(storeBranchId),
                name: name.toLowerCase(),
                productCode: productCode ? productCode : generateProductCode(name.split(' ')[0], 8),
                ...barCode && {barCode},
                ...description && {description},
                ...productImage && {productImage},
                ...costAmount && {costAmount: Number(costAmount)},
                quantity: Number(quantity),
                ...discountValue && {discountValue: Number(discountValue)},
                ...supplierId && {supplierId: BigInt(supplierId)},
                ...categoryId && {categoryId: BigInt(categoryId)},
                amount: Number(amount),
                ...availabilityStatus && {availabilityStatus: availabilityStatus as ProductStaus},
                ...stockType && {stockType: stockType as StockType},
                ...discountType && {discountType: discountType as DiscountType},
                ...(isEnabled === true || isEnabled === false) && {isEnabled: isEnabled},
                ...(notifySupplier === true || notifySupplier === false) && {notifySupplier: notifySupplier},
                ...(hasDiscount === true || hasDiscount === false) && {hasDiscount: hasDiscount},
            }
            const result = await ProductService.createProduct(query);

            const response = {
                message: `Product created!!!`,
                data: result,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async uploadCategoriesSheet(req: CustomRequest, res: Response) {
        try {
            const file = req.file as CustomFile;

            if (!file) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `No file uploaded!!!`
                );
            }

            const {path, originalname, filename} = file;

            if (!originalname.toLowerCase().endsWith('.xlsx')) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `Uploaded file is not a valid sheet!!!`
                );
            }

            // Read the Excel file
            const workbook = XLSX.readFile(path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet data to JSON
            const jsonData: Array<{
                name: string;
                description: string;
            }> = XLSX.utils.sheet_to_json(sheet, {
                header: ['name', 'description'],
                defval: '',
                range: 1,
            });

            // Extract unique names for bulk DB query
            const uniqueNames = Array.from(new Set(jsonData.map(item => item.name.toLowerCase())));

            // Query all suppliers by name in a single batch
            const categories = await ProductService.getCategoriesByStoreIdAndNames(
                BigInt(req.store.id),
                uniqueNames
            );

            // Create a Set of existing names for quick lookup
            const existingNamesSet = new Set(categories.map(category => category.name.toLowerCase()));

            // Track duplicates and existence
            const checkedNames = new Set<string>();
            const checkedData = jsonData.map(item => {
                const isDuplicate = checkedNames.has(item.name.toLowerCase());
                checkedNames.add(item.name.toLowerCase());
                return {
                    ...item,
                    storeId: req.store.id,
                    exist: existingNamesSet.has(item.name.toLowerCase()),
                    duplicate: isDuplicate,
                    message: existingNamesSet.has(item.name.toLowerCase()) ? "Already exist" : isDuplicate ? "Appeared multiple times" : "Good",
                };
            });

            fs.unlinkSync(path);

            const response = {
                message: `Filtered data from the sheet!!!`,
                data: checkedData,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async uploadSuppliersSheet(req: CustomRequest, res: Response) {
        try {
            const file = req.file as CustomFile;

            if (!file) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `No file uploaded!!!`
                );
            }

            const {path, originalname, filename} = file;

            if (!originalname.toLowerCase().endsWith('.xlsx')) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `Uploaded file is not a valid sheet!!!`
                );
            }
            // Read the Excel file
            const workbook = XLSX.readFile(path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet data to JSON
            const jsonData: Array<{
                name: string;
                email: string;
                phoneNumber: string;
            }> = XLSX.utils.sheet_to_json(sheet, {
                header: ['name', 'email', 'phoneNumber'],
                defval: '',
                range: 1,
            });

            // Extract unique names for bulk DB query
            const uniqueNames = Array.from(new Set(jsonData.map(item => item.name.toLowerCase())));

            // Query all suppliers by name in a single batch
            const suppliers = await ProductService.getSuppliersByStoreIdAndNames(
                BigInt(req.store.id),
                uniqueNames
            );

            // Create a Set of existing names for quick lookup
            const existingNamesSet = new Set(suppliers.map(supplier => supplier.name.toLowerCase()));

            // Track duplicates and existence
            const checkedNames = new Set<string>();
            const checkedData = jsonData.map(item => {
                const isDuplicate = checkedNames.has(item.name);
                checkedNames.add(item.name.toLowerCase());
                return {
                    ...item,
                    exist: existingNamesSet.has(item.name.toLowerCase()),
                    duplicate: isDuplicate,
                    message: existingNamesSet.has(item.name.toLowerCase()) ? "Already exist" : isDuplicate ? "Appeared multiple times" : "Good",
                };
            });

            const response = {
                message: `Filtered data from the sheet!!!`,
                data: checkedData,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async uploadProductsSheet(req: CustomRequest, res: Response) {
        try {
            const branchId = req.body.branchId;
            const file = req.file as CustomFile;

            if (!file) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `No file uploaded!!!`
                );
            }

            const {path, originalname, filename} = file;

            if (!originalname.toLowerCase().endsWith('.xlsx')) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `Uploaded file is not a valid sheet!!!`
                );
            }
            // Read the Excel file
            const workbook = XLSX.readFile(path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet data to JSON
            const jsonData: Array<{
                name: string;
                description: string;
                costAmount: string;
                price: string;
                quantity: string;
                stockType: string;
                category: string;
                supplier: string;
            }> = XLSX.utils.sheet_to_json(sheet, {
                header: ['name', 'description', 'costAmount', 'price', 'quantity', 'stockType', 'category', 'supplier'],
                defval: '',
                range: 1,
            });

            const storeId = BigInt(req.store.id);
            const [categories, suppliers] = await Promise.all([ProductService.getCategories(storeId), ProductService.getSuppliers(storeId)]);

            // Extract unique names for bulk DB query
            const uniqueNames = Array.from(new Set(jsonData.map(item => item.name.toLowerCase())));

            // Query all suppliers by name in a single batch
            const products = await ProductService.getProductsByBranchIdAndNames(
                BigInt(branchId),
                uniqueNames
            );

            // Create a Set of existing names for quick lookup
            const existingNamesSet = new Set(products.map(prod => prod.name.toLowerCase()));

            // Track duplicates and existence
            const checkedNames = new Set<string>();
            const checkedData = jsonData.map(item => {
                const isDuplicate = checkedNames.has(item.name.toLowerCase());
                checkedNames.add(item.name);
                let prevQuantity = products.find(prod => prod.name.toLowerCase() === item.name.toLowerCase())?.quantity;
                let prevPrice = products.find(prod => prod.name.toLowerCase() === item.name.toLowerCase())?.amount;
                let catId = categories.find((cat) => cat.name.toLowerCase() === item.category.toLowerCase())?.id;
                let supId = suppliers.find((sup) => sup.name.toLowerCase() === item.supplier.toLowerCase())?.id;
                return {
                    ...item,
                    name: item.name.toLowerCase(),
                    quantity: Number(item.quantity),
                    ...item.costAmount && {costAmount: Number(item.costAmount)},
                    price: Number(item.price),
                    previousPrice: prevPrice || null,
                    previousQuantity: prevQuantity || null,
                    categoryId: catId || null,
                    supplierId: supId || null,
                    productCode: generateProductCode(item.name.split(' ')[0], 8),
                    exist: existingNamesSet.has(item.name.toLowerCase()),
                    duplicate: isDuplicate,
                    message: existingNamesSet.has(item.name.toLowerCase()) ? "Already exist" : isDuplicate ? "Appeared multiple times" : "Good",
                };
            });

            const response = {
                message: `Filtered data from the sheet!!!`,
                data: checkedData,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async uploadMultipleCategories(req: CustomRequest, res: Response) {
        try {
            // Convert body data to JSON List
            const jsonData: Array<{
                name: string;
                description: string;
            }> = req.body.data;

            // Convert storeId from string to BigInt
            const transformedData = jsonData.map(item => ({
                ...item,
                name: item.name.toLowerCase(),
                storeId: BigInt(req.store.id),
            }));

            const uploads = await ProductService.createMultipleCategory(transformedData)

            const response = {
                message: `Uploaded categories!!!`,
                data: uploads,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async uploadMultipleSuppliers(req: CustomRequest, res: Response) {
        try {
            // Convert body data to JSON List
            const jsonData: Array<{
                name: string;
                email: string;
                phoneNumber: string;
            }> = req.body.data;

            // Convert storeId from string to BigInt
            const transformedData = jsonData.map(item => ({
                ...item,
                name: item.name.toLowerCase(),
                storeId: BigInt(req.store.id),
            }));

            const uploads = await ProductService.createMultipleSuppliers(transformedData)

            const response = {
                message: `Suppliers uploaded!!!`,
                data: uploads,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async uploadMultipleProducts(req: CustomRequest, res: Response) {
        try {
            const branchId = req.body.branchId;
            // Convert body data to JSON List
            const jsonData: Array<{
                name: string;
                description: string;
                productCode: string;
                price: string;
                costAmount: string;
                quantity: string;
                stockType: string | null;
                categoryId: string | null;
                previousQuantity: string | null;
                supplierId: string | null;
            }> = req.body.data;

            // Convert storeId from string to BigInt
            const transformedData = jsonData.map(item => ({
                name: item.name.toLowerCase(),
                description: item.description,
                productCode: item.productCode,
                ...(item.stockType) && {stockType: item.stockType.toLowerCase() as StockType},
                quantity: Number(item.quantity) + Number(item.previousQuantity || "0"),
                amount: Number(item.price),
                ...item.costAmount && {costAmount: Number(item.costAmount)},
                ...(item.categoryId) && {categoryId: BigInt(item.categoryId)},
                ...(item.supplierId) && {supplierId: BigInt(item.supplierId)},
                storeBranchId: BigInt(branchId),
                storeId: BigInt(req.store.id),
            }));

            const uploads = await ProductService.createMultipleProducts(transformedData)

            const response = {
                message: `Uploaded products!!!`,
                data: uploads,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async downloadCategoriesSheet(req: CustomRequest, res: Response) {
        try {
            // Define headers and sample data
            const headers = ['name', 'description'];
            const sampleData = [
                headers,
                ['Sample Name', 'Sample Description'], // Example row
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Multi_Category_Sample');

            const buffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});
            //res.setHeader('Content-Disposition', 'attachment; filename="multi_category_sample.xlsx"');
            //res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            const response = {
                message: `Document downloaded!!!`,
                data: buffer,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async downloadSuppliersSheet(req: CustomRequest, res: Response) {
        try {
            // Define headers and sample data
            const headers = ['name', 'email', 'phoneNumber'];
            const sampleData = [
                headers,
                ['Sample Name', 'test@email.com', '2339022113344'], // Example row
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Multi_Supplier_Sample');

            const buffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});
            //res.setHeader('Content-Disposition', 'attachment; filename="multi_supplier_sample.xlsx"');
            //res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            const response = {
                message: `Document downloaded!!!`,
                data: buffer,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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

    async downloadProductSheet(req: CustomRequest, res: Response) {
        try {
            // Fetch categories and suppliers from the database
            const categories = await ProductService.getCategories(BigInt(req.store.id));
            const suppliers = await ProductService.getSuppliers(BigInt(req.store.id));

            const categoryNames = categories.map(cat => cat.name);
            const supplierNames = suppliers.map(sup => sup.name);

            // Create a new workbook
            const workbook = new excel.Workbook();

            // Add the main sheet
            const productSheet = workbook.addWorksheet('Products');

            // Define headers
            const headers = ['Name', 'Description', 'costAmount', 'Price', 'Quantity', 'Stock Type', 'Category', 'Supplier'];
            headers.forEach((header, index) => {
                productSheet.cell(1, index + 1).string(header).style({bold: true});
            });

            // Add sample data
            productSheet.cell(2, 1).string('Sample Product');
            productSheet.cell(2, 2).string('Sample Description');
            productSheet.cell(2, 3).number(100);
            productSheet.cell(2, 3).number(100);
            productSheet.cell(2, 4).number(10);
            productSheet.cell(2, 5).string('Stock');

            // Add dropdown lists for categories and suppliers
            const categoryRange = categoryNames.join(',');
            const supplierRange = supplierNames.join(',');

            productSheet.addDataValidation({
                type: 'list',
                allowBlank: true,
                error: 'Invalid category',
                showDropDown: true,
                sqref: 'G2:G1000', // Range for Category column
                formulas: [categoryRange],
            });

            productSheet.addDataValidation({
                type: 'list',
                allowBlank: true,
                error: 'Invalid supplier',
                showDropDown: true,
                sqref: 'H2:H1000', // Range for Supplier column
                formulas: [supplierRange],
            });

            /*// Save the file locally
            const directory = filePath.resolve(__dirname, 'sheets');
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, {recursive: true});
            }
            const file = filePath.join(directory, 'ProductSheet.xlsx');

            await workbook.write(file);*/
            // Write the workbook to a buffer
            const buffer = await workbook.writeToBuffer();

            // Respond with the file path
            const response = {
                message: 'Document downloaded!!!',
                data: buffer,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            throw err;
        }
    },

    async stockSummary(req: CustomRequest, res: Response) {
        try {
            const store = req.store;
            const storeBranchId = req.query.branchId;

            const summary = await ProductService.getStockSummary(BigInt(store.id), storeBranchId, store.lowStockCount);
            const response = {
                message: `Fetched product summary!!!`,
                data: summary,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
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
}