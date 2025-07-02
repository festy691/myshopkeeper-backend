import {configData} from "./env_config";

const {
    DEYWURO_BASE_URL,
    DEYWURO_USERNAME,
    DEYWURO_PASSWORD,
} = configData;

import {APIRequest} from './APIRequest';
import {responseLogger} from "../middleware/logger";
import {genOtpToken} from "./genOTPToken";
import {StoreService} from "../modules/store/service";
import {createResponse, HttpStatusCode, ResponseStatus} from "../middleware/response_formatter";
import {AuthService} from "../modules/auth/service";

const formatMoney = (amount: number, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";
        const formattedAmount = Math.abs(amount || 0).toFixed(decimalCount)
        let i = formattedAmount.toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - Number(i)).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.error(e);
        return amount;
    }
}

const getDaysDifference = (d1: Date, d2: Date) => {
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    // To calculate the time difference of two dates
    let difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    let difference_In_Days =
        Math.round(difference_In_Time / (1000 * 3600 * 24));

    return difference_In_Days;
}

const padTo2Digits = (num: number) => {
    return String(num).padStart(2, '0');
}

const sendSms = async (message: string, phoneNumber: string) => {
    try {
        const http: APIRequest = new APIRequest();
        const headers = {
            'Content-Type': 'application/json'
            // Add any other headers as needed
        };
        const endpoint = `${DEYWURO_BASE_URL}?username=${DEYWURO_USERNAME}&password=${DEYWURO_PASSWORD}&source=${DEYWURO_USERNAME}&destination=${phoneNumber}&message=${message}`;

        await http.get(
            endpoint,
            headers,
        );
    } catch (error) {
        console.error(error);
    }
}

const generateStoreId = (name: string) => {
    return `${name.split('')[0]}${name.split('')[1]}-${genOtpToken(10)}`;
}

const extractValues = (obj: any, result: string[] = []): string[] => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === "object" && value !== null) {
                // Recursively handle nested objects or arrays
                extractValues(value, result);
            } else {
                // Push non-object values as strings
                result.push(String(value));
            }
        }
    }
    return result;
}

function convertBigIntToString(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === "bigint") {
        return obj.toString();
    }

    if (obj instanceof Date) {
        return obj.toISOString(); // Preserve ISO date format
    }

    if (Array.isArray(obj)) {
        return obj.map(convertBigIntToString);
    }

    if (typeof obj === "object" && obj.constructor === Object) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)])
        );
    }

    return obj; // Return other types (string, number, etc.) as-is
}

function generateProductCode(prefix: string = 'PROD', length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return `${prefix}-${result}`;
}

const checkUserWorksStoreBranch = async (userId: bigint, branchId: bigint) => {
    const branchExist = await StoreService.singleStoreBranch(branchId);
    if (!branchExist) {
        console.log("Branch does not exist!!!");
        throw "Branch does not exist!!!";
    }

    const userExist = await AuthService.getSingleUser(userId);
    if (!userExist) {
        console.log("User does not exist!!!");
        throw "User does not exist!!!";
    }

    //Check if user trying to assign role works for this branch
    let owner = false;
    for (let i = 0; i < userExist.ownedStores.length; i++) {
        let store: any = userExist.ownedStores[i];
        if (store.id === branchExist.store.id) {
            owner = true;
        }
    }
    if (!owner) {
        const userWorksBranch = await StoreService.singleWorkerByUserAndBranchId(branchId, userId);
        if (!userWorksBranch) {
            console.log(`You don't have permission to do this action, because you don't work in this branch!!!`);
            throw `You don't have permission to do this action, because you don't work in this branch!!!`;
        }
    }
    return;
}

const checkUserWorksStore = async (userId: bigint, storeId: bigint) => {
    const storeExist = await StoreService.singleStore(storeId);
    if (!storeExist) {
        throw "Store does not exist!!!";
    }

    const userExist = await AuthService.getSingleUser(userId);
    if (!userExist) {
        throw "User does not exist!!!";
    }
    //Check if user trying to assign role works for this branch
    let owner = false;
    for (let i = 0; i < userExist.ownedStores.length; i++) {
        let store: any = userExist.ownedStores[i];
        if (BigInt(store.id) === storeId) {
            owner = true;
        }
    }
    if (!owner) {
        //Check if user trying to assign role works for this store
        const userWorksHere = await StoreService.checkUserWorksForStore(storeId, userId);
        if (!userWorksHere) {
            throw "You don't have permission to do this action, because you don't work in this store!!!";
        }
    }

    return;
}
export {
    formatMoney,
    getDaysDifference,
    padTo2Digits,
    sendSms,
    generateStoreId,
    extractValues,
    convertBigIntToString,
    generateProductCode,
    checkUserWorksStoreBranch,
    checkUserWorksStore,
}