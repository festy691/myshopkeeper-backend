import express, {NextFunction, Response} from "express";
import {CustomRequest} from "./interface/custom_request";
import bodyParser from 'body-parser';
import {restRouter} from './modules';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import {Prisma} from '@prisma/client';
import {routeLogger} from './middleware/route_logger';

import {HttpStatusCode, ResponseStatus, createResponse} from "./middleware/response_formatter";

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

// Configure Express to trust specific proxies
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', `*`);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie, D-UUID, S-UUID");
    res.header("access-control-expose-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie, D-UUID, S-UUID");
    next();
});
app.use(express.json());
app.use(cookieParser());

app.use(routeLogger);

//Decrypt data payload
//app.use(decrypter);

//Encrypt response payload
//app.use(encrypter);

//Sanitize against no sql injection
//app.use(mongoSanitizer());

//Set security header
app.use(helmet());

//limiting how many request a user can send per 10 mins
const limiter = rateLimit({
    windowMs: 10 * 60 * 100,
    max: 100
});
app.use(limiter);

//prevent http param pollution
app.use(hpp());

app.use('/api/v1', restRouter);

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
    let error: any = new Error('Invalid route');
    error.status = 404;
    next(error);
});

app.use((error: any, req: CustomRequest, res: Response, next: NextFunction) => {
    let message = "";
    let errorCode = HttpStatusCode.StatusBadRequest;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            message = 'Unique constraint violation:' + error.meta?.target;
        } else {
            message = `Prisma error: ${error.meta}`;
        }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        message = 'Unknown error:' + error.message.split("\n").toReversed()[0];
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        message = 'Rust panic:' + error.message.split("\n").toReversed()[0];
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
        message = 'Initialization error:' + error.message.split("\n").toReversed()[0];
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        message = 'Validation error:' + error.message.split("\n").toReversed()[0];
    } else {
        message = error.message || error;
        errorCode = HttpStatusCode.StatusBadRequest;
    }
    return createResponse(
        res,
        errorCode,
        ResponseStatus.Failure,
        message
    );
});

const PORT = process.env.PORT || 6000;

let server = app.listen(PORT, () => {
    console.info(`App listening ${process.env.NODE_ENV} on port ${PORT}!`);
});