import {configData} from "../config/env_config";

const {NODE_ENV, APP_NAME} = configData;
import {Response, NextFunction} from "express";
import {responseLogger} from "./logger";
import {convertBigIntToString} from "../config/util";

const createResponse = async (
    res: Response,
    httpStatusCode: number,
    responseStatus: string,
    data: any
) => {
    let responseObject;

    if (
        responseStatus === ResponseStatus.Error ||
        responseStatus === ResponseStatus.Failure
    ) {
        responseLogger().error(`${data}`);

        responseObject = {
            status: false,
            message: data,
        };

    } else {
        responseLogger().info(`${data.message}`);

        responseObject = {
            status: true,
            message: data.message,
            data: data.data,
        };
    }

    //const response = await encryptResponse(JSON.stringify(responseObject));
    return res.status(httpStatusCode).json(convertBigIntToString(responseObject));
};

const HttpStatusCode = {
    StatusOk: 200,
    StatusCreated: 201,
    StatusBadRequest: 400,
    StatusUnauthorized: 401,
    StatusDependecyFailure: 424,
    StatusNotFound: 404,
    StatusUnprocessableEntity: 422,
    StatusInternalServerError: 500,
    StatusForbidden: 403,
};

const ResponseStatus = {
    Success: "success",
    Failure: "fail",
    Error: "error",
};

const ResponseMessage = {
    HealthCheckMessage: `Welcome to the ${APP_NAME} Server!`,
    NotFoundMessage: "Not Found!",
};

export {HttpStatusCode, ResponseStatus, ResponseMessage, createResponse};
