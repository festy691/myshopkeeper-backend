import {Response} from "express";
import {CustomRequest} from "../../interface/custom_request";
import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the logs directory
const logsDirectory = path.join(__dirname, '../../../logs');

import {createResponse, HttpStatusCode, ResponseStatus} from "../../middleware/response_formatter";

export default {
    async getLogs(req: CustomRequest, res: Response) {
        try {
            const logFile = req.params.date + "info.log";
            const filePath = path.join(logsDirectory, logFile);

            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            } else {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Failure,
                    'Log file not found'
                );
            }
        } catch (error: any) {
            throw error;
        }
    },

    async getErrorLogs(req: CustomRequest, res: Response) {
        try {
            const logFile = req.params.date + "error.log";
            const filePath = path.join(logsDirectory, logFile);

            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            } else {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Failure,
                    'Log file not found'
                );
            }
        } catch (error: any) {
            throw error;
        }
    },
}