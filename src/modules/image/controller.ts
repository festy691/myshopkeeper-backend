import {ImageServices} from "./service";
import {Response} from "express";
import {CustomRequest} from "../../interface/custom_request";

import {
    HttpStatusCode,
    ResponseStatus,
    createResponse,
} from "../../middleware/response_formatter";
import {CustomFile} from "../../interface/custom_file";

import {configData} from "../../config/env_config";

const {STORAGE_SPACE_NAME} = configData;

export default {
    async uploadSingle(req: CustomRequest, res: Response) {
        try {
            const file = req.file as CustomFile;

            if (!file) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `image is required`
                );
            }

            const {path, originalname, filename} = file;

            const imgUrl = await ImageServices.uploadImageToS3AndGetURL(
                path,
                STORAGE_SPACE_NAME || "",
                filename
            );
            const response = {
                message: "Image uploaded",
                data: imgUrl,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (error: any) {
            throw error;
            /*return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${error.message}`
            );*/
        }
    },

    async uploadMultiple(req: CustomRequest, res: Response) {
        try {
            const files = req.files as CustomFile[];

            if (!files) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `image is required`
                );
            }

            let uploadList = await ImageServices.uploadMultipleImagesToS3AndGetURLs(
                files,
                STORAGE_SPACE_NAME || ""
            );

            const response = {
                message: "Files uploaded successfully",
                data: uploadList,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (error: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `Error: ${error.message}`
            );
        }
    },
};
