import {validationResult} from 'express-validator';
import {Response, NextFunction} from "express";
import {CustomRequest} from "../interface/custom_request";

import {
    HttpStatusCode,
    ResponseStatus,
    createResponse,
} from "./response_formatter";

class BaseValidator {
    static validate(req: CustomRequest, res: Response, next: NextFunction) {
        const errors = validationResult(req);

        if (errors.isEmpty()) return next();

        return createResponse(
            res,
            HttpStatusCode.StatusUnprocessableEntity,
            ResponseStatus.Error,
            errors.array()[0].msg
        );
    }
}

export {BaseValidator};
