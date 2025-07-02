import dotenv from 'dotenv';

dotenv.config();

const configData = {
    AUTH_TOKEN_SECRET: process.env.AUTH_TOKEN_SECRET,
    PORT: process.env.PORT,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_EMAIL_FROM: process.env.SENDGRID_EMAIL_FROM,
    SENDGRID_SENDER_NAME: process.env.SENDGRID_SENDER_NAME,
    JWT_ACC_ACTIVATE: process.env.JWT_ACC_ACTIVATE,
    TZ: process.env.TZ,
    APP_URL: process.env.App_URL,
    APP_NAME: process.env.APP_NAME,
    AES_REQ_RES_IV: process.env.AES_REQ_RES_IV,
    RESPONSE_ENCRYPTION_ALGORITHM: process.env.RESPONSE_ENCRYPTION_ALGORITHM,
    ERROR_MESSAGE: "Oops! An error occurred while trying to process your data. Please try again and reach out to our customer service for quick resolution if error persist",
    NODE_ENV: process.env.NODE_ENV,
    DASHBOARD_URL: process.env.DASHBOARD_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRES_IN: process.env.EXPIRES_IN,
    TEMPORARY_BLOCKAGE_TIME: process.env.TEMPORARY_BLOCKAGE_TIME,
    LOGIN_FAILED_LIMIT: process.env.LOGIN_FAILED_LIMIT,
    STORAGE_END_POINT: process.env.DO_SPACES_ENDPOINT,
    DOWNLOAD_SPACES_ENDPOINT: process.env.DOWNLOAD_SPACES_ENDPOINT,
    STORAGE_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
    STORAGE_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    STORAGE_SPACE_NAME: process.env.STORAGE_SPACE_NAME,
    STORAGE_REGION: process.env.STORAGE_REGION,
    DEYWURO_BASE_URL: process.env.DEYWURO_BASE_URL,
    DEYWURO_USERNAME: process.env.DEYWURO_USERNAME,
    DEYWURO_PASSWORD: process.env.DEYWURO_PASSWORD,
    BLUPAY_API: process.env.BLUPAY_API,
    TMS_API: process.env.TMS_API,
};

export {configData};