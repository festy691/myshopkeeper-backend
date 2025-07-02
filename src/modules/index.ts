import express from 'express';
import {AuthRouter} from "./auth/router";
import {NotificationRouter} from "./notification/router";
import {ImageRouter} from "./image/router";
import {StoreRouter} from "./store/router";
import {ProductRouter} from "./products/router";
import {SalesRouter} from "./sales/router";
import {LogRouter} from "./log/router";

const restRouter = express.Router();

export {restRouter};

restRouter.use('/auth', AuthRouter);
restRouter.use('/notifications', NotificationRouter);
restRouter.use('/images', ImageRouter);
restRouter.use('/stores', StoreRouter);
restRouter.use('/products', ProductRouter);
restRouter.use('/sales', SalesRouter);
restRouter.use('/logs', LogRouter);