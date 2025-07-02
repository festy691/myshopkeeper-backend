import express from "express";
import {deviceHeaderValid, protect} from "../../middleware/auth";
import {upload} from "../../config/multer";
import LogController from "./controller";

const LogRouter = express.Router();
export {LogRouter};

LogRouter.route('/:date')
    .get(
        //deviceHeaderValid,
        //protect,
        LogController.getLogs
    );

LogRouter.route('/error/:date')
    .get(
        //deviceHeaderValid,
        //protect,
        LogController.getErrorLogs
    );