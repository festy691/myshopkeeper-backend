import express from 'express';
import StoreController from './controller';
import {upload} from '../../config/multer';
import {protect, authorize, deviceHeaderValid, protectStore} from '../../middleware/auth';
import {Permissions} from "../../middleware/permission";

import {ProductValidator} from "./validator";

const ProductRouter = express.Router();
export {ProductRouter};

ProductRouter.route('/create-category')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        ProductValidator.validateCreateCategory(),
        ProductValidator.validate,
        StoreController.createCategory
    );

ProductRouter.route('/download-multiple-category-sheet')
    .get(
        StoreController.downloadCategoriesSheet
    );

ProductRouter.route('/upload-multiple-category-sheet')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        StoreController.uploadCategoriesSheet
    );

ProductRouter.route('/create-multiple-category')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        ProductValidator.validateCreateMultipleCategory(),
        ProductValidator.validate,
        StoreController.uploadMultipleCategories
    );

ProductRouter.route('/update-category/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateStock),
        upload.single('file'),
        ProductValidator.validateSingleData(),
        ProductValidator.validate,
        StoreController.updateCategory
    );

ProductRouter.route('/categories')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        ProductValidator.validatePaginate(),
        ProductValidator.validate,
        StoreController.getAllCategories
    );

ProductRouter.route('/categories/store/all')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        StoreController.getAllCategoriesNoPagination
    );

ProductRouter.route('/categories/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        ProductValidator.validateSingleData(),
        ProductValidator.validate,
        StoreController.getSingleCategory
    );

ProductRouter.route('/create-supplier')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        ProductValidator.validateCreateSupplier(),
        ProductValidator.validate,
        StoreController.createSupplier
    );

ProductRouter.route('/download-multiple-supplier-sheet')
    .get(
        StoreController.downloadSuppliersSheet
    );

ProductRouter.route('/upload-multiple-supplier-sheet')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        StoreController.uploadSuppliersSheet
    );

ProductRouter.route('/create-multiple-supplier')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        ProductValidator.validateCreateMultipleCategory(),
        ProductValidator.validate,
        StoreController.uploadMultipleSuppliers
    );

ProductRouter.route('/update-supplier/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateStock),
        upload.single('file'),
        ProductValidator.validateSingleData(),
        ProductValidator.validate,
        StoreController.updateSupplier
    );

ProductRouter.route('/suppliers')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        ProductValidator.validatePaginate(),
        ProductValidator.validate,
        StoreController.getAllSuppliers
    );

ProductRouter.route('/suppliers/store/all')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        StoreController.getAllSuppliersNoPagination
    );

ProductRouter.route('/suppliers/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        ProductValidator.validateSingleData(),
        ProductValidator.validate,
        StoreController.getSingleSupplier
    );

ProductRouter.route('/create-product')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        ProductValidator.validateCreateProduct(),
        ProductValidator.validate,
        StoreController.createProduct
    );

ProductRouter.route('/download-multiple-product-sheet')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        StoreController.downloadProductSheet
    );

ProductRouter.route('/upload-multiple-product-sheet')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        ProductValidator.validateCreateMultipleProducts(),
        ProductValidator.validate,
        StoreController.uploadProductsSheet
    );

ProductRouter.route('/create-multiple-products')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AddStock),
        upload.single('file'),
        ProductValidator.validateCreateMultipleProducts(),
        ProductValidator.validateCreateMultipleCategory(),
        ProductValidator.validate,
        StoreController.uploadMultipleProducts
    );

ProductRouter.route('/update-product/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateStock),
        upload.single('file'),
        ProductValidator.validateSingleData(),
        ProductValidator.validate,
        StoreController.updateProduct
    );

ProductRouter.route('/assign-product/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateStock),
        upload.single('file'),
        ProductValidator.validateSingleData(),
        ProductValidator.validateSupplierId(),
        ProductValidator.validate,
        StoreController.assignProductToSupplier
    );

ProductRouter.route('/products')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        ProductValidator.validatePaginate(),
        ProductValidator.validate,
        StoreController.getAllProducts
    );

ProductRouter.route('/products/report/:branchId/:status')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        StoreController.getAllProductsNoPagination
    );

ProductRouter.route('/products/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        ProductValidator.validateSingleData(),
        ProductValidator.validate,
        StoreController.getSingleProduct
    );

ProductRouter.route('/stock-summary')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        StoreController.stockSummary
    );


ProductRouter.route('/product-code/:code')
    .get(
        ProductValidator.validateSingleDataCode(),
        ProductValidator.validate,
        StoreController.getProductByCode
    );