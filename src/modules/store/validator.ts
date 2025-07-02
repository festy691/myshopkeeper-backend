import {param, body, query} from "express-validator";
import {BaseValidator} from "../../middleware/basevalidator";

class StoreValidator extends BaseValidator {
    static validateCreateStore() {
        return [
            body("name").isString().withMessage("Provide a valid name"),

            body("description").isString().withMessage("Provide a valid description"),

            body("businessEmail").isEmail().withMessage("Provide a valid businessEmail"),

            body("contactEmail").isEmail().withMessage("Provide a valid contactEmail"),

            body("phoneNumber").isString().withMessage("Provide a valid phoneNumber"),
        ];
    }

    static validateCreateStoreBranch() {
        return [
            body("name").isString().withMessage("Provide a valid name"),

            body("description").isString().withMessage("Provide a valid description"),

            body("contactEmail").isEmail().withMessage("Provide a valid contactEmail"),

            body("phoneNumber").isString().withMessage("Provide a valid phoneNumber"),
        ];
    }

    static validateCreateRole() {
        return [
            body("title").isString().withMessage("Provide a valid title"),

            body("description").isString().withMessage("Provide a valid description"),

            body("permissions").isArray().withMessage("Provide a valid permissions"),
        ];
    }

    static validateCreateWorker() {
        return [
            body("roleId").isNumeric().withMessage("Provide a valid roleId"),

            body("branchId").isNumeric().withMessage("Provide a valid branchId"),

            body("userId").isNumeric().withMessage("Provide a valid userId"),
        ];
    }

    static validatePaginate() {
        return [
            query("page")
                .isNumeric()
                .withMessage("Provide a valid page"),

            query("limit")
                .isNumeric()
                .withMessage("Provide a valid limit"),
        ];
    }

    static validateSingleData() {
        return [
            param("id")
                .isNumeric()
                .withMessage("Provide a valid id"),
        ];
    }
}

export {StoreValidator};
