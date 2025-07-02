import express from 'express';
import StoreController from './controller';
import {upload} from '../../config/multer';
import {protect, authorize, deviceHeaderValid, protectStore} from '../../middleware/auth';
import {Permissions} from "../../middleware/permission";

import {StoreValidator} from "./validator";

const StoreRouter = express.Router();
export {StoreRouter};

StoreRouter.route('/create-role')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ManagePermission),
        upload.single('file'),
        StoreValidator.validateCreateRole(),
        StoreValidator.validate,
        StoreController.createStoreRole
    );

StoreRouter.route('/update-role/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ManagePermission),
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.updateStoreRole
    );

StoreRouter.route('/assign-role')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.AssignRole),
        upload.single('file'),
        StoreValidator.validateCreateWorker(),
        StoreValidator.validate,
        StoreController.assignRoleToUser
    );

StoreRouter.route('/create-store')
    .post(
        deviceHeaderValid,
        protect,
        upload.single('file'),
        StoreValidator.validateCreateStore(),
        StoreValidator.validate,
        StoreController.createStore
    );

StoreRouter.route('/update-store/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateStore),
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.updateStore
    );

StoreRouter.route('/verify-terminal/:id') //store ID
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateStore),
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.verifyTerminal
    );

StoreRouter.route('/create-branch')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.CreateBranch),
        upload.single('file'),
        StoreValidator.validateCreateStoreBranch(),
        StoreValidator.validate,
        StoreController.createStoreBranch
    );

StoreRouter.route('/update-branch/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateBranch),
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.updateStoreBranch
    );

StoreRouter.route('/update-discount/:id')
    .put(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.UpdateBranch),
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.updateDiscount
    );

StoreRouter.route('/permissions')
    .get(
        StoreController.getAllPermissions
    );

StoreRouter.route('/roles')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ManagePermission),
        upload.single('file'),
        StoreController.getAllStoreRoles
    );

StoreRouter.route('/generic-roles')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        StoreController.fetchGenericRoles
    );

StoreRouter.route('/workers')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ViewUser),
        upload.single('file'),
        StoreValidator.validatePaginate(),
        StoreValidator.validate,
        StoreController.getAllWorkers
    );

StoreRouter.route('/workers-branch/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ViewUser),
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.getAllBranchWorkers
    );

StoreRouter.route('/workers-store/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ViewUser),
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.getAllStoreWorkers
    );

StoreRouter.route('/stores')
    .get(
        deviceHeaderValid,
        protect,
        upload.single('file'),
        StoreValidator.validatePaginate(),
        StoreValidator.validate,
        StoreController.getAllStores
    );

StoreRouter.route('/merchants')
    .get(
        deviceHeaderValid,
        protect,
        authorize(Permissions.ShopkeeperAdmin.ManageUsers),
        StoreController.getAllMerchants
    );

StoreRouter.route('/branches')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ViewBranch),
        upload.single('file'),
        StoreValidator.validatePaginate(),
        StoreValidator.validate,
        StoreController.getAllStoreBranches
    );

StoreRouter.route('/store-branches')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.ViewBranch),
        upload.single('file'),
        StoreController.getStoreBranches
    );

StoreRouter.route('/branches/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.getSingleBranch
    );

StoreRouter.route('/stores/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.getSingleStore
    );

StoreRouter.route('/workers/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.getSingleWorker
    );

StoreRouter.route('/roles/:id')
    .get(
        deviceHeaderValid,
        protect,
        protectStore,
        upload.single('file'),
        StoreValidator.validateSingleData(),
        StoreValidator.validate,
        StoreController.getSingleStoreRole
    );

StoreRouter.route('/overview/merchant')
    .get(
        deviceHeaderValid,
        protect,
        authorize(Permissions.ShopkeeperAdmin.ManageStores),
        StoreController.fetchMerchantOverview
    );

StoreRouter.route('/summary/merchant')
    .get(
        deviceHeaderValid,
        protect,
        authorize(Permissions.ShopkeeperAdmin.ManageStores),
        StoreController.fetchMerchantSummary
    );
