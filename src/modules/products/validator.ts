import {param, body, query} from "express-validator";
import {BaseValidator} from "../../middleware/basevalidator";

class ProductValidator extends BaseValidator {
    static validateCreateProduct() {
        return [
            body("name").isString().withMessage("Provide a valid name"),

            body("description").isString().withMessage("Provide a valid description"),

            body("amount").isNumeric().withMessage("Provide a valid amount"),

            body("quantity").isNumeric().withMessage("Provide a valid quantity"),

            body("storeBranchId").isNumeric().withMessage("Provide a valid storeBranchId"),
        ];
    }

    static validateCreateCategory() {
        return [
            body("name").isString().withMessage("Provide a valid name"),

            body("description").isString().withMessage("Provide a valid description"),
        ];
    }

    static validateCreateSupplier() {
        return [
            body("name").isString().withMessage("Provide a valid name"),

            body("email").isEmail().withMessage("Provide a valid email"),

            body("phoneNumber").isString().withMessage("Provide a valid phoneNumber"),
        ];
    }

    static validateCreateMultipleProducts() {
        return [
            body("branchId").isNumeric().withMessage("Provide a valid branchId"),
        ];
    }

    static validateCreateMultipleCategory() {
        return [
            body("data").isArray().withMessage("Provide a valid data"),
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

    static validateSupplierId() {
        return [
            body("supplierId")
                .isString()
                .withMessage("Provide a valid supplierId"),
        ];
    }

    static validateSingleDataCode() {
        return [
            param("code")
                .isString()
                .withMessage("Provide a valid code"),
        ];
    }
}

export {ProductValidator};
