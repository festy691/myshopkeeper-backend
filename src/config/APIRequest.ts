// Import the axios library
import axios from 'axios';
import {configData} from "../config/env_config";
import {responseLogger, sanitizeLog} from "../middleware/logger";

const {APP_URL} = configData;

class APIRequest {
    constructor() {
    }

    baseUrl = `${APP_URL}/api/v2`;

    //Get request
    get = async (url: string, headers: any) => {
        return new Promise(async (resolve) => {
            responseLogger().info(sanitizeLog(url));
            const result = await axios.get(url, {headers: headers});
            if (!result) resolve({status: false, message: "Request failed!!!"});
            resolve({
                status: result.data.status || result.data.responseStatus || (result.data.status_code === 1),
                message: result.data.message || result.data.status_message || "",
                data: result.data.data || result.data.responseData || {},
            });
        });
    }

    post = async (url: string, reqData: any, headers: any) => {
        return new Promise(async (resolve) => {
            responseLogger().info(sanitizeLog(url));
            responseLogger().info(sanitizeLog(JSON.stringify(reqData)));
            const result = await axios.post(url, reqData, {headers: headers});
            responseLogger().info(sanitizeLog(JSON.stringify(result.data)));
            if (!result) resolve({status: false, message: "Request failed!!!"});
            resolve({
                status: result.data.status || result.data.responseStatus || (result.data.status_code === 1),
                message: result.data.message || result.data.status_message || "",
                data: result.data.data || result.data.responseData || {},
            });
        });
    }

    put = async (url: string, reqData: any, headers: any) => {
        return new Promise(async (resolve) => {
            responseLogger().info(sanitizeLog(url));
            responseLogger().info(sanitizeLog(JSON.stringify(reqData)));
            const result = await axios.put(url, reqData, {headers: headers});
            responseLogger().info(sanitizeLog(JSON.stringify(result.data)));
            if (!result) resolve({status: false, message: "Request failed!!!"});
            resolve({
                status: result.data.status || result.data.responseStatus || (result.data.status_code === 1),
                message: result.data.message || result.data.status_message || "",
                data: result.data.data || result.data.responseData || {},
            });
        });
    }
}

export {APIRequest};