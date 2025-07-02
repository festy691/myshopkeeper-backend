import express from 'express';
import AuthController from './controller';
import {upload} from '../../config/multer';
import {protect, authorize, deviceHeaderValid, protectStore} from '../../middleware/auth';
import {Permissions} from "../../middleware/permission";

import {AuthValidator} from "./validator";

const AuthRouter = express.Router();
export {AuthRouter};

AuthRouter.route('/create-user')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateUserSignup(),
        AuthValidator.validate,
        AuthController.signupUser
    );

AuthRouter.route('/create-store-user')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        upload.single('file'),
        AuthValidator.validateUserSignup(),
        AuthValidator.validateRole(),
        AuthValidator.validate,
        AuthController.createStoreUser
    );

AuthRouter.route('/request-otp')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateRequestOtp(),
        AuthValidator.validate,
        AuthController.requestOtp
    );

AuthRouter.route('/verify-otp')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateVerifyOtp(),
        AuthValidator.validate,
        AuthController.verifyOtp
    );

AuthRouter.route('/delete-account')
    .post(
        deviceHeaderValid,
        protect,
        upload.single('file'),
        AuthValidator.validateDeleteAccount(),
        AuthValidator.validate,
        AuthController.deleteAccount
    );

AuthRouter.route('/block-account')
    .post(
        deviceHeaderValid,
        protect,
        upload.single('file'),
        AuthController.blockAccount
    );

AuthRouter.route('/disable-account')
    .post(
        deviceHeaderValid,
        protect,
        protectStore,
        authorize(Permissions.SuperAdmin.DeleteProfile),
        upload.single('file'),
        AuthController.disableStaff
    );

AuthRouter.route('/unblock-account/:id')
    .put(
        deviceHeaderValid,
        protect,
        upload.single('file'),
        AuthValidator.validateSingleUser(),
        AuthValidator.validate,
        AuthController.unblockAccount
    );

AuthRouter.route('/update-user')
    .post(
        deviceHeaderValid,
        protect,
        upload.single('file'),
        AuthController.updateUser
    );

AuthRouter.route('/all-users')
    .get(
        deviceHeaderValid,
        protect,
        authorize(Permissions.ShopkeeperAdmin.ManageUsers),
        AuthController.getUsers
    );

AuthRouter.route('/activate-two-fa')
    .post(
        deviceHeaderValid,
        protect,
        AuthValidator.validatePassword(),
        AuthValidator.validate,
        upload.single('file'),
        AuthController.enableTwoFaVerification
    );

AuthRouter.route('/deactivate-two-fa')
    .post(
        deviceHeaderValid,
        protect,
        AuthValidator.validatePassword(),
        AuthValidator.validate,
        upload.single('file'),
        AuthController.disableTwoFaVerification
    );

AuthRouter.route('/verify-two-fa-otp')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateVerifyOtp(),
        AuthValidator.validate,
        AuthController.verifyTwoFaOtp
    );

AuthRouter.route('/login-user')
    .post(
        deviceHeaderValid,
        AuthValidator.validateLogin(),
        AuthValidator.validate,
        upload.single('file'),
        AuthController.loginUser
    );

AuthRouter.route('/login-staff-code')
    .post(
        deviceHeaderValid,
        AuthValidator.validateLoginStaffCode(),
        AuthValidator.validate,
        upload.single('file'),
        AuthController.loginWithStaffCode
    );

AuthRouter.route('/reset-password')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateRequestOtp(),
        AuthValidator.validate,
        AuthController.resetPassword
    );

AuthRouter.route('/verify-reset-password')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateVerifyOtp(),
        AuthValidator.validate,
        AuthController.verifyResetPassword
    );

AuthRouter.route('/set-reset-password-otp')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateVerifyOtp(),
        AuthValidator.validateCompleteResetPassword(),
        AuthValidator.validate,
        AuthController.setResetPasswordWithOtp
    );

AuthRouter.route('/complete-reset-password')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateCompleteResetPassword(),
        AuthValidator.validate,
        AuthController.completeResetPassword
    );

AuthRouter.route('/change-password')
    .post(
        deviceHeaderValid,
        protect,
        upload.single('file'),
        AuthValidator.validateChangePassword(),
        AuthValidator.validate,
        AuthController.changePassword
    );

AuthRouter.route('/refresh-token')
    .post(
        deviceHeaderValid,
        upload.single('file'),
        AuthValidator.validateRefreshToken(),
        AuthValidator.validate,
        AuthController.refreshAuthToken
    );

AuthRouter.route('/users/:id')
    .get(
        protect,
        upload.single('file'),
        AuthValidator.validateSingleUser(),
        AuthValidator.validate,
        AuthController.getUser
    );