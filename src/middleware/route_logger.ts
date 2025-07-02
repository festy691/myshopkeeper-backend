import {CustomRequest} from "../interface/custom_request";
import {responseLogger, sanitizeLog} from "./logger";
import {NextFunction, Response} from "express";

const routeLogger = (req: CustomRequest, res: Response, next: NextFunction) => {
    console.info(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    let body = {...req.body};
    if (body && typeof body === "object") {
        if (body.password) {
            delete body.password;
        }
        if (body.otp) {
            delete body.otp;
        }
        if (body.token) {
            delete body.token;
        }
        if (body.newPassword) {
            delete body.newPassword;
        }
        if (body.oldPassword) {
            delete body.oldPassword;
        }
        if (body.transactionPin) {
            delete body.transactionPin;
        }
        if (body.pin) {
            delete body.pin;
        }
    }
    let data = {
        route: `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`,
        header: req.headers,
        body: body,
        query: req.query,
    }
    responseLogger().info(sanitizeLog(JSON.stringify(data)));
    next();
}

export {routeLogger}