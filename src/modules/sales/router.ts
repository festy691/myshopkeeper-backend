import express from 'express';
import SalesController from './controller';
import {upload} from '../../config/multer';
import {protect, authorize, deviceHeaderValid, protectStore} from '../../middleware/auth';
import {Permissions} from "../../middleware/permission";

import {SalesValidator} from "./validator";

const SalesRouter = express.Router();
export {SalesRouter};

SalesRouter.route('/create-transaction')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.analyseTransaction(),
        SalesValidator.validateCreateTransaction(),
        SalesValidator.validate,
        SalesController.createTransaction
    );

SalesRouter.route('/edit-transaction')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.DeleteTransaction),
        upload.single('file'),
        SalesValidator.validateEditTransaction(),
        SalesValidator.validate,
        SalesController.editSingleTransaction
    );

SalesRouter.route('/create-offline-transaction')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.validateOfflineTransaction(),
        SalesValidator.validate,
        SalesController.createOfflineTransaction
    );

SalesRouter.route('/create-single-offline-transaction')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.validateCreateSingleOffline(),
        SalesValidator.validate,
        SalesController.createSingleOfflineTransaction
    );

SalesRouter.route('/create-single-offline-transaction-no-payment')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.validateCreateSingleOfflineNoPayment(),
        SalesValidator.validate,
        SalesController.createSingleOfflineTransactionNoPayment
    );

SalesRouter.route('/cancel-transaction')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.validateVerifyMomo(),
        SalesValidator.validate,
        SalesController.cancelTransaction
    );

SalesRouter.route('/make-payment')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.validateMakePayment(),
        SalesValidator.validate,
        SalesController.makePayment
    );

SalesRouter.route('/initiate-payment-momo')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.validateMomo(),
        SalesValidator.validate,
        SalesController.initiateMomo
    );

SalesRouter.route('/verify-payment-momo')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ProcessSales),
        upload.single('file'),
        SalesValidator.validateVerifyMomo(),
        SalesValidator.validate,
        SalesController.verifyMomoPayment
    );

SalesRouter.route('/transactions')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validatePaginate(),
        SalesValidator.validate,
        SalesController.getAllTransactions
    );

SalesRouter.route('/shops-transactions')
    .get(
        deviceHeaderValid,
        protect,
        SalesValidator.validatePaginate(),
        SalesValidator.validate,
        SalesController.getAllShopsTransaction
    );

SalesRouter.route('/payments')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validatePaginate(),
        SalesValidator.validate,
        SalesController.getAllPayments
    );

SalesRouter.route('/products')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validatePaginate(),
        SalesValidator.validate,
        SalesController.getAllSoldProducts
    );

SalesRouter.route('/transactions/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validateSingleData(),
        SalesValidator.validate,
        SalesController.getTransactionById
    );

SalesRouter.route('/payments/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validateSingleData(),
        SalesValidator.validate,
        SalesController.getPaymentById
    );

SalesRouter.route('/products/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validateSingleData(),
        SalesValidator.validate,
        SalesController.getSaleById
    );

SalesRouter.route('/transaction-analytics')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validateQueryAnalytics(),
        SalesValidator.validate,
        SalesController.transactionAnalytics
    );

SalesRouter.route('/transaction-overview')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesController.transactionOverview
    );

SalesRouter.route('/sales-summary')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesController.getSalesSummary
    );

SalesRouter.route('/sales-summary-paginated')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesController.getSalesSummaryWithPagination
    );

SalesRouter.route('/products-analytics')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.validateQueryAnalytics(),
        SalesValidator.validate,
        SalesController.salesAnalytics
    );

SalesRouter.route('/top-products/:branchId')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesController.getTopSoldItems
    );

SalesRouter.route('/analyse-transaction')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        SalesValidator.analyseTransaction(),
        SalesValidator.validate,
        SalesController.analyseTransaction
    );