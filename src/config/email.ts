import {configData} from "../config/env_config";

const {
    SENDGRID_API_KEY, SENDGRID_EMAIL_FROM, SENDGRID_SENDER_NAME, APP_NAME
} = configData;

import sgMail from '@sendgrid/mail';
import {responseLogger} from "../middleware/logger";

const sendMail = async (
    htmlContent: string,
    to: string,
    subject: string,
) => {
    sgMail.setApiKey(SENDGRID_API_KEY ?? '');
    const sendgridSenderEmail = SENDGRID_EMAIL_FROM ?? '';
    const msg = {
        to: [to, sendgridSenderEmail], // recipient email address
        from: sendgridSenderEmail, // verified sender email address
        subject,
        html: htmlContent, // email content in HTML format
    };

    try {
        responseLogger().info(`Send email from ${sendgridSenderEmail} to ${to}`);
        await sgMail.send(msg);
        responseLogger().info(
            `Send email response from ${sendgridSenderEmail} to ${to}: Email sent successfully`,
        );
        return {
            status: true,
            message: `Send email response from ${sendgridSenderEmail} to ${to}: Email sent successfully`,
        };
    } catch (error: any) {
        const message = `Error sending email: ${
            error.response?.body
                ? error.response?.body.errors[0].message
                : error.message
        }`;

        responseLogger().error(message);
        return {
            status: false,
            message,
        };
    }
};

const signupEmailBody = async (firstname: string, otp: string) => {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta name="description" content="">
                <meta name="author" content="">
                <title>OTP Verification</title>
            </head>
    
            <body style="max-width: 600px;margin: 10px auto;padding: 70px;border: 1px solid #ccc;background: #ffffff;color: #4e4e4e;">
                <div>
                    <div>Dear ${firstname},</div>
                    <br>
                    <div>
                    <p>Your account has been created on ${APP_NAME}, please use the ${otp.length} digits from this email as your OTP.</p>
                    <p>Your OTP Code is <b>${otp}</b></p>
                    <p> cheers to serving you the more </p>
                    </div>
                    <p style="margin-bottom: 2em;line-height: 26px;font-size: 14px;">
                        Best Regards, <br>
                        From all of us at ${APP_NAME}
                    </p>
                </div>
            </body>
            </html>
        `;
};

const twoFaEmailBody = async (firstname: string, otp: string) => {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta name="description" content="">
                <meta name="author" content="">
                <title>OTP Verification</title>
            </head>
    
            <body style="max-width: 600px;margin: 10px auto;padding: 70px;border: 1px solid #ccc;background: #ffffff;color: #4e4e4e;">
                <div>
                    <div>Dear ${firstname},</div>
                    <br>
                    <div>
                    <p>You attempted to login on ${APP_NAME}, please use the ${otp.length} digits from this email as your OTP.</p>
                    <p>Your OTP Code is <b>${otp}</b></p>
                    <p> cheers to serving you the more </p>
                    </div>
                    <p style="margin-bottom: 2em;line-height: 26px;font-size: 14px;">
                        Best Regards, <br>
                        From all of us at ${APP_NAME}
                    </p>
                </div>
            </body>
            </html>
        `;
};

const resetPasswordEmailBody = async (firstname: string, otp: string) => {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta name="description" content="">
                <meta name="author" content="">
                <title>Reset Password</title>
            </head>
    
            <body style="max-width: 600px;margin: 10px auto;padding: 70px;border: 1px solid #ccc;background: #ffffff;color: #4e4e4e;">
                <div>
                    <div>Dear ${firstname},</div>
                    <br>
                    <div>
                    <p>You have requested to reset your password on ${APP_NAME}, please use the ${otp.length} digits from this email as the first ${otp.length} digits of your OTP.</p>
                    <p>Your OTP Code is <b>${otp}</b></p>
                    <p> cheers to serving you the more </p>
                    </div>
                    <p style="margin-bottom: 2em;line-height: 26px;font-size: 14px;">
                        Best Regards, <br>
                        From all of us at ${APP_NAME}
                    </p>
                </div>
            </body>
            </html>
        `;
};

const customerblockEmailBody = async (firstname: string, title: string) => {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta name="description" content="">
                <meta name="author" content="">
                <title>${title}</title>
            </head>
    
            <body style="max-width: 600px;margin: 10px auto;padding: 70px;border: 1px solid #ccc;background: #ffffff;color: #4e4e4e;">
                <div>
                    <div>Dear ${firstname},</div>
                    <br>
                    <div>
                    <p>Your access to the ${APP_NAME} has currently been blocked. </p>
                    </div>
                    <p style="margin-bottom: 2em;line-height: 26px;font-size: 14px;">
                        Best Regards, <br>
                        From all of us at ${APP_NAME}
                    </p>
                </div>
            </body>
            </html>
        `;
};
export {
    sendMail,
    signupEmailBody,
    resetPasswordEmailBody,
    customerblockEmailBody,
    twoFaEmailBody
}
