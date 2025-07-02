import jwt from "jsonwebtoken";
//import User from '../resources/user/user.model';
import {NextFunction, Response} from "express";
import {CustomRequest} from "../interface/custom_request";
import {configData} from "../config/env_config";
import {AuthService} from "../modules/auth/service";
import {responseLogger, sanitizeLog} from "./logger";

import {createResponse, HttpStatusCode, ResponseStatus,} from "./response_formatter";
import * as ua from "useragent";
import {StoreService} from "../modules/store/service";
import {Permissions} from "./permission";
import {extractValues} from "../config/util"; // If using the useragent library

const {APP_NAME, SECRET_KEY, EXPIRES_IN} = configData;

function extractDeviceInfo(userAgent: string) {
    let deviceType = "Unknown";
    let os = "Unknown";
    let browser = "Unknown";

    // Option 1: Using useragent library (recommended)
    if (ua) {
        const parsedUserAgent = ua.parse(userAgent);
        deviceType = parsedUserAgent.device.family || "Unknown";
        os = parsedUserAgent.os.toString() || "Unknown";
        browser = parsedUserAgent.family || "Unknown";

        //console.log(parsedUserAgent.device);
        return {deviceType, os, browser};
    }

    // Option 2: Basic parsing (less reliable)
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
        );
    deviceType = isMobile ? "Mobile" : "Desktop";

    const osMatches = userAgent.match(/OS ([0-9]+)_([0-9]+)_?([0-9]+)?/i); // Basic OS version extraction
    os = osMatches
        ? `iOS <span class="math-inline">\{osMatches\[1\]\}\.</span>{osMatches[2]}${
            osMatches[3] ? "." + osMatches[3] : ""
        }`
        : os;

    return {deviceType, os, browser}; // Basic information
}

const deviceHeaderValid = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.headers["d-uuid"]) {
            return createResponse(
                res,
                HttpStatusCode.StatusUnauthorized,
                ResponseStatus.Error,
                `Unauthorized access. The application did not start up properly. Please connect to an internet and restart the application`
            );
        }

        const userAgent = req.headers["user-agent"];
        const deviceInfo = extractDeviceInfo(userAgent ?? "");
        responseLogger().info(sanitizeLog(`Device information: ${JSON.stringify(deviceInfo)}`));

        req.device = {
            name: deviceInfo.deviceType,
            deviceUniqueId: req.headers["d-uuid"],
            deviceIp: req.ip,
        };

        next();
    } catch (error: any) {
        responseLogger().error(error.toString());
        return createResponse(
            res,
            HttpStatusCode.StatusUnauthorized,
            ResponseStatus.Error,
            `Unauthorized access. The application could not verify device info. Please connect to an internet.`
        );
    }
};

const protect = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | null = null;
        if (
            req.headers.authorization &&
            (req.headers.authorization.startsWith("bearer") ||
                req.headers.authorization.startsWith("Bearer"))
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return createResponse(
                res,
                HttpStatusCode.StatusUnauthorized,
                ResponseStatus.Error,
                `Unauthorized access`
            );
        }

        const decoded: any = jwt.verify(token, SECRET_KEY || "");
        if (!decoded) {
            return createResponse(
                res,
                HttpStatusCode.StatusUnauthorized,
                ResponseStatus.Error,
                `Unauthorized access`
            );
        }

        responseLogger().info(sanitizeLog(JSON.stringify(decoded)));

        const user = await AuthService.getSingleUserAuthenticate(BigInt(decoded.id));
        if (!user) {
            responseLogger().info(sanitizeLog(`Authorization token: User not found`));
            return createResponse(
                res,
                HttpStatusCode.StatusUnauthorized,
                ResponseStatus.Error,
                `Unauthorized access`
            );
        }

        if (user.email.toLowerCase() === 'admin@blupenguin.com') {
            req.permissions = extractValues(Permissions.ShopkeeperAdmin);
        }

        req.user = user;
        next();
    } catch (error: any) {
        responseLogger().error(error.toString());
        return createResponse(
            res,
            HttpStatusCode.StatusUnauthorized,
            ResponseStatus.Error,
            `Unauthorized access`
        );
    }
};

const protectStore = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers["s-uuid"];

        if (!token || (typeof token !== "string")) {
            return createResponse(
                res,
                HttpStatusCode.StatusForbidden,
                ResponseStatus.Error,
                `Permission Denied, invalid Store ID!!!`
            );
        }

        const store = await StoreService.singleStoreAuth(BigInt(token));
        if (!store) {
            return createResponse(
                res,
                HttpStatusCode.StatusForbidden,
                ResponseStatus.Error,
                `Permission Denied!!!`
            );
        }

        req.store = store;
        if (BigInt(store.owner.id) === BigInt(req.user.id)) {
            req.permissions = extractValues(Permissions.SuperAdmin);
            req.role = "admin";
        } else {
            const worksHere = await StoreService.checkUserWorksForStore(BigInt(token), BigInt(req.user.id));
            if (worksHere) {
                req.permissions = worksHere.storeProfileRole.permissions.split(",");
                req.role = worksHere.storeProfileRole.title.toLowerCase();
            } else {
                req.permissions = ['None'];
                req.role = "";
            }
        }
        next();
    } catch (error: any) {
        responseLogger().error(error.toString());
        return createResponse(
            res,
            HttpStatusCode.StatusUnauthorized,
            ResponseStatus.Error,
            `Permission Denied!!!`
        );
    }
};

const authorize = (permission: string) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.permissions.includes(permission)) {
            return createResponse(
                res,
                HttpStatusCode.StatusForbidden,
                ResponseStatus.Error,
                `Permission denied!!!`
            );
        }
        next();
    };
};

const authenticate = async (user: any) => {
    const now = new Date();
    const payload = {
        id: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        time: new Date(),
        expire: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    };

    return jwt.sign(payload, SECRET_KEY ?? "", {
        expiresIn: EXPIRES_IN,
    });
};

export {protect, authorize, authenticate, deviceHeaderValid, protectStore};
