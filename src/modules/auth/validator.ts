import {param, body} from "express-validator";
import {BaseValidator} from "../../middleware/basevalidator";

class AuthValidator extends BaseValidator {
    static validateUserSignup() {
        return [
            body("email").isString().withMessage("Provide a valid email"),

            body("firstName").isString().withMessage("Provide a valid firstName"),

            body("lastName").isString().withMessage("Provide a valid lastName"),

            body("phoneNumber").isString().withMessage("Provide a valid phoneNumber"),

            body("countryCode").isString().withMessage("Provide a valid countryCode"),

            body("password").isString().withMessage("Provide a valid password"),
        ];
    }

    static validateRole() {
        return [
            body("roleId")
                .isString()
                .withMessage("Provide a valid roleId"),
            body("branchId")
                .isString()
                .withMessage("Provide a valid branchId"),
            body("staffCode")
                .isString()
                .withMessage("Provide a valid staffCode"),
        ];
    }

    static validateRequestOtp() {
        return [
            body("emailOrPhone")
                .isString()
                .withMessage("Provide a valid emailOrPhone"),
        ];
    }

    static validateDeleteAccount() {
        return [
            body("password")
                .isString()
                .withMessage("Provide a valid password"),
        ];
    }

    static validateVerifyOtp() {
        return [
            body("emailOrPhone")
                .isString()
                .withMessage("Provide a valid emailOrPhone"),

            body("otpCode").isString().withMessage("Provide a valid otpCode"),
        ];
    }

    static validateRefreshToken() {
        return [
            body("emailOrPhone")
                .isString()
                .withMessage("Provide a valid emailOrPhone"),

            body("refreshToken").isString().withMessage("Provide a valid refreshToken"),
        ];
    }

    static validateCompleteResetPassword() {
        return [
            body("emailOrPhone")
                .isString()
                .withMessage("Provide a valid emailOrPhone"),

            body("password").isString().withMessage("Provide a valid password"),
        ];
    }

    static validateChangePassword() {
        return [
            body("oldPassword")
                .isString()
                .withMessage("Provide a valid oldPassword"),

            body("newPassword").isString().withMessage("Provide a valid newPassword"),
        ];
    }

    static validatePassword() {
        return [
            body("password")
                .isString()
                .withMessage("Provide a valid password"),
        ];
    }

    static validateLogin() {
        return [
            body("emailOrPhone")
                .isString()
                .withMessage("Provide a valid emailOrPhone"),

            body("password")
                .isString()
                .withMessage("Provide a valid password"),
        ];
    }

    static validateLoginStaffCode() {
        return [
            body("staffCode")
                .isString()
                .withMessage("Provide a valid staffCode"),

            body("storeId")
                .isString()
                .withMessage("Provide a valid storeId"),
        ];
    }

    static validateSingleUser() {
        return [
            param("id")
                .isNumeric()
                .withMessage("Provide a valid id"),
        ];
    }
}

export {AuthValidator};
