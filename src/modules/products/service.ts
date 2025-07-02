import {prisma} from "../../config/dbInstance";
import {Product, ProductCategory, ProductStaus, StoreSupplier} from "@prisma/client";
import {id} from "cls-rtracer";

const ProductModel = prisma.product;
const CategoryModel = prisma.productCategory;
const SupplierModel = prisma.storeSupplier;

class ProductService {
    static async getAllCategories(query: any, page: number, limit: number) {
        const [rows, total] = await Promise.all([
            CategoryModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    name: "asc",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            CategoryModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...rows];
        return {total, pages, page, limit, docs};
    }

    static async getCategories(storeId: bigint) {
        return CategoryModel.findMany({
            where: {storeId},
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        });
    }

    static async getAllSuppliers(query: any, page: number, limit: number) {
        const [rows, total] = await Promise.all([
            SupplierModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    name: "asc",
                },
                select: {
                    id: true,
                    name: true,
                    phoneNumber: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            SupplierModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...rows];
        return {total, pages, page, limit, docs};
    }

    static async getSuppliers(storeId: bigint) {
        return SupplierModel.findMany({
            where: {storeId},
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        });
    }

    static async getAllProducts(query: any, page: number, limit: number) {
        const [rows, total] = await Promise.all([
            ProductModel.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    name: "asc",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    amount: true,
                    previousAmount: true,
                    costAmount: true,
                    availabilityStatus: true,
                    isEnabled: true,
                    barCode: true,
                    productCode: true,
                    productImage: true,
                    quantity: true,
                    stockType: true,
                    notifySupplier: true,
                    hasDiscount: true,
                    discountType: true,
                    discountValue: true,
                    storeId: true,
                    createdAt: true,
                    updatedAt: true,
                    branch: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            contactEmail: true,
                            phoneNumber: true,
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            name: true,
                            phoneNumber: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            }),
            ProductModel.count({where: query}),
        ]);

        const quotient = Math.floor(total / limit); // Get the quotient
        const remainder = total % limit; // Get the remainder
        let pages = quotient + (remainder > 0 ? 1 : 0);
        const docs = [...rows];
        return {total, pages, page, limit, docs};
    }

    static async getAllProductsNoPagination(query: any) {
        return ProductModel.findMany({
            where: query,
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                previousAmount: true,
                costAmount: true,
                availabilityStatus: true,
                isEnabled: true,
                barCode: true,
                productCode: true,
                productImage: true,
                quantity: true,
                stockType: true,
                notifySupplier: true,
                hasDiscount: true,
                discountType: true,
                discountValue: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        contactEmail: true,
                        phoneNumber: true,
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phoneNumber: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    static async getCategoryById(id: bigint) {
        return CategoryModel.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async getCategoryByStoreIdAndName(storeId: bigint, name: string) {
        return CategoryModel.findUnique({
            where: {storeId_name: {storeId, name}},
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async getSupplierById(id: bigint) {
        return SupplierModel.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async getSupplierByStoreIdAndName(storeId: bigint, name: string) {
        return SupplierModel.findUnique({
            where: {storeId_name: {storeId, name}},
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async getProductById(id: bigint) {
        return ProductModel.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                previousAmount: true,
                costAmount: true,
                availabilityStatus: true,
                isEnabled: true,
                barCode: true,
                productCode: true,
                productImage: true,
                quantity: true,
                stockType: true,
                notifySupplier: true,
                hasDiscount: true,
                discountType: true,
                discountValue: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        contactEmail: true,
                        phoneNumber: true,
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phoneNumber: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    static async getProductByCode(productCode: string) {
        return ProductModel.findFirst({
            where: {productCode},
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                previousAmount: true,
                costAmount: true,
                availabilityStatus: true,
                isEnabled: true,
                barCode: true,
                productCode: true,
                productImage: true,
                quantity: true,
                stockType: true,
                notifySupplier: true,
                hasDiscount: true,
                discountType: true,
                discountValue: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        contactEmail: true,
                        phoneNumber: true,
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phoneNumber: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    static async getProductByBranchIdAndName(branchId: bigint, name: string) {
        return ProductModel.findUnique({
            where: {storeBranchId_name: {storeBranchId: branchId, name}},
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                previousAmount: true,
                costAmount: true,
                availabilityStatus: true,
                isEnabled: true,
                barCode: true,
                productCode: true,
                productImage: true,
                quantity: true,
                stockType: true,
                notifySupplier: true,
                hasDiscount: true,
                discountType: true,
                discountValue: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        contactEmail: true,
                        phoneNumber: true,
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phoneNumber: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    static async getProductsByBranchIdAndProductIds(branchId: bigint, products: bigint[]) {
        return ProductModel.findMany({
            where: {
                id: {
                    in: products,
                },
                ...(branchId && {storeBranchId: branchId}),
            },
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                previousAmount: true,
                costAmount: true,
                availabilityStatus: true,
                isEnabled: true,
                barCode: true,
                productCode: true,
                productImage: true,
                quantity: true,
                stockType: true,
                notifySupplier: true,
                hasDiscount: true,
                discountType: true,
                discountValue: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                store: {
                    select: {
                        id: true,
                        discountConfig: true
                    }
                },
            },
        });
    }

    static async updateCategoryById(id: bigint, category: any) {
        return CategoryModel.update({
            where: {id},
            data: category,
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async updateSupplierById(id: bigint, supplier: any) {
        return SupplierModel.update({
            where: {id},
            data: supplier,
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async updateProductById(id: bigint, product: any) {
        return ProductModel.update({
            where: {id},
            data: product,
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                previousAmount: true,
                costAmount: true,
                availabilityStatus: true,
                isEnabled: true,
                barCode: true,
                productCode: true,
                productImage: true,
                quantity: true,
                stockType: true,
                notifySupplier: true,
                hasDiscount: true,
                discountType: true,
                discountValue: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        contactEmail: true,
                        phoneNumber: true,
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phoneNumber: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    static async updateProductByIdPayment(id: bigint, product: any) {
        return ProductModel.update({
            where: {id},
            data: product,
        });
    }

    static async createCategory(category: any) {
        return CategoryModel.create({
            data: category,
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async createSupplier(supplier: any) {
        return SupplierModel.create({
            data: supplier,
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    static async createProduct(product: any) {
        return ProductModel.create({
            data: product,
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                previousAmount: true,
                costAmount: true,
                availabilityStatus: true,
                isEnabled: true,
                barCode: true,
                productCode: true,
                productImage: true,
                quantity: true,
                stockType: true,
                notifySupplier: true,
                hasDiscount: true,
                discountType: true,
                discountValue: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        contactEmail: true,
                        phoneNumber: true,
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phoneNumber: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    static async createMultipleCategory(categories: any[]) {
        return CategoryModel.createMany({
            data: categories,
        });
    }

    static async createMultipleSuppliers(suppliers: any[]) {
        return SupplierModel.createMany({
            data: suppliers,
        });
    }

    static async createMultipleProducts(products: any[]) {
        const upsertPromises = products.map(product =>
            ProductModel.upsert({
                where: {storeBranchId_name: {storeBranchId: product.storeBranchId, name: product.name}}, // Assumes 'name' is a unique identifier for the product
                update: product,
                create: product,
            })
        );

        return Promise.all(upsertPromises);
    }

    static async getSuppliersByStoreIdAndNames(storeId: bigint, names: string[]) {
        return SupplierModel.findMany({
            where: {
                storeId: storeId,  // Assuming the field is named `storeId`
                name: {
                    in: names,  // Batch query by unique names
                },
            },
        });
    }

    static async getCategoriesByStoreIdAndNames(storeId: bigint, names: string[]) {
        return CategoryModel.findMany({
            where: {
                storeId: storeId,  // Assuming the field is named `storeId`
                name: {
                    in: names,  // Batch query by unique names
                },
            },
        });
    }

    static async getProductsByBranchIdAndNames(branchId: bigint, names: string[]) {
        return ProductModel.findMany({
            where: {
                storeBranchId: branchId,  // Assuming the field is named `storeId`
                name: {
                    in: names,  // Batch query by unique names
                },
            },
        });
    }

    static async getStockSummary(storeId: bigint, branchId: any, lowStockThreshold: number) {
        const activeStatus = "active" as ProductStaus;
        const [all, active, lowStock, outStock] = await Promise.all([
            // Count all products
            ProductModel.count({
                where: {
                    storeId: storeId,
                    ...branchId && {storeBranchId: BigInt(branchId)},
                },
            }),

            // Count active products with quantity > 0
            ProductModel.count({
                where: {
                    storeId: storeId,
                    ...branchId && {storeBranchId: BigInt(branchId)},
                    availabilityStatus: activeStatus,
                    quantity: {gt: Number(0)},
                },
            }),

            // Count low stock products (quantity <= threshold and > 0)
            ProductModel.count({
                where: {
                    storeId: storeId,
                    ...branchId && {storeBranchId: BigInt(branchId)},
                    quantity: {lte: lowStockThreshold, gt: Number(0)},
                },
            }),

            // Count out-of-stock products (quantity = 0)
            ProductModel.count({
                where: {
                    storeId: storeId,
                    ...branchId && {storeBranchId: BigInt(branchId)},
                    quantity: 0,
                },
            }),
        ]);

        return {
            all: all || 0,
            active: active || 0,
            lowStock: lowStock || 0,
            outStock: outStock || 0,
        };
    }
}

export {ProductService};