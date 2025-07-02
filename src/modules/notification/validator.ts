import { param, body, query } from "express-validator";
import { BaseValidator } from "../../middleware/basevalidator";

class NotificationValidator extends BaseValidator {
  static validateCreateNotification() {
    return [
      body("title").isString().withMessage("Provide a valid title"),

      body("message").isString().withMessage("Provide a valid message"),

      body("userId").isUUID().withMessage("Provide a valid userId"),
    ];
  }

  static validateUpdateNotification() {
    return [
      body("id")
        .isUUID()
        .withMessage("Provide a valid id"),
    ];
  }

  static validateGetNotification() {
    return [
      param("id")
        .isUUID()
        .withMessage("Provide a valid id"),
    ];
  }

  static validatePaginate() {
    return [
      query("page")
        .isNumeric()
        .withMessage("Provide a valid page"),

      query("limit").isNumeric().withMessage("Provide a valid limit"),
    ];
  }

}

export { NotificationValidator };
