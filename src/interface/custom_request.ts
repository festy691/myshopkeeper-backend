import {Request} from 'express';

export interface CustomRequest extends Request {
    user?: any; // Adding the 'user' property to the Request interface
    store?: any; // Adding the 'store' property to the Request interface
    permissions?: any; // Adding the 'store' property to the Request interface
    role?: any; // Adding the 'store' property to the Request interface
    device?: any; // Adding the 'device' property to the Request interface
}