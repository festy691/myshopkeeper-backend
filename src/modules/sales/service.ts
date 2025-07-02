import {prisma} from "../../config/dbInstance";
import {TransactionStatus} from "@prisma/client";

const TransactionModel = prisma.transaction;
const PaymentModel = prisma.payment;
const SalesModel = prisma.soldProducts;

class SalesService {
    static async getAllTransaction(query: any, page: number, limit: number) {
        const [rows, total] = await Promise.all([
            TransactionModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    transactionReference: true,
                    totalPriceAfterProductDiscount: true,
                    totalPriceBeforeProductDiscount: true,
                    amountToPay: true,
                    amountPaid: true,
                    balance: true,
                    vat: true,
                    tax: true,
                    trLevy: true,
                    serviceCharge: true,
                    nhil: true,
                    covidLevy: true,
                    gefl: true,
                    storeDiscountApplied: true,
                    storeDiscountAmount: true,
                    isPayLater: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    customer: true,
                    cashier: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            profilePicture: true
                        }
                    },
                    branch: {
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
                            defaultCurrency: true,
                            branchNumber: true,
                        }
                    },
                    sales: {
                        select: {
                            id: true,
                            productName: true,
                            productDescription: true,
                            quantity: true,
                            costAmountPerItem: true,
                            amountPerItem: true,
                            amountPerItemAfterTax: true,
                            totalAmount: true,
                            discountAmount: true,
                            isDeleted: true,
                            productId: true,
                        }
                    },
                    payments: {
                        select: {
                            id: true,
                            amountPaid: true,
                            paymentMethod: true,
                            paymentRef: true,
                            customer: true,
                            currency: true,
                            updatedAt: true,
                        }
                    },
                },
            }),
            TransactionModel.count({where: query})
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...rows];
        return {total, pages, page, limit, docs};
    }

    static async getAllShopsTransaction(query: any, page: number, limit: number) {
        const [rows, total] = await Promise.all([
            TransactionModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    transactionReference: true,
                    totalPriceAfterProductDiscount: true,
                    totalPriceBeforeProductDiscount: true,
                    amountToPay: true,
                    amountPaid: true,
                    balance: true,
                    isPayLater: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    customer: true,
                    cashier: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            profilePicture: true
                        }
                    },
                    branch: {
                        select: {
                            id: true,
                            name: true,
                            contactEmail: true,
                            phoneNumber: true,
                            branchNumber: true,
                        }
                    },
                    store: {
                        select: {
                            id: true,
                            name: true,
                            contactEmail: true,
                            businessEmail: true,
                            phoneNumber: true,
                        }
                    },
                    sales: {
                        select: {
                            id: true,
                            productName: true,
                            quantity: true,
                            productId: true,
                        }
                    },
                    payments: {
                        select: {
                            id: true,
                            amountPaid: true,
                            paymentMethod: true,
                            paymentRef: true,
                            currency: true,
                            updatedAt: true,
                        }
                    },
                },
            }),
            TransactionModel.count({where: query})
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...rows];
        return {total, pages, page, limit, docs};
    }

    static async getAllPayments(query: any, page: number, limit: number) {
        const [rows, total] = await Promise.all([
            PaymentModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    amountPaid: true,
                    paymentMethod: true,
                    paymentRef: true,
                    customer: true,
                    currency: true,
                    updatedAt: true,
                    cashier: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            profilePicture: true
                        }
                    },
                },
            }),
            PaymentModel.count({where: query})
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...rows];
        return {total, pages, page, limit, docs};
    }

    static async getAllSales(query: any, page: number, limit: number) {
        const [rows, total] = await Promise.all([
            SalesModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    productName: true,
                    productDescription: true,
                    quantity: true,
                    costAmountPerItem: true,
                    amountPerItem: true,
                    amountPerItemAfterTax: true,
                    totalAmount: true,
                    discountAmount: true,
                    isDeleted: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            amount: true,
                            previousAmount: true,
                            availabilityStatus: true,
                            isEnabled: true,
                            barCode: true,
                            productCode: true,
                            productImage: true,
                            quantity: true,
                            stockType: true,
                        }
                    },
                    cashier: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                            profilePicture: true
                        }
                    },
                    transaction: {
                        select: {
                            id: true,
                            transactionReference: true,
                            totalPriceAfterProductDiscount: true,
                            totalPriceBeforeProductDiscount: true,
                            amountToPay: true,
                            amountPaid: true,
                            balance: true,
                            vat: true,
                            tax: true,
                            storeDiscountApplied: true,
                            storeDiscountAmount: true,
                            isPayLater: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                            customer: true,
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
                            defaultCurrency: true,
                            branchNumber: true,
                        }
                    },
                },
            }),
            SalesModel.count({where: query})
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...rows];
        return {total, pages, page, limit, docs};
    }

    static async getTopSoldItems(storeId?: any, branchId?: any, cashierId?: any) {
        const results = await prisma.soldProducts.groupBy({
            by: ['productId'],
            where: {
                ...(storeId && {storeId: BigInt(storeId)}),
                ...(branchId && {branchId: BigInt(branchId)}),
                ...(cashierId && {cashierId: BigInt(cashierId)}),
            },
            _sum: {
                quantity: true,
                totalAmount: true,
            },
            _min: {
                productName: true,
                productDescription: true,
                amountPerItem: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 10,
        });

        // Reshape the results to match the desired format
        return results.map((item) => ({
            _sum: {
                quantity: item._sum.quantity,
            },
            productId: item.productId,
            productName: item._min.productName,
            productDescription: item._min.productDescription,
            amountPerItem: item._min.amountPerItem,
            totalAmount: item._sum.totalAmount,
            quantity: item._sum.quantity,
        }));
    }

    static async getSingleTransactionById(id: bigint) {
        return TransactionModel.findUnique({
            where: {id},
            select: {
                id: true,
                transactionReference: true,
                totalPriceAfterProductDiscount: true,
                totalPriceBeforeProductDiscount: true,
                amountToPay: true,
                amountPaid: true,
                balance: true,
                vat: true,
                tax: true,
                trLevy: true,
                serviceCharge: true,
                nhil: true,
                covidLevy: true,
                gefl: true,
                storeDiscountApplied: true,
                storeDiscountAmount: true,
                isPayLater: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                customer: true,
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
                branch: {
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
                        defaultCurrency: true,
                        branchNumber: true,
                    }
                },
                sales: {
                    select: {
                        id: true,
                        productName: true,
                        productDescription: true,
                        quantity: true,
                        costAmountPerItem: true,
                        amountPerItem: true,
                        amountPerItemAfterTax: true,
                        totalAmount: true,
                        discountAmount: true,
                        isDeleted: true,
                        productId: true,
                    }
                },
                payments: {
                    select: {
                        id: true,
                        amountPaid: true,
                        paymentMethod: true,
                        paymentRef: true,
                        customer: true,
                        currency: true,
                        updatedAt: true,
                    }
                },
            },
        });
    }

    static async getSingleTransactionByIdForPayment(id: bigint) {
        return TransactionModel.findUnique({
            where: {id},
            select: {
                id: true,
                transactionReference: true,
                totalPriceAfterProductDiscount: true,
                totalPriceBeforeProductDiscount: true,
                amountToPay: true,
                amountPaid: true,
                balance: true,
                vat: true,
                tax: true,
                trLevy: true,
                serviceCharge: true,
                nhil: true,
                covidLevy: true,
                gefl: true,
                storeDiscountApplied: true,
                storeDiscountAmount: true,
                isPayLater: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                customer: true,
                sales: {
                    select: {
                        id: true,
                        productName: true,
                        productDescription: true,
                        quantity: true,
                        costAmountPerItem: true,
                        amountPerItem: true,
                        amountPerItemAfterTax: true,
                        totalAmount: true,
                        discountAmount: true,
                        isDeleted: true,
                        productId: true,
                    }
                },
            },
        });
    }

    static async getSinglePaymentById(id: bigint) {
        return PaymentModel.findUnique({
            where: {id},
            select: {
                id: true,
                amountPaid: true,
                paymentMethod: true,
                paymentRef: true,
                customer: true,
                currency: true,
                updatedAt: true,
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
            },
        });
    }

    static async getSingleSaleById(id: bigint) {
        return SalesModel.findUnique({
            where: {id},
            select: {
                id: true,
                productName: true,
                productDescription: true,
                quantity: true,
                costAmountPerItem: true,
                amountPerItem: true,
                amountPerItemAfterTax: true,
                totalAmount: true,
                discountAmount: true,
                isDeleted: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        previousAmount: true,
                        availabilityStatus: true,
                        isEnabled: true,
                        barCode: true,
                        productCode: true,
                        productImage: true,
                        quantity: true,
                        stockType: true,
                    }
                },
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
                transaction: {
                    select: {
                        id: true,
                        transactionReference: true,
                        totalPriceAfterProductDiscount: true,
                        totalPriceBeforeProductDiscount: true,
                        amountToPay: true,
                        amountPaid: true,
                        balance: true,
                        vat: true,
                        tax: true,
                        storeDiscountApplied: true,
                        storeDiscountAmount: true,
                        isPayLater: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        customer: true,
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
                        defaultCurrency: true,
                        branchNumber: true,
                    }
                },
            },
        });
    }

    static async updateTransactionById(id: bigint, query: any) {
        return TransactionModel.update({
            where: {id},
            data: query,
            select: {
                id: true,
                transactionReference: true,
                totalPriceAfterProductDiscount: true,
                totalPriceBeforeProductDiscount: true,
                amountToPay: true,
                amountPaid: true,
                balance: true,
                vat: true,
                tax: true,
                trLevy: true,
                serviceCharge: true,
                nhil: true,
                covidLevy: true,
                gefl: true,
                storeDiscountApplied: true,
                storeDiscountAmount: true,
                isPayLater: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                customer: true,
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
                branch: {
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
                        defaultCurrency: true,
                        branchNumber: true,
                    }
                },
                sales: {
                    select: {
                        id: true,
                        productName: true,
                        productDescription: true,
                        quantity: true,
                        costAmountPerItem: true,
                        amountPerItem: true,
                        amountPerItemAfterTax: true,
                        totalAmount: true,
                        discountAmount: true,
                        isDeleted: true,
                        productId: true,
                    }
                },
                payments: {
                    select: {
                        id: true,
                        amountPaid: true,
                        paymentMethod: true,
                        paymentRef: true,
                        customer: true,
                        currency: true,
                        updatedAt: true,
                    }
                },
            },
        });
    }

    static async updateTransactionByIdForPayment(id: bigint, query: any) {
        return TransactionModel.update({
            where: {id},
            data: query,
            select: {
                id: true,
                transactionReference: true,
                totalPriceAfterProductDiscount: true,
                totalPriceBeforeProductDiscount: true,
                amountToPay: true,
                amountPaid: true,
                balance: true,
                vat: true,
                tax: true,
                trLevy: true,
                serviceCharge: true,
                nhil: true,
                covidLevy: true,
                gefl: true,
                storeDiscountApplied: true,
                storeDiscountAmount: true,
                isPayLater: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                customer: true,
            },
        });
    }

    static async updatePaymentById(id: bigint, query: any) {
        return PaymentModel.update({
            where: {id},
            data: query,
            select: {
                id: true,
                amountPaid: true,
                paymentMethod: true,
                paymentRef: true,
                customer: true,
                currency: true,
                updatedAt: true,
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
            },
        });
    }

    static async updateSaleById(id: bigint, query: any) {
        return SalesModel.update({
            where: {id},
            data: query,
            select: {
                id: true,
                productName: true,
                productDescription: true,
                quantity: true,
                costAmountPerItem: true,
                amountPerItem: true,
                amountPerItemAfterTax: true,
                totalAmount: true,
                isDeleted: true,
                discountAmount: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        previousAmount: true,
                        availabilityStatus: true,
                        isEnabled: true,
                        barCode: true,
                        productCode: true,
                        productImage: true,
                        quantity: true,
                        stockType: true,
                    }
                },
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
                transaction: {
                    select: {
                        id: true,
                        transactionReference: true,
                        totalPriceAfterProductDiscount: true,
                        totalPriceBeforeProductDiscount: true,
                        amountToPay: true,
                        amountPaid: true,
                        balance: true,
                        vat: true,
                        tax: true,
                        storeDiscountApplied: true,
                        storeDiscountAmount: true,
                        isPayLater: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        customer: true,
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
                        defaultCurrency: true,
                        branchNumber: true,
                    }
                },
            },
        });
    }

    static async createTransaction(query: any) {
        return TransactionModel.create({
            data: query,
            select: {
                id: true,
                transactionReference: true,
                totalPriceAfterProductDiscount: true,
                totalPriceBeforeProductDiscount: true,
                amountToPay: true,
                amountPaid: true,
                balance: true,
                vat: true,
                tax: true,
                trLevy: true,
                serviceCharge: true,
                nhil: true,
                covidLevy: true,
                gefl: true,
                storeDiscountApplied: true,
                storeDiscountAmount: true,
                isPayLater: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                customer: true,
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
                branch: {
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
                        defaultCurrency: true,
                        branchNumber: true,
                    }
                },
                sales: {
                    select: {
                        id: true,
                        productName: true,
                        productDescription: true,
                        quantity: true,
                        costAmountPerItem: true,
                        amountPerItem: true,
                        amountPerItemAfterTax: true,
                        totalAmount: true,
                        discountAmount: true,
                        isDeleted: true,
                        productId: true,
                    }
                },
                payments: {
                    select: {
                        id: true,
                        amountPaid: true,
                        paymentMethod: true,
                        paymentRef: true,
                        customer: true,
                        currency: true,
                        updatedAt: true,
                    }
                },
            },
        });
    }

    static async createPayment(query: any) {
        return PaymentModel.create({
            data: query,
            select: {
                id: true,
                amountPaid: true,
                paymentMethod: true,
                paymentRef: true,
                customer: true,
                currency: true,
                updatedAt: true,
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
            },
        });
    }

    static async createSale(query: any) {
        return SalesModel.create({
            data: query,
            select: {
                id: true,
                productName: true,
                productDescription: true,
                quantity: true,
                costAmountPerItem: true,
                amountPerItem: true,
                amountPerItemAfterTax: true,
                totalAmount: true,
                discountAmount: true,
                isDeleted: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        previousAmount: true,
                        availabilityStatus: true,
                        isEnabled: true,
                        barCode: true,
                        productCode: true,
                        productImage: true,
                        quantity: true,
                        stockType: true,
                    }
                },
                cashier: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profilePicture: true
                    }
                },
                transaction: {
                    select: {
                        id: true,
                        transactionReference: true,
                        totalPriceAfterProductDiscount: true,
                        totalPriceBeforeProductDiscount: true,
                        amountToPay: true,
                        amountPaid: true,
                        balance: true,
                        vat: true,
                        tax: true,
                        storeDiscountApplied: true,
                        storeDiscountAmount: true,
                        isPayLater: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        customer: true,
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
                        defaultCurrency: true,
                        branchNumber: true,
                    }
                },
            },
        });
    }

    static async createMultipleSales(sales: any) {
        return SalesModel.createMany({
            data: sales,
        });
    }

    static async transactionAnalytics(dateTrunc: string, interval: string, startDate: string, endDate: string, storeId: bigint | null, branchId: any, cashierId: any, status: any) {
        const dateStart = startDate ? new Date(startDate).toISOString().slice(0, 19).replace('T', ' ') : '2024-01-01 00:00:00';
        const dateEnd = endDate ? new Date(endDate).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');

        const params: any[] = [];

        let storeFilter = '';
        let branchFilter = '';
        let cashierFilter = '';
        let statusFilter = '';

        if (storeId) {
            storeFilter = `AND t.storeId = ?`;
            params.push(storeId);
        }

        if (branchId) {
            branchFilter = `AND t.branchId = ?`;
            params.push(BigInt(branchId));
        }

        if (cashierId) {
            cashierFilter = `AND t.cashierId = ?`;
            params.push(BigInt(cashierId));
        }

        if (status) {
            statusFilter = `AND t.status = ?`;
            params.push(status as TransactionStatus);
        }

        let dateColumn;
        switch (dateTrunc) {
            case 'DAY':
                dateColumn = `DATE(t.createdAt)`;
                break;
            case 'WEEK':
                dateColumn = `YEARWEEK(t.createdAt, 1)`; // Year and week number
                break;
            case 'MONTH':
                dateColumn = `DATE_FORMAT(t.createdAt, '%Y-%m')`; // Year and month
                break;
            default:
                throw new Error('Invalid dateTrunc value');
        }

        const query = `
  WITH RECURSIVE date_series AS (
    SELECT DATE(?) AS dateStart
    UNION ALL
    SELECT DATE_ADD(dateStart, INTERVAL 1 ${dateTrunc})
    FROM date_series
    WHERE dateStart < DATE(?)
  )
  SELECT 
    ds.dateStart,
    DATE_SUB(DATE_ADD(ds.dateStart, INTERVAL 1 ${dateTrunc}), INTERVAL 1 SECOND) AS dateEnd,
    CAST(COALESCE(COUNT(t.id), 0) AS UNSIGNED) AS totalTransactions,
    COALESCE(SUM(t.amountToPay), 0) AS amountSold
  FROM date_series ds
  LEFT JOIN Transaction t
    ON t.createdAt >= ds.dateStart AND t.createdAt < DATE_ADD(ds.dateStart, INTERVAL 1 ${dateTrunc})
    ${storeFilter}
    ${branchFilter}
    ${cashierFilter}
    ${statusFilter}
  GROUP BY ds.dateStart
  ORDER BY ds.dateStart ASC;
`;

        const result: [] = await prisma.$queryRawUnsafe(query, dateStart, dateEnd, ...params);
        return result.map((row: any) => ({
            ...row,
            totalTransactions: Number(row.totalTransactions), // or parseInt(row.totalTransactions, 10)
            amountSold: Number(row.amountSold),
        }));
    }

    static async salesAnalytics(dateTrunc: string, interval: string, startDate: string, endDate: string, storeId: bigint, branchId: any, cashierId?: any) {
        const dateStart = startDate ? new Date(startDate).toISOString().slice(0, 19).replace('T', ' ') : '2024-01-01 00:00:00';
        const dateEnd = endDate ? new Date(endDate).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');

        const params: any[] = [];

        let storeFilter = '';
        let branchFilter = '';

        if (storeId) {
            storeFilter = `AND t.storeId = ?`;
            params.push(storeId);
        }

        if (branchId) {
            branchFilter = `AND t.branchId = ?`;
            params.push(BigInt(branchId));
        }

        if (cashierId) {
            branchFilter = `AND t.cashierId = ?`;
            params.push(BigInt(cashierId));
        }

        let dateColumn;
        switch (dateTrunc) {
            case 'DAY':
                dateColumn = `DATE(t.createdAt)`;
                break;
            case 'WEEK':
                dateColumn = `YEARWEEK(t.createdAt, 1)`; // Year and week number
                break;
            case 'MONTH':
                dateColumn = `DATE_FORMAT(t.createdAt, '%Y-%m')`; // Year and month
                break;
            default:
                throw new Error('Invalid dateTrunc value');
        }

        const query = `
  WITH RECURSIVE date_series AS (
    SELECT DATE(?) AS dateStart
    UNION ALL
    SELECT DATE_ADD(dateStart, INTERVAL 1 ${dateTrunc})
    FROM date_series
    WHERE dateStart < DATE(?)
  )
  SELECT 
    ds.dateStart,
    DATE_SUB(DATE_ADD(ds.dateStart, INTERVAL 1 ${dateTrunc}), INTERVAL 1 SECOND) AS dateEnd,
    COALESCE(SUM(t.quantity), 0) AS totalQuantitySold,
    COALESCE(SUM(t.totalAmount), 0) AS amountSold
  FROM date_series ds
  LEFT JOIN SoldProducts t
    ON t.createdAt >= ds.dateStart AND t.createdAt < DATE_ADD(ds.dateStart, INTERVAL 1 ${dateTrunc})
    ${storeFilter}
    ${branchFilter}
  GROUP BY ds.dateStart
  ORDER BY ds.dateStart ASC;
`;

        const result: [] = await prisma.$queryRawUnsafe(query, dateStart, dateEnd, ...params);
        return result.map((row: any) => ({
            ...row,
            totalQuantitySold: Number(row.totalQuantitySold), // or parseInt(row.totalTransactions, 10)
            amountSold: Number(row.amountSold),
        }));
    }

    static async getTransactionAnalysis(storeId: bigint, branchId: any, cashierId: any) {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfYesterday = new Date(today);
        startOfYesterday.setDate(today.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date(startOfYesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        // 🔹 Last Week (From Monday to Sunday of last week)
        const startOfLastWeek = new Date(today);
        const dayOfWeek = startOfLastWeek.getDay() || 7; // Get day of the week (Mon = 1, Sun = 7)
        startOfLastWeek.setDate(today.getDate() - dayOfWeek - 6); // Go back to last week's Monday
        startOfLastWeek.setHours(0, 0, 0, 0);

        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Move to the end of Sunday
        endOfLastWeek.setHours(23, 59, 59, 999);

        const startOfWeek = new Date(new Date().setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        const filter = {
            storeId,
            status: 'paid' as TransactionStatus,
            ...(branchId ? {branchId: BigInt(branchId)} : {}),
            ...(cashierId ? {cashierId: BigInt(cashierId)} : {}),
        };

        const [todaySale, todayCount, yesterdaySale, thisWeekSale, thisWeekCount, lastWeekSale, thisMonthSale, thisMonthCount, lastMonthSale, lastMonthCount] = await Promise.all([
            TransactionModel.aggregate({
                _sum: {
                    amountToPay: true,
                },
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfDay,
                    },
                },
            }),
            TransactionModel.count({
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfDay,
                    },
                },
            }),
            TransactionModel.aggregate({
                _sum: {
                    amountToPay: true,
                },
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfYesterday,
                        lte: endOfYesterday
                    },
                },
            }),
            TransactionModel.aggregate({
                _sum: {
                    amountToPay: true,
                },
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfWeek,
                        lt: new Date(),
                    },
                },
            }),
            TransactionModel.count({
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfWeek,
                        lt: new Date(),
                    },
                },
            }),
            TransactionModel.aggregate({
                _sum: {
                    amountToPay: true,
                },
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfLastWeek,
                        lte: endOfLastWeek,
                    },
                },
            }),
            TransactionModel.aggregate({
                _sum: {
                    amountToPay: true,
                },
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfMonth,
                        lt: new Date(),
                    },
                },
            }),
            TransactionModel.count({
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfMonth,
                        lt: new Date(),
                    },
                },
            }),
            TransactionModel.aggregate({
                _sum: {
                    amountToPay: true,
                },
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                },
            }),
            TransactionModel.count({
                where: {
                    ...filter,
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                },
            }),
        ]);

        return {
            todaySales: Number((todaySale._sum.amountToPay ?? 0).toFixed(2)),
            todaySalesCount: todayCount ?? 0,
            todayPercentage: Number((((todaySale._sum.amountToPay ?? 0) / (yesterdaySale._sum.amountToPay ?? 1)) * 100).toFixed(2)),
            yesterdaySale: Number((yesterdaySale._sum.amountToPay ?? 0).toFixed(2)),
            currentWeek: Number((thisWeekSale._sum.amountToPay ?? 0).toFixed(2)),
            currentWeekCount: thisWeekCount ?? 0,
            currentWeekPercentage: Number((((thisWeekSale._sum.amountToPay ?? 0) / (lastWeekSale._sum.amountToPay ?? 1)) * 100).toFixed(2)),
            lastWeekSale: Number((lastWeekSale._sum.amountToPay ?? 0).toFixed(2)),
            currentMonth: Number((thisMonthSale._sum.amountToPay ?? 0).toFixed(2)),
            currentMonthCount: thisMonthCount ?? 0,
            currentMonthPercentage: Number((((thisMonthSale._sum.amountToPay ?? 0) / (lastMonthSale._sum.amountToPay ?? 1)) * 100).toFixed(2)),
            lastMonth: Number((lastMonthSale._sum.amountToPay ?? 0).toFixed(2)),
            lastMonthCount: lastMonthCount ?? 0,
        };
    }

    static async getSalesSummary(startDate: Date, endDate: Date, storeId: bigint, branchId: string | null) {
        const tomorrow = endDate;
        tomorrow.setDate(tomorrow.getDate() + 1);
        const salesSummary = await prisma.soldProducts.groupBy({
            by: ['productId'],
            where: {
                createdAt: {
                    gte: startDate,
                    lte: tomorrow,
                },
                isDeleted: false,
                storeId: storeId,
                ...branchId && {branchId: Number(branchId)},
                costAmountPerItem: {
                    not: null, // Ignore products without cost price
                },
            },
            _avg: {
                costAmountPerItem: true,
                amountPerItem: true,
            },
            _sum: {
                quantity: true,
            },
            _min: {
                createdAt: true,
            },
        });

        // Fetch current product details for each grouped product
        const results = await Promise.all(
            salesSummary.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: {id: item.productId},
                });

                if (!product || !item._avg.costAmountPerItem) return null;

                const itemAverageCostPrice = item._avg.costAmountPerItem ?? 0;
                const itemAverageSellingPrice = item._avg.amountPerItem ?? 0;
                const roi =
                    itemAverageCostPrice > 0
                        ? ((itemAverageSellingPrice - itemAverageCostPrice) /
                            itemAverageCostPrice) *
                        100
                        : 0;

                const quantitySold = item._sum.quantity ?? 0;
                const profit = (itemAverageSellingPrice - itemAverageCostPrice) * quantitySold;

                return {
                    itemName: product.name,
                    itemAverageCostPrice: itemAverageCostPrice.toFixed(2),
                    itemCurrentCostPrice: product.costAmount ?? 0,
                    itemAverageSellingPrice: itemAverageSellingPrice.toFixed(2),
                    itemCurrentPrice: product.amount,
                    quantitySold: item._sum.quantity ?? 0,
                    quantityInStock: product.quantity,
                    roi: roi.toFixed(2) + '%',
                    profit: profit.toFixed(2),
                    createdAt: item._min.createdAt,
                };
            })
        );

        return results.filter((item) => item !== null);
    }

    static async getSalesSummaryWithPagination(
        startDate: Date,
        endDate: Date,
        storeId: bigint,
        branchId: string | null,
        page: number = 1,
        pageSize: number = 10
    ) {
        const tomorrow = new Date(endDate);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Step 1: Get paginated product IDs
        const productGroups = await prisma.soldProducts.groupBy({
            by: ['productId'],
            where: {
                createdAt: {gte: startDate, lte: tomorrow},
                isDeleted: false,
                storeId: storeId,
                ...(branchId ? {branchId: Number(branchId)} : {}),
                costAmountPerItem: {not: null}, // Ignore products without cost price
            },
            _sum: {quantity: true},
            orderBy: {_sum: {quantity: 'desc'}}, // Order by quantity sold
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        // Step 2: Extract unique product IDs properly (Fixing TypeScript error ✅)
        const uniqueProductIds: bigint[] = productGroups.map((p) => p.productId as bigint);

        if (uniqueProductIds.length === 0) return {data: [], total: 0};

        // Step 3: Get sales summary for selected products
        const salesSummary = await prisma.soldProducts.groupBy({
            by: ['productId'],
            where: {productId: {in: uniqueProductIds}},
            _avg: {costAmountPerItem: true, amountPerItem: true},
            _sum: {quantity: true},
            _min: {createdAt: true},
        });

        // Step 4: Fetch product details and calculate ROI
        const results = await Promise.all(
            salesSummary.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: {id: item.productId},
                });

                if (!product || !item._avg.costAmountPerItem) return null;

                const itemAverageCostPrice = item._avg.costAmountPerItem ?? 0;
                const itemAverageSellingPrice = item._avg.amountPerItem ?? 0;
                const roi =
                    itemAverageCostPrice > 0
                        ? ((itemAverageSellingPrice - itemAverageCostPrice) / itemAverageCostPrice) * 100
                        : 0;

                const quantitySold = item._sum.quantity ?? 0;
                const profit = (itemAverageSellingPrice - itemAverageCostPrice) * quantitySold;

                return {
                    itemName: product.name,
                    itemAverageCostPrice: itemAverageCostPrice.toFixed(2),
                    itemCurrentCostPrice: product.costAmount ?? 0,
                    itemAverageSellingPrice: itemAverageSellingPrice.toFixed(2),
                    itemCurrentPrice: product.amount,
                    quantitySold: quantitySold,
                    quantityInStock: product.quantity,
                    roi: roi.toFixed(2) + '%',
                    profit: profit.toFixed(2),
                    createdAt: item._min.createdAt,
                };
            })
        );

        // Step 5: Get total count for pagination
        const uniqueProductCount = await prisma.soldProducts.groupBy({
            by: ['productId'],
            where: {
                createdAt: {gte: startDate, lte: tomorrow},
                isDeleted: false,
                storeId: storeId,
                costAmountPerItem: {not: null},
                ...(branchId ? {branchId: Number(branchId)} : {}),
            },
            _count: {productId: true},
        });

        const totalCount = uniqueProductCount.length;

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            total: totalCount,
            pages: totalPages,
            page: page,
            limit: pageSize,
            docs: results.filter((item) => item !== null), // Remove null values
        };
    }
}

export {SalesService}