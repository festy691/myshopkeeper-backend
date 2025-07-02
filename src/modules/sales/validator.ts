import {param, body, query} from "express-validator";
import {BaseValidator} from "../../middleware/basevalidator";

class SalesValidator extends BaseValidator {
    static analyseTransaction() {
        return [
            body("branchId").isString().withMessage("Provide a valid branchId"),

            body("products").isArray().withMessage("Provide a valid products"),
        ];
    }

    static validateCreateTransaction() {
        return [
            body("isPayLater").isBoolean().withMessage("Provide a valid isPayLater"),

            body("cashierId").isString().withMessage("Provide a valid cashierId"),
        ];
    }

    static validateOfflineTransaction() {
        return [
            body("data").isArray().withMessage("Provide a valid data"),
        ];
    }

    static validateMakePayment() {
        return [
            body("paymentMethod").isString().withMessage("Provide a valid paymentMethod"),

            body("currency").isString().withMessage("Provide a valid currency"),

            body("transactionId").isString().withMessage("Provide a valid transactionId"),

            body("cashierId").isString().withMessage("Provide a valid cashierId"),
        ];
    }

    static validateCreateSingleOffline() {
        return [
            body("cashierId").isString().withMessage("Provide a valid cashierId"),
            body("branchId").isString().withMessage("Provide a valid branchId"),
            body("paymentMethod").isString().withMessage("Provide a valid paymentMethod"),
            body("currency").isString().withMessage("Provide a valid currency"),
            body("amountPaid").isNumeric().withMessage("Provide a valid amountPaid"),
            body("amountToPay").isNumeric().withMessage("Provide a valid amountToPay"),
            body("products").isArray().withMessage("Provide a valid products"),
            body("vat").isNumeric().withMessage("Provide a valid vat"),
            body("nhil").isNumeric().withMessage("Provide a valid nhil"),
            body("covidLevy").isNumeric().withMessage("Provide a valid covidLevy"),
            body("serviceCharge").isNumeric().withMessage("Provide a valid serviceCharge"),
            body("gefl").isNumeric().withMessage("Provide a valid gefl"),
            body("trLevy").isNumeric().withMessage("Provide a valid trLevy"),
            body("storeDiscountAmount").isNumeric().withMessage("Provide a valid storeDiscountAmount"),
            body("totalPriceBeforeProductDiscount").isNumeric().withMessage("Provide a valid totalPriceBeforeProductDiscount"),
            body("totalPriceAfterProductDiscount").isNumeric().withMessage("Provide a valid totalPriceAfterProductDiscount"),
            body("storeDiscountApplied").isBoolean().withMessage("Provide a valid storeDiscountApplied"),
        ];
    }

    static validateCreateSingleOfflineNoPayment() {
        return [
            body("cashierId").isString().withMessage("Provide a valid cashierId"),
            body("branchId").isString().withMessage("Provide a valid branchId"),
            body("amountPaid").isNumeric().withMessage("Provide a valid amountPaid"),
            body("amountToPay").isNumeric().withMessage("Provide a valid amountToPay"),
            body("products").isArray().withMessage("Provide a valid products"),
            body("vat").isNumeric().withMessage("Provide a valid vat"),
            body("nhil").isNumeric().withMessage("Provide a valid nhil"),
            body("covidLevy").isNumeric().withMessage("Provide a valid covidLevy"),
            body("serviceCharge").isNumeric().withMessage("Provide a valid serviceCharge"),
            body("gefl").isNumeric().withMessage("Provide a valid gefl"),
            body("trLevy").isNumeric().withMessage("Provide a valid trLevy"),
            body("storeDiscountAmount").isNumeric().withMessage("Provide a valid storeDiscountAmount"),
            body("totalPriceBeforeProductDiscount").isNumeric().withMessage("Provide a valid totalPriceBeforeProductDiscount"),
            body("totalPriceAfterProductDiscount").isNumeric().withMessage("Provide a valid totalPriceAfterProductDiscount"),
            body("storeDiscountApplied").isBoolean().withMessage("Provide a valid storeDiscountApplied"),
        ];
    }

    static validateEditTransaction() {
        return [
            body("amountToPay").isNumeric().withMessage("Provide a valid amountToPay"),
            body("transactionId").isString().withMessage("Provide a valid transactionId"),
            body("products").isArray().withMessage("Provide a valid products"),
        ];
    }

    static validateVerifyMomo() {
        return [
            body("transactionId").isString().withMessage("Provide a valid transactionId"),
        ];
    }

    static validateMomo() {
        return [
            body("provider").isString().withMessage("Provide a valid provider"),

            body("phoneNumber").isString().withMessage("Provide a valid phoneNumber"),
        ];
    }

    static validateQueryAnalytics() {
        return [
            query("timeframe")
                .isString()
                .withMessage("Provide a valid timeframe"),

            query("startDate")
                .isString()
                .withMessage("Provide a valid startDate"),

            query("endDate")
                .isString()
                .withMessage("Provide a valid endDate"),
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

export {SalesValidator};