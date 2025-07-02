import {SalesService} from "./service";
import {CustomRequest} from "../../interface/custom_request";
import {createResponse, HttpStatusCode, ResponseStatus} from "../../middleware/response_formatter";
import {Response} from "express";
import {convertBigIntToString, generateProductCode} from "../../config/util";
import {ProductService} from "../products/service";
import {StoreService} from "../store/service";
import {DiscountType, PaymentMethod, TransactionStatus} from "@prisma/client";
import {APIRequest} from "../../config/APIRequest";
import {configData} from "../../config/env_config";
import {Prisma} from "@prisma/client/extension";
import TransactionClient = Prisma.TransactionClient;
import {Transaction} from "sequelize";

const {
    TMS_API,
} = configData;

export default {
    async getAllTransactions(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const storeId: any = req.store.id;
            const branchId: any = req.query.branchId;
            const isPayLater: any = req.query.isPayLater;
            const status: any = req.query.status;
            const paymentType: any = req.query.paymentType;
            const cashierId: any = req.query.cashierId;

            let query: any = {};
            let searchQuery: any = {};

            if (storeId) {
                searchQuery = {
                    storeId: BigInt(storeId)
                }
            }

            if (branchId) {
                searchQuery.branchId = BigInt(branchId);
            }

            if (cashierId) {
                searchQuery.cashierId = BigInt(cashierId);
            }

            if (status) {
                searchQuery.status = status as TransactionStatus;
            }

            if (paymentType) {
                searchQuery.payments = {
                    some: {
                        paymentMethod: paymentType,
                    },
                };
            }

            if (isPayLater == 'true' || isPayLater == 'false') {
                searchQuery.isPayLater = isPayLater == 'true';
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
                            {transactionReference: {contains: search}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await SalesService.getAllTransaction(query, page, limit);
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

    async getAllShopsTransaction(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const storeId: any = req.query.storeId;
            const branchId: any = req.query.branchId;
            const paymentType: any = req.query.paymentType;

            let query: any = {};
            let searchQuery: any = {};

            if (storeId) {
                searchQuery = {
                    storeId: BigInt(storeId)
                }
            }

            if (branchId) {
                searchQuery.branchId = BigInt(branchId);
            }

            searchQuery.status = 'paid' as TransactionStatus;

            if (paymentType) {
                searchQuery.payments = {
                    some: {
                        paymentMethod: paymentType,
                    },
                };
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
                            {transactionReference: {contains: search}},
                            {store: {name: {contains: search}}},
                            {branch: {name: {contains: search}}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await SalesService.getAllShopsTransaction(query, page, limit);
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

    async getAllPayments(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const storeId: any = req.store.id;
            const transactionId: any = req.query.transactionId;

            let query: any = {};
            let searchQuery: any = {};

            if (transactionId) {
                searchQuery.transactionId = BigInt(transactionId);
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
                            {paymentRef: {contains: search}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await SalesService.getAllPayments(query, page, limit);
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

    async getAllSoldProducts(req: CustomRequest, res: Response) {
        try {
            const {search} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;
            const storeId: any = req.store.id;
            const transactionId: any = req.query.transactionId;
            const branchId: any = req.query.branchId;

            let query: any = {};
            let searchQuery: any = {};

            if (storeId) {
                searchQuery = {
                    storeId: BigInt(storeId)
                }
            }

            if (transactionId) {
                searchQuery.transactionId = BigInt(transactionId);
            }

            if (branchId) {
                searchQuery.branchId = BigInt(branchId);
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
                            {productName: {contains: search}},
                        ],
                    },
                ];
            } else {
                query = searchQuery;
            }

            const result = await SalesService.getAllSales(query, page, limit);
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

    //Get top 5 sold items
    async getTopSoldItems(req: CustomRequest, res: Response) {
        try {
            const storeId: any = req.store.id;
            const branchId: any = req.params.branchId;
            const cashierId: any = req.query.cashierId;

            const result = await SalesService.getTopSoldItems(storeId, branchId, cashierId);
            let resultData = [];
            for (let i = 0; i < result.length; i++) {
                let t: any = result[i];
                t.quantity = t._sum.quantity;
                resultData.push(t);
            }
            const response = {
                message: `Data fetched!!!`,
                data: resultData,
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

    //Get transaction by ID
    async getTransactionById(req: CustomRequest, res: Response) {
        try {
            const id: any = req.params.id;

            const result = await SalesService.getSingleTransactionById(BigInt(id));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Transaction does not exist!!!`
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

    //Get payment by ID
    async getPaymentById(req: CustomRequest, res: Response) {
        try {
            const id: any = req.params.id;

            const result = await SalesService.getSinglePaymentById(BigInt(id));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Payment does not exist!!!`
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

    //Get sales by ID
    async getSaleById(req: CustomRequest, res: Response) {
        try {
            const id: any = req.params.id;

            const result = await SalesService.getSingleSaleById(BigInt(id));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Sales record does not exist!!!`
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

    //Analyse transaction
    async analyseTransaction(req: CustomRequest, res: Response) {
        try {
            const branchId = req.body.branchId;
            const products: { id: string, quantity: number }[] = req.body.products;
            const branchExist = await StoreService.singleStoreBranch(BigInt(branchId));

            if (!branchExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Branch does not exist!!!`
                );
            }
            const productIds = products.map((prod) => BigInt(prod.id));
            const result = await ProductService.getProductsByBranchIdAndProductIds(BigInt(branchId), productIds);

            let totalPriceBeforeProductDiscount = 0;
            let totalPriceAfterProductDiscount = 0;
            let amountToPay = 0;
            let vat = 0;
            let tax = 0;
            let nhil = 0;
            let covidLevy = 0;
            let serviceCharge = 0;
            let gefl = 0;
            let trLevy = 0;
            let discountApplied = false;
            let storeDiscountAmount = 0;

            if (productIds.length != result.length) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Records of some of the selected products were not found!!!`
                );
            }
            for (const product of result) {
                let p = products.find((prod: { id: string, quantity: number }) => BigInt(prod.id) === product.id);
                if (!p) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `No record was found product with ID ${product.id}!!!`
                    );
                }
                if (product.quantity < p.quantity) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `${product.name} only have ${product.quantity} quantity left in stock!!!`
                    );
                }
                totalPriceBeforeProductDiscount = totalPriceBeforeProductDiscount + (product.amount * p.quantity);
                totalPriceAfterProductDiscount = totalPriceAfterProductDiscount + (product.amount * p.quantity) - (!product.hasDiscount ? 0 : product.discountType == DiscountType.fixed ? product.discountValue : ((product.discountValue / 100) * (product.amount * p.quantity)));
            }
            vat = req.store.applyVat ? (((req.store.vatAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
            tax = req.store.applyTax ? (((req.store.taxAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
            nhil = req.store.applyNHIL ? (((req.store.nhil || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
            gefl = req.store.applyGEFL ? (((req.store.gefl || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
            covidLevy = req.store.applyCovidLevy ? (((req.store.covidLevy || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
            serviceCharge = req.store.applyServiceCharge ? (((req.store.serviceCharge || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
            trLevy = req.store.applyTRLevy ? (((req.store.trLevyAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
            if (req.store.discountConfig.discountActive) {
                if (req.store.discountConfig.discountCapApplied && req.store.discountConfig.discountMinApplied) {
                    discountApplied = req.store.discountConfig.discountCapValue >= totalPriceBeforeProductDiscount && req.store.discountConfig.discountMinValue <= totalPriceBeforeProductDiscount;
                    storeDiscountAmount = !discountApplied ? 0 : req.store.discountConfig.discountType == DiscountType.fixed ? req.store.discountConfig.discountValue : ((req.store.discountConfig.discountValue / 100) * totalPriceBeforeProductDiscount);
                } else if (req.store.discountConfig.discountCapApplied) {
                    discountApplied = req.store.discountConfig.discountCapValue >= totalPriceBeforeProductDiscount;
                    storeDiscountAmount = !discountApplied ? 0 : req.store.discountConfig.discountType == DiscountType.fixed ? req.store.discountConfig.discountValue : ((req.store.discountConfig.discountValue / 100) * totalPriceBeforeProductDiscount);
                } else if (req.store.discountConfig.discountMinApplied) {
                    discountApplied = req.store.discountConfig.discountMinValue <= totalPriceBeforeProductDiscount;
                    storeDiscountAmount = !discountApplied ? 0 : req.store.discountConfig.discountType == DiscountType.fixed ? req.store.discountConfig.discountValue : ((req.store.discountConfig.discountValue / 100) * totalPriceBeforeProductDiscount);
                }
            }
            totalPriceBeforeProductDiscount = Number(totalPriceBeforeProductDiscount.toFixed(2));
            totalPriceAfterProductDiscount = Number(totalPriceAfterProductDiscount.toFixed(2));
            amountToPay = Number(amountToPay.toFixed(2));
            storeDiscountAmount = Number(storeDiscountAmount.toFixed(2));
            vat = Number(vat.toFixed(2));
            tax = Number(tax.toFixed(2));
            nhil = Number(nhil.toFixed(2));
            gefl = Number(gefl.toFixed(2));
            serviceCharge = Number(serviceCharge.toFixed(2));
            covidLevy = Number(covidLevy.toFixed(2));
            trLevy = Number(trLevy.toFixed(2));
            amountToPay = totalPriceAfterProductDiscount + vat + nhil + gefl + covidLevy + serviceCharge + trLevy - storeDiscountAmount;

            const response = {
                message: `Transaction analysis fetched!!!`,
                data: {
                    currency: req.store.defaultCurrency ?? "GHS",
                    totalPriceBeforeProductDiscount,
                    totalPriceAfterProductDiscount,
                    amountToPay: Number(amountToPay.toFixed(2)),
                    storeDiscountApplied: discountApplied,
                    storeDiscountAmount,
                    vat,
                    tax,
                    nhil,
                    gefl,
                    serviceCharge,
                    covidLevy,
                    trLevy,
                },
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

    //Create transaction
    async createTransaction(req: CustomRequest, res: Response) {
        try {
            const {branchId, isPayLater, cashierId} = req.body;
            const products: { id: string, quantity: number }[] = req.body.products;
            let customer: { name: string, phoneNumber: string, email: string } | null = req.body.customer;
            const branchExist = await StoreService.singleStoreBranchAuth(BigInt(branchId));

            if (!branchExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Branch does not exist!!!`
                );
            }

            if (products.length < 1) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Please select an item to purchase!!!`
                );
            }
            const amountPaid = 0;
            const result = await createTransaction(req, {
                cashierId,
                isPayLater,
                branchId,
                amountPaid,
                products,
                customer,
            });
            return createResponse(
                res,
                result.statusCode,
                result.status ? ResponseStatus.Success : ResponseStatus.Failure,
                !result.status ? `Please select an item to purchase!!!` : {message: result.message, data: result.data}
            );
        } catch (err: any) {
            throw err;
        }
    },

    //Create single offline transaction with payment
    async createSingleOfflineTransaction(req: CustomRequest, res: Response) {
        try {
            const cashierId: string = req.body.cashierId;
            const transactionId: string = req.body.transactionId;
            const isPayLater: string = req.body.isPayLater;
            const branchId: string = req.body.branchId;
            const paymentMethod: string = req.body.paymentMethod;
            const paymentReference: string = req.body.paymentReference;
            const currency: string = req.body.currency;
            const amountPaid: number = req.body.amountPaid;
            const amountToPay: number = req.body.amountToPay;
            const vat: number = req.body.vat;
            const nhil: number = req.body.nhil;
            const covidLevy: number = req.body.covidLevy;
            const serviceCharge: number = req.body.serviceCharge;
            const gefl: number = req.body.gefl;
            const trLevy: number = req.body.trLevy;
            const storeDiscountApplied: boolean = req.body.storeDiscountApplied;
            const storeDiscountAmount: number = req.body.storeDiscountAmount;
            const totalPriceBeforeProductDiscount: number = req.body.totalPriceBeforeProductDiscount;
            const totalPriceAfterProductDiscount: number = req.body.totalPriceAfterProductDiscount;

            const products: {
                id: string,
                quantity: number,
                amountPerItemAfterTax: number,
                productName: string,
                productDescription: string | null,
                costAmountPerItem: number,
                amountPerItem: number,
                totalAmount: number,
                hasDiscount: boolean,
                discountAmount: number,
            }[] = req.body.products;
            const customer: { name: string, phoneNumber: string, email: string } = req.body.customer;

            let result: any;
            if (transactionId) {
                result = await creatExistingTransaction(transactionId);
            } else {
                result = await createTransactionOffline(req, {
                    cashierId,
                    isPayLater,
                    branchId,
                    totalPriceBeforeProductDiscount,
                    totalPriceAfterProductDiscount,
                    amountPaid,
                    amountToPay,
                    vat,
                    nhil,
                    covidLevy,
                    serviceCharge,
                    gefl,
                    trLevy,
                    storeDiscountApplied,
                    storeDiscountAmount,
                    products,
                    customer,
                });
            }
            if (!result.status) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Transaction creation failed!!!`
                );
            }
            const paymentAmount = amountPaid;
            let totalPaid = (transactionId ? Number(result.data?.amountPaid) : 0) + Number(paymentAmount);
            let balance = Number(result.data?.amountToPay) - Number(totalPaid);

            if (balance < 0) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `The paid amount is higher than the balance amount!!!`
                );
            }

            let query = {
                amountPaid: Number(paymentAmount),
                paymentMethod: paymentMethod as PaymentMethod,
                paymentRef: paymentReference || `PAY-${new Date().valueOf()}`,
                customer: customer,
                ...currency && {currency},
                transactionId: BigInt(result.data?.id),
                cashierId: BigInt(cashierId),
            }

            let message = `Transaction successfully created!!!`;

            const payment = await SalesService.createPayment(query);

            if (!payment) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Payment failed!!!`
                );
            }
            const updatedTransaction = await SalesService.updateTransactionById(BigInt(result.data?.id), {
                amountPaid: totalPaid,
                balance: balance > 0.01 ? balance : 0,
                status: balance > 0.01 ? ("balance" as TransactionStatus) : ("paid" as TransactionStatus)
            });


            const response = {
                message: message,
                data: updatedTransaction,
            };

            if (balance <= 0.01) {
                let promise = [];
                for (let i = 0; i < result.data.sales.length; i++) {
                    promise.push(ProductService.updateProductByIdPayment(result.data.sales[i].productId, {
                        quantity: {
                            decrement: result.data.sales[i].quantity, // Subtracts the quantity
                        },
                    }));
                }

                await Promise.all(promise);
            }
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

    //Create single offline transaction no payment
    async createSingleOfflineTransactionNoPayment(req: CustomRequest, res: Response) {
        try {
            const cashierId: string = req.body.cashierId;
            const isPayLater: string = req.body.isPayLater;
            const branchId: string = req.body.branchId;
            const amountPaid: number = req.body.amountPaid;
            const amountToPay: number = req.body.amountToPay;
            const vat: number = req.body.vat;
            const nhil: number = req.body.nhil;
            const covidLevy: number = req.body.covidLevy;
            const serviceCharge: number = req.body.serviceCharge;
            const gefl: number = req.body.gefl;
            const trLevy: number = req.body.trLevy;
            const storeDiscountApplied: boolean = req.body.storeDiscountApplied;
            const storeDiscountAmount: number = req.body.storeDiscountAmount;
            const totalPriceBeforeProductDiscount: number = req.body.totalPriceBeforeProductDiscount;
            const totalPriceAfterProductDiscount: number = req.body.totalPriceAfterProductDiscount;

            const products: {
                id: string,
                quantity: number,
                amountPerItemAfterTax: number,
                productName: string,
                productDescription: string | null,
                costAmountPerItem: number,
                amountPerItem: number,
                totalAmount: number,
                hasDiscount: boolean,
                discountAmount: number,
            }[] = req.body.products;
            const customer: { name: string, phoneNumber: string, email: string } = req.body.customer;

            let result = await createTransactionOffline(req, {
                cashierId,
                isPayLater,
                branchId,
                totalPriceBeforeProductDiscount,
                totalPriceAfterProductDiscount,
                amountPaid,
                amountToPay,
                vat,
                nhil,
                covidLevy,
                serviceCharge,
                gefl,
                trLevy,
                storeDiscountApplied,
                storeDiscountAmount,
                products,
                customer,
            });

            if (!result.status) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Transaction creation failed!!!`
                );
            }


            const response = {
                message: result.message,
                data: result.data,
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

    //Create single transaction
    async editSingleTransaction(req: CustomRequest, res: Response) {
        try {
            const transactionId: string = req.body.transactionId;
            const amountToPay: number = req.body.amountToPay;
            const products: { id: string, productId: string, quantity: number }[] = req.body.products;

            let result = await creatExistingTransaction(transactionId);

            if (!result.status) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Transaction does not exists!!!`
                );
            }

            for (let i = 0; i < products.length; i++) {
                let prod = products[i];
                SalesService.getSingleSaleById(BigInt(prod.id)).then((sale) => {
                    if (sale) {
                        SalesService.updateSaleById(BigInt(prod.id), {
                            isDeleted: prod.quantity === 0,
                            quantity: prod.quantity,
                            totalAmount: prod.quantity * sale.amountPerItem,
                            discountAmount: sale.discountAmount > 0 ? ((Number(sale.discountAmount) / Number(sale.quantity)) * prod.quantity) : 0,
                        });
                        if (result.data.balance <= 0) {
                            ProductService.getProductById(BigInt(prod.productId)).then((product) => {
                                if (product && product.stockType === "stock") {
                                    ProductService.updateProductById(BigInt(prod.productId), {quantity: Number(product.quantity) + Number(sale.quantity) - Number(prod.quantity)});
                                }
                            });
                        }
                    }
                });
            }

            const balance = Number(amountToPay) - Number(result.data.amountPaid)

            //console.log(`Updated transaction Result===========>${JSON.stringify(convertBigIntToString(updatedTransaction))}`);
            if (balance <= 0) {
                for (let i = 0; i < result.data?.sales.length; i++) {
                    let prod = result.data?.sales[i];
                    ProductService.getProductById(BigInt(prod.productId)).then((product) => {
                        if (product && product.stockType === "stock") {
                            ProductService.updateProductById(BigInt(prod.productId), {quantity: Number(product.quantity) - Number(prod.quantity)});
                        }
                    });
                }
            }

            let message = `Transaction successfully updated!!!`;
            const updatedTransaction = await SalesService.updateTransactionById(BigInt(result.data?.id), {
                amountToPay: Number(amountToPay),
                balance: balance <= 0.01 ? 0 : balance,
                status: balance > 0.01 ? ("balance" as TransactionStatus) : ("paid" as TransactionStatus)
            });


            const response = {
                message: message,
                data: updatedTransaction,
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

    //Create transaction
    async createOfflineTransaction(req: CustomRequest, res: Response) {
        try {
            const jsonData: Array<{
                cashierId: string,
                transactionId: string,
                isPayLater: string,
                branchId: string,
                paymentMethod: string,
                paymentReference: string,
                currency: string,
                amountPaid: number,
                transactionDate: string,
                clearDebt: boolean,
                products: { id: string, quantity: number }[],
                customer: { name: string, phoneNumber: string, email: string } | null,
            }> = req.body.data;

            let promises: any = [];
            for (let i = 0; i < jsonData.length; i++) {
                let offSale = jsonData[i];
                if (offSale.transactionId) {
                    const promise = creatExistingTransaction(offSale.transactionId);
                    promises.push(promise);
                } else {
                    const promise = createTransaction(req, offSale);
                    promises.push(promise);
                }
            }
            const response = await Promise.all(promises);
            let success: number[] = [];
            let failure: number[] = [];
            for (let i = 0; i < response.length; i++) {
                let result = response[i];
                let offSale = jsonData[i];
                if (result.status) {
                    success.push(i);
                } else {
                    failure.push(i);
                }
                //console.log(`Result===========>${JSON.stringify(convertBigIntToString(result))}`);
                if (result.status) {
                    const paymentAmount = result.data?.amountPaid;

                    const store = req.store;

                    let totalPaid = Number(result.data?.amountPaid) + Number(paymentAmount);
                    let balance = Number(result.data?.balance) - Number(paymentAmount);

                    let query = {
                        amountPaid: Number(paymentAmount),
                        paymentMethod: offSale.paymentMethod as PaymentMethod,
                        paymentRef: offSale.paymentReference || generateProductCode("PRF", 24),
                        customer: offSale.customer,
                        ...offSale.currency && {currency: offSale.currency},
                        transactionId: BigInt(result.data?.id),
                        cashierId: BigInt(offSale.cashierId),
                    }

                    let message = `Payment successfully created!!!`;

                    const payment = await SalesService.createPayment(query);
                    const response = {
                        message: message,
                        data: payment,
                    };

                    //console.log(`Payment Result===========>${JSON.stringify(convertBigIntToString(payment))}`);
                    const updatedTransaction = await SalesService.updateTransactionById(BigInt(result.data?.id), {
                        amountPaid: totalPaid,
                        balance: balance,
                        status: balance > 0 ? ("balance" as TransactionStatus) : ("paid" as TransactionStatus)
                    });


                    //console.log(`Updated transaction Result===========>${JSON.stringify(convertBigIntToString(updatedTransaction))}`);
                    if (balance <= 0) {
                        for (let i = 0; i < result.data?.sales.length; i++) {
                            let prod = result.data?.sales[i];
                            ProductService.getProductById(BigInt(prod.productId)).then((product) => {
                                if (product && product.stockType === "stock") {
                                    ProductService.updateProductById(BigInt(prod.productId), {quantity: Number(product.quantity) - Number(prod.quantity)});
                                }
                            });
                        }
                    }
                }
            }
            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                {
                    message: `Product synced with ${failure.length} fails!`,
                    data: {
                        success,
                        failure,
                        response
                    }
                }
            );
        } catch (err: any) {
            throw err;
        }
    },

    //Cancel transaction
    async cancelTransaction(req: CustomRequest, res: Response) {
        try {
            const {transactionId} = req.body;
            const transactionExist = await SalesService.getSingleTransactionByIdForPayment(BigInt(transactionId));

            if (!transactionExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Transaction does not exist!!!`
                );
            }

            let query = {
                status: "failed" as TransactionStatus,
            }
            const transaction = await SalesService.updateTransactionByIdForPayment(BigInt(transactionId), query)

            const response = {
                message: `Transaction canceled!!!`,
                data: transaction,
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

    //record payment
    async makePayment(req: CustomRequest, res: Response) {
        try {
            const {
                paymentMethod,
                currency,
                transactionId,
                cashierId,
                amountPaid,
                clearDebt,
                paymentReference
            } = req.body;
            let customer: { name: string, phoneNumber: string, email: string } | null = req.body.customer;

            if (!clearDebt && !amountPaid) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Please enter amount to pay!!!`
                );
            }

            const result = await SalesService.getSingleTransactionByIdForPayment(BigInt(transactionId));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Transaction does not exist!!!`
                );
            }

            const paymentAmount = clearDebt ? result.balance : amountPaid;

            if (paymentAmount > result.balance) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Customers balance is ${result.balance}!!!`
                );
            }

            const store = req.store;

            let totalPaid = Number(result.amountPaid) + Number(paymentAmount);
            let balance = Number(result.balance) - Number(paymentAmount);

            let query = {
                amountPaid: Number(paymentAmount),
                paymentMethod: paymentMethod as PaymentMethod,
                paymentRef: paymentReference || generateProductCode("PRF", 24),
                customer: customer,
                ...currency && {currency},
                transactionId: BigInt(transactionId),
                cashierId: BigInt(cashierId),
            }

            let message = `Payment successfully created!!!`;

            const payment = await SalesService.createPayment(query);
            const response = {
                message: message,
                data: payment,
            };

            await SalesService.updateTransactionByIdForPayment(BigInt(transactionId), {
                amountPaid: totalPaid,
                balance: balance > 0.01 ? balance : 0,
                customer: customer,
                status: balance > 0.01 ? ("balance" as TransactionStatus) : ("paid" as TransactionStatus)
            });

            if (balance <= 0) {
                let promise = [];
                for (let i = 0; i < result.sales.length; i++) {
                    promise.push(ProductService.updateProductByIdPayment(result.sales[i].productId, {
                        quantity: {
                            decrement: result.sales[i].quantity, // Subtracts the quantity
                        },
                    }));
                }

                await Promise.all(promise);
            }

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

    //Initiate momo payment
    async initiateMomo(req: CustomRequest, res: Response) {
        try {
            const {
                transactionId,
                amountPaid,
                phoneNumber,
                provider,
                clearDebt,
            } = req.body;
            let customer: { name: string, phoneNumber: string, email: string } | null = req.body.customer;

            if (!clearDebt && !amountPaid) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Please enter amount to pay!!!`
                );
            }

            const result = await SalesService.getSingleTransactionByIdForPayment(BigInt(transactionId));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Transaction does not exist!!!`
                );
            }

            const paymentAmount = Number(amountPaid);

            if (paymentAmount > result.balance) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Customers balance is ${result.balance}!!!`
                );
            }

            if (!req.store.terminalVerified) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Payment option declined, Store does not have a Linked terminal!!!`
                );
            }

            const transact = await SalesService.updateTransactionByIdForPayment(BigInt(result.id), {transactionReference: `TRF-${new Date().valueOf()}`})
            const http = new APIRequest();

            let requestBody = {
                "FeeTypeCode": "GENERALPAYMENT",
                "terminalID": req.store.tid,
                "terminalSN": req.store.terminalSerial,
                "mobile": phoneNumber,
                "transactionType": "1",
                "mobile_network": provider,
                "amount": Number(paymentAmount),
                "order_id": transact.transactionReference,
                "name": "MyShopKeeper",
                "order_desc": `Product payment on ${req.store.name}`,
                "currency": (req.store.defaultCurrency || "GHS").toString().toLocaleUpperCase(),
                "client_timestamp": new Date().toISOString(),
                "email": req.store.businessEmail || "momoinvoice@theblupenguin.com",
                "MerchantCode": req.store.mid,
                "paymentMode": 2
            }

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TMS_API}`
                // Add any other headers as needed
            };

            const paymentResult: any = await http.post(TMS_API + "/transaction/momo/createpayment", requestBody, headers,);
            if (paymentResult.status !== true) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    paymentResult.message
                );
            }

            const response = {
                message: "Payment initiated",
                data: paymentResult,
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

    //Initiate momo payment
    async verifyMomoPayment(req: CustomRequest, res: Response) {
        try {
            const {
                transactionId,
                amountPaid,
                clearDebt,
            } = req.body;
            let customer: { name: string, phoneNumber: string, email: string } | null = req.body.customer;

            if (!clearDebt && !amountPaid) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Please enter amount to pay!!!`
                );
            }

            const result = await SalesService.getSingleTransactionByIdForPayment(BigInt(transactionId));
            if (!result) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Transaction does not exist!!!`
                );
            }

            const paymentAmount = clearDebt ? result.balance : amountPaid;

            let totalPaid = Number(result.amountPaid) + Number(paymentAmount);
            let balance = Number(result.balance) - Number(paymentAmount);

            if (!req.store.terminalVerified) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Payment option declined, Store does not have a Linked terminal!!!`
                );
            }
            const http = new APIRequest();

            let requestBody = {
                "tid": req.store.tid,
                "terminalSN": req.store.terminalSerial,
                "amount": Number(paymentAmount),
                "order_id": result.transactionReference,
                "mid": req.store.mid,
                "stan": "173767269277"
            }

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TMS_API}`
                // Add any other headers as needed
            };

            const paymentResult: any = await http.post(TMS_API + "/transaction/momo/invoicestatus", requestBody, headers,);
            if (paymentResult.status !== true) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    paymentResult.message
                );
            }

            const updatedTransact = await SalesService.updateTransactionByIdForPayment(BigInt(transactionId), {
                amountPaid: totalPaid,
                balance: balance > 0.01 ? balance : 0,
                customer: customer,
                status: balance > 0.01 ? ("balance" as TransactionStatus) : ("paid" as TransactionStatus)
            });

            let query = {
                amountPaid: Number(paymentAmount),
                paymentMethod: "momo" as PaymentMethod,
                paymentRef: `PRF-${new Date().valueOf()}`,
                customer: customer,
                currency: req.store.currency || "GHS",
                transactionId: BigInt(transactionId),
                cashierId: BigInt(req.user.id),
            }

            const payment = await SalesService.createPayment(query);

            const response = {
                message: "Payment successful!!!",
                data: updatedTransact,
            };

            if (balance <= 0) {
                let promise = [];
                for (let i = 0; i < result.sales.length; i++) {
                    promise.push(ProductService.updateProductByIdPayment(result.sales[i].productId, {
                        quantity: {
                            decrement: result.sales[i].quantity, // Subtracts the quantity
                        },
                    }));
                }

                await Promise.all(promise);
            }

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

    //get transaction analysis, filter by day, week, month
    async transactionAnalytics(req: CustomRequest, res: Response) {
        try {
            const {timeframe, startDate, endDate, branchId, cashierId, status} = req.query;

            // Validate the duration type
            const allowedDurationTypes = ['daily', 'weekly', 'monthly'];
            if (timeframe && !allowedDurationTypes.includes(timeframe as string)) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid timeframe selected`
                );
            }

            if (branchId) {
                const branchExist = await StoreService.singleStoreBranch(BigInt(branchId as string));
                if (!branchExist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Branch does not exist`
                    );
                }
            }


            // Timeframe grouping logic
            let dateGrouping;
            let interval: string;

            switch (timeframe) {
                case 'daily':
                    dateGrouping = 'DAY';
                    interval = '1 day';
                    break;
                case 'weekly':
                    dateGrouping = 'WEEK';
                    interval = '1 week';
                    break;
                case 'monthly':
                    dateGrouping = 'MONTH';
                    interval = '1 month';
                    break;
                default:
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Invalid timeframe selected`
                    );
            }

            let transactionStatus;

            switch (status) {
                case 'pending':
                    transactionStatus = 'pending';
                    break;
                case 'balance':
                    transactionStatus = 'balance';
                    break;
                case 'paid':
                    transactionStatus = 'paid';
                    break;
                case 'failed':
                    transactionStatus = 'failed';
                    break;
                default:
                    transactionStatus = null;
                    break;
            }

            //const pTypes = await PropertyService.createMultiplePropertyType();
            const result = await SalesService.transactionAnalytics(dateGrouping, interval, startDate as string, endDate as string, BigInt(req.store.id), branchId, cashierId, transactionStatus);

            const response = {
                message: "Transaction analytics fetched successfully",
                data: result,
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

    //get sales analysis, filter by day, week, month
    async salesAnalytics(req: CustomRequest, res: Response) {
        try {
            const {timeframe, startDate, endDate, branchId, cashierId} = req.query;

            // Validate the duration type
            const allowedDurationTypes = ['daily', 'weekly', 'monthly'];
            if (timeframe && !allowedDurationTypes.includes(timeframe as string)) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid timeframe selected`
                );
            }

            if (branchId) {
                const branchExist = await StoreService.singleStoreBranch(BigInt(branchId as string));
                if (!branchExist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Branch does not exist`
                    );
                }
            }

            // Timeframe grouping logic
            let dateGrouping;
            let interval: string;
            ;
            switch (timeframe) {
                case 'daily':
                    dateGrouping = 'DAY';
                    interval = '1 day';
                    break;
                case 'weekly':
                    dateGrouping = 'WEEK';
                    interval = '1 week';
                    break;
                case 'monthly':
                    dateGrouping = 'MONTH';
                    interval = '1 month';
                    break;
                default:
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Invalid timeframe selected`
                    );
            }

            //const pTypes = await PropertyService.createMultiplePropertyType();
            const result = await SalesService.salesAnalytics(dateGrouping, interval, startDate as string, endDate as string, BigInt(req.store.id), branchId, cashierId);

            const response = {
                message: "Sales analytics fetched successfully",
                data: result,
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

    //get sales analysis, filter by day, week, month
    async transactionOverview(req: CustomRequest, res: Response) {
        try {
            const {branchId} = req.query;

            if (branchId) {
                const branchExist = await StoreService.singleStoreBranch(BigInt(branchId as string));
                if (!branchExist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Branch does not exist`
                    );
                }
            }

            let cashierId = req.role === "cashier" ? req.user.id : null;

            //const pTypes = await PropertyService.createMultiplePropertyType();
            const result = await SalesService.getTransactionAnalysis(BigInt(req.store.id), branchId, cashierId);

            const response = {
                message: "Transaction analysis fetched successfully",
                data: result,
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

    //get sales analysis, filter by day, week, month
    async getSalesSummary(req: CustomRequest, res: Response) {
        try {
            const {branchId, startDate, endDate} = req.query;

            if (branchId) {
                const branchExist = await StoreService.singleStoreBranch(BigInt(branchId as string));
                if (!branchExist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Branch does not exist`
                    );
                }
            }
            const sDate = startDate ? new Date(startDate as string) : new Date('2025-01-01');
            const eDate = endDate ? new Date(endDate as string) : new Date();

            //const pTypes = await PropertyService.createMultiplePropertyType();
            const result = await SalesService.getSalesSummary(sDate, eDate, BigInt(req.store.id), branchId as string | null);

            const response = {
                message: "sales analysis fetched successfully",
                data: result,
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

    //get sales analysis, filter by day, week, month
    async getSalesSummaryWithPagination(req: CustomRequest, res: Response) {
        try {
            const {branchId, startDate, endDate} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);

            if (branchId) {
                const branchExist = await StoreService.singleStoreBranch(BigInt(branchId as string));
                if (!branchExist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Branch does not exist`
                    );
                }
            }
            const sDate = startDate ? new Date(startDate as string) : new Date('2025-01-01');
            const eDate = endDate ? new Date(endDate as string) : new Date();

            //const pTypes = await PropertyService.createMultiplePropertyType();
            const result = await SalesService.getSalesSummaryWithPagination(sDate, eDate, BigInt(req.store.id), branchId as string | null, page, limit);

            const response = {
                message: "sales analysis fetched successfully",
                data: result,
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

}

const creatExistingTransaction = async (transactionId: string) => {
    const singleTransact = await SalesService.getSingleTransactionById(BigInt(transactionId));
    const response = {
        message: `Transaction created!!!`,
        data: singleTransact as TransactionClient,
    };
    if (!singleTransact) {
        return {
            statusCode: HttpStatusCode.StatusBadRequest,
            status: false,
            message: `No record was found transaction with ID ${transactionId}!!!`,
            data: {}
        }
    }
    return {
        statusCode: HttpStatusCode.StatusCreated,
        status: true,
        ...response
    }
}

const createTransaction = async (req: CustomRequest, payload: {
    cashierId: string,
    isPayLater: string,
    branchId: string,
    amountPaid: number,
    products: { id: string, quantity: number }[],
    customer: { name: string, phoneNumber: string, email: string } | null,
}) => {
    const {
        cashierId,
        isPayLater,
        branchId,
        products,
        customer,
    } = payload;

    //console.log(`Product ID's=========> ${JSON.stringify(products)}`);

    const productIds = products.map((prod) => BigInt(prod.id));
    const result = await ProductService.getProductsByBranchIdAndProductIds(BigInt(branchId), productIds);

    //console.log(`Fetched product======> ${JSON.stringify(convertBigIntToString(result))}`);

    let totalPriceBeforeProductDiscount = 0;
    let totalPriceAfterProductDiscount = 0;
    let amountToPay = 0;
    let vat = 0;
    let tax = 0;
    let nhil = 0;
    let covidLevy = 0;
    let serviceCharge = 0;
    let gefl = 0;
    let trLevy = 0;
    let storeDiscountApplied = false;
    let storeDiscountAmount = 0;

    if (productIds.length != result.length) {
        return {
            statusCode: HttpStatusCode.StatusBadRequest,
            status: false,
            message: `Records of some of the selected products were not found!!!`,
            data: {}
        }
    }
    let productModified: {
        productId: bigint,
        productName: string,
        productDescription?: string,
        quantity: number,
        costAmountPerItem: number | null,
        amountPerItem: number,
        amountPerItemAfterTax: number,
        totalAmount: number,
        hasDiscount: boolean,
        discountAmount: number,
        storeId: bigint,
        branchId: bigint,
        cashierId: bigint,
        transactionId?: bigint
    }[] = [];
    for (const product of result) {
        let p = products.find((prod: { id: string, quantity: number }) => BigInt(prod.id) === product.id);
        if (!p) {
            return {
                statusCode: HttpStatusCode.StatusBadRequest,
                status: false,
                message: `No record was found product with ID ${product.id}!!!`,
                data: {}
            }
        }

        if (product.stockType === "stock" && product.quantity < p.quantity) {
            return {
                statusCode: HttpStatusCode.StatusBadRequest,
                status: false,
                message: `${product.name} only have ${product.quantity} quantity left in stock!!!`,
                data: {}
            }
        }

        totalPriceBeforeProductDiscount = totalPriceBeforeProductDiscount + (product.amount * p.quantity);
        totalPriceAfterProductDiscount = totalPriceAfterProductDiscount + (product.amount * p.quantity) - (!product.hasDiscount ? 0 : product.discountType == DiscountType.fixed ? product.discountValue : ((product.discountValue / 100) * (product.amount * p.quantity)));
        productModified.push({
            productId: product.id,
            productName: product.name,
            productDescription: product.description ?? "",
            quantity: p.quantity,
            costAmountPerItem: product.costAmount,
            amountPerItem: product.amount,
            amountPerItemAfterTax: Number(taxedAmount(req, product.amount)) + Number(product.amount),
            totalAmount: product.amount * Number(p.quantity),
            hasDiscount: product.hasDiscount,
            discountAmount: Number((!product.hasDiscount ? 0 : product.discountType == DiscountType.fixed ? product.discountValue : ((product.discountValue / 100) * (product.amount * Number(p.quantity)))).toFixed(2)),
            storeId: BigInt(req.store.id),
            branchId: BigInt(branchId),
            cashierId: BigInt(cashierId),
        })
    }
    tax = req.store.applyTax ? (((req.store.taxAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
    nhil = req.store.applyNHIL ? (((req.store.nhilAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
    gefl = req.store.applyGEFL ? (((req.store.geflAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
    covidLevy = req.store.applyCovidLevy ? (((req.store.covidLevyAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
    serviceCharge = req.store.applyServiceCharge ? (((req.store.serviceCharge || 0) / 100) * totalPriceBeforeProductDiscount) : 0;
    trLevy = req.store.applyTRLevy ? (((req.store.trLevyAmount || 0) / 100) * totalPriceBeforeProductDiscount) : 0;

    tax = Number(tax.toFixed(2));
    nhil = Number(nhil.toFixed(2));
    gefl = Number(gefl.toFixed(2));
    serviceCharge = Number(serviceCharge.toFixed(2));
    covidLevy = Number(covidLevy.toFixed(2));
    trLevy = Number(trLevy.toFixed(2));

    vat = req.store.applyVat ? (((req.store.vatAmount || 0) / 100) * (totalPriceBeforeProductDiscount + nhil + gefl + covidLevy + serviceCharge + trLevy)) : 0;

    vat = Number(vat.toFixed(2));

    if (req.store.discountConfig.discountActive) {
        if (req.store.discountConfig.discountCapApplied && req.store.discountConfig.discountMinApplied) {
            storeDiscountApplied = req.store.discountConfig.discountCapValue >= totalPriceBeforeProductDiscount && req.store.discountConfig.discountMinValue <= totalPriceBeforeProductDiscount;
            storeDiscountAmount = !storeDiscountApplied ? 0 : req.store.discountConfig.discountType == DiscountType.fixed ? req.store.discountConfig.discountValue : ((req.store.discountConfig.discountValue / 100) * totalPriceBeforeProductDiscount);
        } else if (req.store.discountConfig.discountCapApplied) {
            storeDiscountApplied = req.store.discountConfig.discountCapValue >= totalPriceBeforeProductDiscount;
            storeDiscountAmount = !storeDiscountApplied ? 0 : req.store.discountConfig.discountType == DiscountType.fixed ? req.store.discountConfig.discountValue : ((req.store.discountConfig.discountValue / 100) * totalPriceBeforeProductDiscount);
        } else if (req.store.discountConfig.discountMinApplied) {
            storeDiscountApplied = req.store.discountConfig.discountMinValue <= totalPriceBeforeProductDiscount;
            storeDiscountAmount = !storeDiscountApplied ? 0 : req.store.discountConfig.discountType == DiscountType.fixed ? req.store.discountConfig.discountValue : ((req.store.discountConfig.discountValue / 100) * totalPriceBeforeProductDiscount);
        }
    }
    totalPriceBeforeProductDiscount = Number(totalPriceBeforeProductDiscount.toFixed(2));
    totalPriceAfterProductDiscount = Number(totalPriceAfterProductDiscount.toFixed(2));
    storeDiscountAmount = Number(storeDiscountAmount.toFixed(2));

    amountToPay = totalPriceAfterProductDiscount + vat + nhil + gefl + covidLevy + serviceCharge + trLevy - storeDiscountAmount;

    let query = {
        transactionReference: `TRF-${new Date().valueOf()}`,
        totalPriceBeforeProductDiscount,
        totalPriceAfterProductDiscount,
        amountToPay: Number(amountToPay.toFixed(2)),
        amountPaid: payload.amountPaid ?? 0,
        balance: Number((amountToPay - (payload.amountPaid ?? 0)).toFixed(2)),
        storeDiscountApplied: storeDiscountApplied,
        storeDiscountAmount,
        cashierId: BigInt(cashierId),
        storeId: BigInt(req.store.id),
        branchId: BigInt(branchId),
        customer: customer,
        vat,
        tax,
        nhil,
        gefl,
        serviceCharge,
        covidLevy,
        trLevy,
        isPayLater: isPayLater,
    }
    const transaction = await SalesService.createTransaction(query);

    for (let i = 0; i < productModified.length; i++) {
        productModified[i].transactionId = transaction.id;
    }

    await SalesService.createMultipleSales(productModified);

    const singleTransact = await SalesService.getSingleTransactionById(transaction.id);
    const response = {
        message: `Transaction created!!!`,
        data: singleTransact as TransactionClient,
    };
    return {
        statusCode: HttpStatusCode.StatusCreated,
        status: true,
        ...response
    }
}

const taxedAmount = (req: CustomRequest, amount: number) => {
    let nhil = req.store.applyNHIL ? (((req.store.nhilAmount || 0) / 100) * amount) : 0;
    let gefl = req.store.applyGEFL ? (((req.store.geflAmount || 0) / 100) * amount) : 0;
    let covidLevy = req.store.applyCovidLevy ? (((req.store.covidLevyAmount || 0) / 100) * amount) : 0;
    let serviceCharge = req.store.applyServiceCharge ? (((req.store.serviceCharge || 0) / 100) * amount) : 0;
    let trLevy = req.store.applyTRLevy ? (((req.store.trLevyAmount || 0) / 100) * amount) : 0;

    nhil = Number(nhil.toFixed(2));
    gefl = Number(gefl.toFixed(2));
    serviceCharge = Number(serviceCharge.toFixed(2));
    covidLevy = Number(covidLevy.toFixed(2));
    trLevy = Number(trLevy.toFixed(2));
    let vat = req.store.applyVat ? (((req.store.vatAmount || 0) / 100) * (amount + nhil + gefl + covidLevy + serviceCharge + trLevy)) : 0;

    vat = Number(vat.toFixed(2));

    return vat + nhil + gefl + covidLevy + serviceCharge + trLevy;
}

const createTransactionOffline = async (req: CustomRequest, payload: {
    cashierId: string,
    isPayLater: string,
    branchId: string,
    totalPriceBeforeProductDiscount: number,
    totalPriceAfterProductDiscount: number,
    amountPaid: number,
    amountToPay: number,
    vat: number,
    nhil: number,
    covidLevy: number,
    serviceCharge: number,
    gefl: number,
    trLevy: number,
    storeDiscountApplied: boolean,
    storeDiscountAmount: number,
    products: {
        id: string,
        quantity: number,
        amountPerItemAfterTax: number,
        productName: string,
        productDescription: string | null,
        costAmountPerItem: number,
        amountPerItem: number,
        totalAmount: number,
        hasDiscount: boolean,
        discountAmount: number,
    }[],
    customer: { name: string, phoneNumber: string, email: string } | null,
}) => {

    let productModified: {
        productId: bigint,
        productName: string,
        productDescription?: string,
        quantity: number,
        costAmountPerItem: number | null,
        amountPerItem: number,
        amountPerItemAfterTax: number,
        totalAmount: number,
        hasDiscount: boolean,
        discountAmount: number,
        storeId: bigint,
        branchId: bigint,
        cashierId: bigint,
        transactionId?: bigint
    }[] = [];

    for (let i = 0; i < payload.products.length; i++) {
        const p: {
            id: string,
            quantity: number,
            amountPerItemAfterTax: number,
            productName: string,
            productDescription: string | null,
            costAmountPerItem: number,
            amountPerItem: number,
            totalAmount: number,
            hasDiscount: boolean,
            discountAmount: number,
        } = payload.products[i];
        productModified.push({
            productId: BigInt(p.id),
            productName: p.productName,
            productDescription: p.productDescription ?? "",
            quantity: p.quantity,
            costAmountPerItem: p.costAmountPerItem,
            amountPerItem: p.amountPerItem,
            amountPerItemAfterTax: p.amountPerItemAfterTax,
            totalAmount: p.totalAmount,
            hasDiscount: p.hasDiscount,
            discountAmount: p.discountAmount,
            storeId: BigInt(req.store.id),
            branchId: BigInt(payload.branchId),
            cashierId: BigInt(payload.cashierId),
        });
    }

    let query = {
        transactionReference: `TRF-${new Date().valueOf()}`,
        totalPriceBeforeProductDiscount: payload.totalPriceBeforeProductDiscount,
        totalPriceAfterProductDiscount: payload.totalPriceAfterProductDiscount,
        amountToPay: payload.amountToPay,
        amountPaid: payload.amountPaid ?? 0,
        balance: Number((payload.amountToPay - (payload.amountPaid ?? 0)).toFixed(2)),
        storeDiscountApplied: payload.storeDiscountApplied,
        storeDiscountAmount: payload.storeDiscountAmount,
        cashierId: BigInt(payload.cashierId),
        storeId: BigInt(req.store.id),
        branchId: BigInt(payload.branchId),
        customer: payload.customer,
        vat: payload.vat,
        tax: 0,
        nhil: payload.nhil,
        gefl: payload.gefl,
        serviceCharge: payload.serviceCharge,
        covidLevy: payload.covidLevy,
        trLevy: payload.trLevy,
        isPayLater: payload.isPayLater,
    }
    const transaction = await SalesService.createTransaction(query);

    for (let i = 0; i < productModified.length; i++) {
        productModified[i].transactionId = transaction.id;
    }

    await SalesService.createMultipleSales(productModified);

    const singleTransact = await SalesService.getSingleTransactionById(transaction.id);

    /*let promise = [];
    for (let i = 0; i < productModified.length; i++) {
        promise.push(ProductService.updateProductByIdPayment(productModified[i].productId, {
            quantity: {
                decrement: productModified[i].quantity, // Subtracts the quantity
            },
        }));
    }

    await Promise.all(promise);*/
    const response = {
        message: `Transaction created!!!`,
        data: singleTransact as TransactionClient,
    };

    return {
        statusCode: HttpStatusCode.StatusCreated,
        status: true,
        ...response
    }
}