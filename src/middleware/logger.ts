// import {Response, NextFunction} from "express";
// import { CustomRequest } from "../interface/custom_request";

import {createLogger, format, transports} from 'winston';
import rTracer from 'cls-rtracer';
import * as path from 'path';
import * as fs from 'fs';
import sanitizeHtml from "sanitize-html";

const {combine, timestamp, label, printf} = format;

const getLogLabel = (callingModule: any) => {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
};

// Custom function to sanitize logs
function sanitizeLog(message: string) {
    // Remove unexpected carriage returns and line feeds
    message = message.replace(/[\r\n]+/g, " ");

    // Use HTML entity encoding for non-alphanumeric data
    message = sanitizeHtml(message, {
        allowedTags: [],
        allowedAttributes: {},
    });

    return message;
}

const formatDate = () => {
    var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return `${year}${month}${day}`;
};

const getFile = (type: any) => {
    const d = formatDate();
    const filename = `logs/${d}${type}.log`;
    fs.open(filename, "r", function (err, fd) {
        if (err) {
            fs.writeFile(filename, "", function (err) {
                if (err) {
                    return `logs/${type}.log`;
                }
                return filename;
            });
        } else {
            return filename;
        }
    });
    return filename;
};

const responseLogger = () =>
    createLogger({
        format: combine(
            format.colorize(),
            label({label: 'log'}),
            timestamp(),
            printf((info: any) => {
                const level = info.level.includes("info");
                return `| ${info.timestamp} ${sanitizeLog(info.message)} |`;
            })
        ),
        transports: [
            new transports.File({
                filename: getFile("info"),
                level: "info",
            }),
            new transports.File({
                filename: getFile("error"),
                level: "error",
            }),
        ],
        exitOnError: false,
    });

export {
    responseLogger,
    sanitizeLog
};