import {AuthService} from "./service";
import {resetPasswordEmailBody, sendMail, signupEmailBody, twoFaEmailBody,} from "../../config/email";
import {genOtpToken} from "../../config/genOTPToken";
import {isPassword} from "../../config/isPassword";
import {isEmail} from "../../config/isEmail";
import {isPhone} from "../../config/isPhone";
import bcriptjs from "bcryptjs";
import {Response} from "express";
import {CustomRequest} from "../../interface/custom_request";
import {authenticate} from "../../middleware/auth";
import moment from "moment";
import crypto from "crypto";

import {extractValues, padTo2Digits, sendSms} from "../../config/util";

import {createResponse, HttpStatusCode, ResponseStatus,} from "../../middleware/response_formatter";
import {configData} from "../../config/env_config";
import {UserType} from "@prisma/client";
import {StoreService} from "../store/service";
import {Permissions} from "../../middleware/permission";
import {ProductService} from "../products/service";

const {
    NODE_ENV,
    APP_NAME,
    LOGIN_FAILED_LIMIT,
    TEMPORARY_BLOCKAGE_TIME,
} = configData;

export default {
    async signupUser(req: CustomRequest, res: Response) {
        try {
            const {
                firstName,
                lastName,
                phoneNumber,
                countryCode,
                email,
                profilePicture,
                password,
            } = req.body;
            if (!isEmail(email)) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email`
                );
            }

            if (!isPhone(`${countryCode}${phoneNumber}`)) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid phone number`
                );
            }

            const emailExist = await AuthService.getUserByEmail(email.toLowerCase());
            if (emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Email already exists`
                );
            }

            const phoneExist = await AuthService.getUserByPhone(
                phoneNumber,
                countryCode
            );
            if (phoneExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Phone number already exists`
                );
            }

            const checkPassword = isPassword(password);

            if (!checkPassword) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Password must contain at least 8 characters with a minimum of one lowercase character, one uppercase character, one special character and one digit.`
                );
            }

            //HASHING THE password with bcryptjs
            const salt = await bcriptjs.genSalt(10);
            const hashedPassword = await bcriptjs.hash(password, salt);

            const otp = genOtpToken(6);
            const now = new Date();
            const otpExpire = new Date(now.getTime() + 10 * 60 * 1000);

            let newUser: any = {
                firstName,
                lastName,
                email: email.toLowerCase(),
                phoneNumber,
                countryCode,
                password: hashedPassword,
                otpCode: otp,
                otpExpirationTime: otpExpire,
                ...profilePicture && {profilePicture},
            };

            const createUser = await AuthService.createUser(newUser);

            const min = otpExpire.getMinutes();
            const hour = otpExpire.getHours();

            const emailBody = await signupEmailBody(firstName, otp);

            await sendMail(
                emailBody,
                email,
                `${APP_NAME} - OTP Verification`
            );

            //await sendSms(otpMessage, `${countryCode}${phoneNumber}`);

            const response = await generateToken(
                req,
                createUser,
                `Account created, a 6 digits code has been sent to ${email}`,
                false
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async createStoreUser(req: CustomRequest, res: Response) {
        try {
            const {
                firstName,
                lastName,
                phoneNumber,
                countryCode,
                email,
                profilePicture,
                staffCode,
                password,
                roleId,
                branchId,
            } = req.body;
            if (!isEmail(email)) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email`
                );
            }

            if (!isPhone(`${countryCode}${phoneNumber}`)) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid phone number`
                );
            }

            const staffCodeExist = await AuthService.getUserByCodeAndStoreId(staffCode, BigInt(req.store.id));
            if (staffCodeExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `This staff code has already been assigned to a different staff!!!`
                );
            }

            const emailExist = await AuthService.getUserByEmail(email.toLowerCase());
            if (emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Email already exists`
                );
            }

            const phoneExist = await AuthService.getUserByPhone(
                phoneNumber,
                countryCode
            );
            if (phoneExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Phone number already exists`
                );
            }

            const checkPassword = isPassword(password);

            if (!checkPassword) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Password must contain at least 8 characters with a minimum of one lowercase character, one uppercase character, one special character and one digit.`
                );
            }

            //HASHING THE password with bcryptjs
            const salt = await bcriptjs.genSalt(10);
            const hashedPassword = await bcriptjs.hash(password, salt);

            const otp = genOtpToken(6);
            const now = new Date();
            const otpExpire = new Date(now.getTime() + 10 * 60 * 1000);

            let newUser: any = {
                firstName,
                lastName,
                email: email.toLowerCase(),
                phoneNumber,
                countryCode,
                password: hashedPassword,
                otpCode: otp,
                userType: "worker" as UserType,
                otpExpirationTime: otpExpire,
                ...profilePicture && {profilePicture},
            };

            const branchExist = await StoreService.singleStoreBranch(BigInt(branchId));
            if (!branchExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Branch does not exist!!!`
                );
            }

            const roleExist = await StoreService.singleStoreRole(BigInt(roleId));
            if (!roleExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `Roles does not exist!!!`
                );
            }

            const createUser = await AuthService.createUser(newUser);

            let query = {
                roleId: BigInt(roleId),
                storeBranchId: BigInt(branchId),
                userId: BigInt(createUser.id),
                storeId: BigInt(req.store.id),
                staffCode: staffCode
            }

            const result = await StoreService.createWorker(query);

            const min = otpExpire.getMinutes();
            const hour = otpExpire.getHours();

            const emailBody = await signupEmailBody(firstName, otp);

            await sendMail(
                emailBody,
                email,
                `${APP_NAME} - OTP Verification`
            );

            //await sendSms(otpMessage, `${countryCode}${phoneNumber}`);

            const response = await generateToken(
                req,
                createUser,
                `Account created, a 6 digits code has been sent to ${email}`,
                false
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async requestOtp(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(phoneNumber, countryCode);
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            const otp = genOtpToken(6);
            const now = new Date();
            const otpExpire = new Date(now.getTime() + 10 * 60 * 1000);

            let query: any = {
                otpCode: otp,
                otpExpirationTime: otpExpire,
            };

            const updatedUser = await AuthService.updateUser(query, emailExist.id);

            const min = otpExpire.getMinutes();
            const hour = otpExpire.getHours();

            let otpMessage = `Your account has been created on ${APP_NAME}, Your 6-digit code is ${otp}. Expires in ${padTo2Digits(
                hour
            )}:${padTo2Digits(min)}.`;

            if (isValidEmail) {
                const emailBody = await signupEmailBody(emailExist.firstName, otp);
                await sendMail(
                    emailBody,
                    emailExist.email,
                    `${APP_NAME} - OTP Verification`
                );
            } else {
                await sendSms(otpMessage, `${emailOrPhone}`);
            }

            const response = await generateToken(
                req,
                updatedUser,
                `A 6 digits code has been sent to ${emailOrPhone}`,
                isValidPhone
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async verifyOtp(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone, otpCode} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode,
                );
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (emailExist.otpCode !== otpCode) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid OTP!!!`
                );
            }
            const now: Date = new Date();
            if (emailExist.otpExpirationTime < now) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `OTP Expired, Please request a new OTP!!!`
                );
            }

            let query: any = {
                ...(isValidEmail && {
                    isEmailVerified: true,
                }),
                ...(isValidPhone && {
                    isPhoneVerified: true,
                }),
            };

            const singleUser = await AuthService.updateUser(query, emailExist.id);

            const response = await generateToken(
                req,
                singleUser,
                `${emailOrPhone} Verified!!!`,
                isValidPhone
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async deleteAccount(req: CustomRequest, res: Response) {
        try {
            const authUser = req.user;
            const {password} = req.body;

            const userExist: any = await AuthService.getUserByEmail(authUser.email);

            if (!userExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User does not exist!!!`
                );
            }

            if (userExist.id !== req.user.id) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusForbidden,
                    ResponseStatus.Error,
                    `Permission denied!!!`
                );
            }

            const confirmedPassword = await bcriptjs.compare(
                password,
                userExist.password
            );

            let query: any = {};
            let loginAttemptCount = userExist.loginAttempt;
            if (!confirmedPassword) {
                loginAttemptCount = loginAttemptCount + 1;
                const attemptLeft = Number(LOGIN_FAILED_LIMIT) - loginAttemptCount;
                query = {loginAttempt: loginAttemptCount};

                if (attemptLeft === 0) {
                    query = {
                        loginAttempt: loginAttemptCount,
                        loginDisabled: true,
                        nextLoginEnableDate: moment().add(
                            Number(TEMPORARY_BLOCKAGE_TIME),
                            "minutes"
                        ),
                    };
                }

                await AuthService.updateUser(query, BigInt(userExist.id));

                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid password, you have ${attemptLeft} attempts left.`
                );
            } else {
                const email = userExist.email;
                const emailArray = email.split("@");
                const newEmail = emailArray[0] + "." + userExist.id + emailArray[1];
                const newPhone = userExist.phoneNumber + "+" + genOtpToken(10);
                query = {
                    email: newEmail,
                    phoneNumber: newPhone,
                    isDeleted: true,
                    accountSuspended: true,
                    loginDisabled: true,
                    loginAttempt: 0,
                    lastLoginDate: new Date(),
                    nextLoginEnableDate: null,
                };

                await AuthService.updateUser(query, authUser.id);

                const response = {
                    message: `Account deleted!!!`,
                    data: {},
                };

                return createResponse(
                    res,
                    HttpStatusCode.StatusCreated,
                    ResponseStatus.Success,
                    response
                );
            }
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async blockAccount(req: CustomRequest, res: Response) {
        try {
            const authUser = req.user;

            let query: any = {
                accountSuspended: true,
                loginDisabled: true,
            };

            await AuthService.updateUser(query, authUser.id);

            const response = {
                message: `Account blocked!!!`,
                data: {},
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async disableStaff(req: CustomRequest, res: Response) {
        try {
            const {userId} = req.body;

            const userExist = await AuthService.getSingleUser(BigInt(userId));
            if (!userExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `This user does not exists!!!`
                );
            }

            const userWorksHere = await StoreService.getBranchUserUserWorks(BigInt(req.store.id), BigInt(userId));
            if (!userWorksHere) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `This user does not work at ${req.store.name}.`
                );
            }

            let query: any = {
                accountSuspended: !userExist.accountSuspended,
                loginDisabled: !userExist.loginDisabled,
            };

            await AuthService.updateUser(query, BigInt(userId));

            const response = {
                message: `Account status updated!!!`,
                data: {},
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async unblockAccount(req: CustomRequest, res: Response) {
        try {
            const {id} = req.params;
            const userExist = await AuthService.getSingleUser(BigInt(id));
            if (!userExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User does not exist!!!`
                );
            }

            let query: any = {
                accountSuspended: false,
                loginDisabled: false,
            };

            const updatedUser = await AuthService.updateUser(query, BigInt(id));

            const response = {
                message: `Account unblocked!!!`,
                data: {},
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async updateUser(req: CustomRequest, res: Response) {
        try {
            const {
                firstName,
                lastName,
                phoneNumber,
                countryCode,
                email,
                profilePicture,
                receiveNewsLetter,
                receiveNotification,
            } = req.body;

            const authUser = req.user;
            if (phoneNumber && authUser.isPhoneVerified) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You cannot update your phone number once it is verified.`
                );
            } else if (phoneNumber) {
                if (!isPhone(`${countryCode}${phoneNumber}`)) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Invalid phone number`
                    );
                }

                const phoneExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode
                );
                if (phoneExist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Phone number already exists`
                    );
                }
            }

            if (email && authUser.isEmailVerified) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You cannot update your email once it is verified.`
                );
            } else if (email) {
                if (!isEmail(email)) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Invalid email`
                    );
                }

                const emailExist = await AuthService.getUserByEmail(
                    email.toLowerCase()
                );
                if (emailExist) {
                    return createResponse(
                        res,
                        HttpStatusCode.StatusBadRequest,
                        ResponseStatus.Error,
                        `Email already exists`
                    );
                }
            }

            let query: any = {
                ...(firstName && {firstName}),
                ...(lastName && {lastName}),
                ...(email && {email: email.toLowerCase()}),
                ...(phoneNumber && {phoneNumber}),
                ...(countryCode && {countryCode}),
                ...(profilePicture && {profilePicture}),
                ...((receiveNewsLetter === true || receiveNewsLetter === false) && {
                    receiveNewsLetter,
                }),
                ...((receiveNotification === true || receiveNotification === false) && {
                    receiveNotification,
                }),
            };

            const updatedUser = await AuthService.updateUser(query, authUser.id);

            const response = await generateToken(
                req,
                updatedUser,
                `Account Updated!!!`,
                true
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async enableTwoFaVerification(req: CustomRequest, res: Response) {
        try {
            const authUser = req.user;
            const {password} = req.body;

            const emailExist = await AuthService.getUserByEmail(authUser.email);
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (!emailExist.password) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You don't have a password set for your account`
                );
            }

            const confirmedPassword = await bcriptjs.compare(
                password,
                emailExist.password
            );

            let query: any = {};
            let loginAttemptCount = emailExist.loginAttempt;
            if (!confirmedPassword) {
                loginAttemptCount = loginAttemptCount + 1;
                const attemptLeft = Number(LOGIN_FAILED_LIMIT) - loginAttemptCount;
                query = {loginAttempt: loginAttemptCount};

                if (attemptLeft === 0) {
                    query = {
                        loginAttempt: loginAttemptCount,
                        loginDisabled: true,
                        nextLoginEnableDate: moment().add(
                            Number(TEMPORARY_BLOCKAGE_TIME),
                            "minutes"
                        ),
                    };
                }

                await AuthService.updateUser(query, emailExist.id);

                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid password, you have ${attemptLeft} attempts left.`
                );
            }
            query = {
                loginAttempt: 0,
                lastLoginDate: new Date(),
                nextLoginEnableDate: null,
                enableTwoFa: true
            };

            await AuthService.updateUser(query, authUser.id);

            const response = {
                message: `Two factor authentication enabled!!!`,
                data: null
            }

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async disableTwoFaVerification(req: CustomRequest, res: Response) {
        try {
            const authUser = req.user;
            const {password} = req.body;

            const emailExist = await AuthService.getUserByEmail(authUser.email);
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (!emailExist.password) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You don't have a password set for your account`
                );
            }

            const confirmedPassword = await bcriptjs.compare(
                password,
                emailExist.password
            );

            let query: any = {};
            let loginAttemptCount = emailExist.loginAttempt;
            if (!confirmedPassword) {
                loginAttemptCount = loginAttemptCount + 1;
                const attemptLeft = Number(LOGIN_FAILED_LIMIT) - loginAttemptCount;
                query = {loginAttempt: loginAttemptCount};

                if (attemptLeft === 0) {
                    query = {
                        loginAttempt: loginAttemptCount,
                        loginDisabled: true,
                        nextLoginEnableDate: moment().add(
                            Number(TEMPORARY_BLOCKAGE_TIME),
                            "minutes"
                        ),
                    };
                }

                await AuthService.updateUser(query, emailExist.id);

                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid password, you have ${attemptLeft} attempts left.`
                );
            }
            query = {
                loginAttempt: 0,
                lastLoginDate: new Date(),
                nextLoginEnableDate: null,
                enableTwoFa: false
            };

            await AuthService.updateUser(query, authUser.id);

            const response = {
                message: `Two factor authentication disabled!!!`,
                data: null
            }

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async verifyTwoFaOtp(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone, otpCode} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode,
                );
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (emailExist.otpCode !== otpCode) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid OTP!!!`
                );
            }
            const now: Date = new Date();
            if (emailExist.otpExpirationTime < now) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `OTP Expired, Please request a new OTP!!!`
                );
            }

            const singleUser = await AuthService.getSingleUser(BigInt(emailExist.id));

            const response = await generateToken(
                req,
                singleUser,
                `Login Verified!!!`,
                false
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async getUsers(req: CustomRequest, res: Response) {
        try {
            const {search, role} = req.query;

            const page: number = Number(req.query.page ?? 1);
            const limit: number = Number(req.query.limit ?? 10);
            const startDate: any = req.query.startDate;
            const endDate: any = req.query.endDate;

            let searchQuery: any;

            if (startDate || endDate) {
                const date = endDate ? new Date(endDate) : new Date();
                const dateEnd = new Date(date.setDate(date.getDate()));
                dateEnd.setHours(23, 59, 59, 999);
                const date2 = startDate ? new Date(startDate) : new Date("2000-06-12");
                const dateStart = new Date(date2.setDate(date2.getDate() - 1));
                dateStart.setHours(23, 59, 59, 999);
                searchQuery = {
                    createdAt: {
                        gte: dateStart,
                        lte: dateEnd,
                    },
                };
            }

            if (search) {
                searchQuery = {
                    OR: [
                        {firstName: {contains: search, mode: "insensitive"}},
                        {lastName: {contains: search, mode: "insensitive"}},
                        {email: {contains: search, mode: "insensitive"}},
                        {phoneNumber: {contains: search, mode: "insensitive"}},
                    ],
                };
            }

            const users = await AuthService.allUsers(searchQuery, page, limit);

            const response = {
                message: `Users fetched!!!`,
                data: users,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusOk,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async loginUser(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone, password, deviceToken} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode,
                );
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (emailExist.isDeleted) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User does not exists!!!`
                );
            }

            const hasExpired =
                moment().format("YYYY-MM-DD H:m:s") >
                moment(emailExist.nextLoginEnableDate).format("YYYY-MM-DD H:m:s");

            if (emailExist.loginDisabled && !hasExpired) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `Your account is temporarily disabled due to multiple incorrect login attempts. Try again in ${moment(emailExist.nextLoginEnableDate).format("YYYY-MM-DD H:m:s")}`
                );
            }

            if (!emailExist.accountEnabled) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Your account has been disabled.`
                );
            }

            if (emailExist.requestDelete) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You requested to delete your account, you can no longer access your account until our admin responds to your request.`
                );
            }

            if (emailExist.accountSuspended) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Your account has been suspended by ${APP_NAME}, please contact customer care for support.`
                );
            }

            if (!emailExist.password) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You don't have a password set for your account`
                );
            }

            const confirmedPassword = await bcriptjs.compare(
                password,
                emailExist.password
            );

            let query: any = {};
            let loginAttemptCount = emailExist.loginAttempt;
            if (!confirmedPassword) {
                loginAttemptCount = loginAttemptCount + 1;
                const attemptLeft = Number(LOGIN_FAILED_LIMIT) - loginAttemptCount;
                query = {loginAttempt: loginAttemptCount};

                if (attemptLeft === 0) {
                    query = {
                        loginAttempt: loginAttemptCount,
                        loginDisabled: true,
                        nextLoginEnableDate: moment().add(
                            Number(TEMPORARY_BLOCKAGE_TIME),
                            "minutes"
                        ),
                    };
                }

                await AuthService.updateUser(query, emailExist.id);

                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid login credentials, you have ${attemptLeft} attempts left.`
                );
            } else {
                query = {
                    loginAttempt: 0,
                    lastLoginDate: new Date(),
                    nextLoginEnableDate: null,
                };
                if (deviceToken) query.firebaseToken = deviceToken;

                const singleUser = await AuthService.updateUser(query, emailExist.id);

                const response = await generateToken(
                    req,
                    singleUser,
                    "Login successful",
                    isValidPhone
                );

                if (singleUser.enableTwoFa) {
                    const otp = genOtpToken(6);
                    const now = new Date();
                    const otpExpire = new Date(now.getTime() + 10 * 60 * 1000);

                    let query: any = {
                        otpCode: otp,
                        otpExpirationTime: otpExpire,
                    };

                    const updatedUser = await AuthService.updateUser(query, emailExist.id);

                    const min = otpExpire.getMinutes();
                    const hour = otpExpire.getHours();

                    let otpMessage = `Your attempted to log in on ${APP_NAME}, Your 6-digit code is ${otp}. Expires in ${padTo2Digits(
                        hour
                    )}:${padTo2Digits(min)}.`;

                    if (isValidEmail) {
                        const emailBody = await twoFaEmailBody(emailExist.firstName, otp);
                        await sendMail(
                            emailBody,
                            emailExist.email,
                            `${APP_NAME} - Two-FA Verification`
                        );
                    } else {
                        await sendSms(otpMessage, `${emailOrPhone}`);
                    }
                    if (response) {
                        response.data.refreshToken = null;
                        response.data.token = null;
                        response.message = `An OTP has been sent to your ${isValidEmail ? 'Email' : 'Phone number'}`
                    }
                }

                return createResponse(
                    res,
                    HttpStatusCode.StatusCreated,
                    ResponseStatus.Success,
                    response
                );
            }
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async loginWithStaffCode(req: CustomRequest, res: Response) {
        try {
            const {staffCode, storeId} = req.body;

            const userExist = await AuthService.getUserByCodeAndStoreId(
                staffCode, BigInt(storeId),
            );
            if (!userExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (userExist.user.isDeleted) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User does not exists!!!`
                );
            }

            const hasExpired =
                moment().format("YYYY-MM-DD H:m:s") >
                moment(userExist.user.nextLoginEnableDate).format("YYYY-MM-DD H:m:s");

            if (userExist.user.loginDisabled && !hasExpired) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `Your account is temporarily disabled due to multiple incorrect login attempts. Try again in ${moment(userExist.user.nextLoginEnableDate).format("YYYY-MM-DD H:m:s")}`
                );
            }

            if (!userExist.user.accountEnabled) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Your account has been disabled.`
                );
            }

            if (userExist.user.requestDelete) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You requested to delete your account, you can no longer access your account until our admin responds to your request.`
                );
            }

            if (userExist.user.accountSuspended) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Your account has been suspended by ${APP_NAME}, please contact customer care for support.`
                );
            }

            let query: any = {};
            let loginAttemptCount = userExist.user.loginAttempt;
            query = {
                loginAttempt: 0,
                lastLoginDate: new Date(),
                nextLoginEnableDate: null,
            };

            const singleUser = await AuthService.updateUser(query, userExist.user.id);

            const response = await generateToken(
                req,
                singleUser,
                "Login successful",
                false
            );

            if (singleUser.enableTwoFa) {
                const otp = genOtpToken(6);
                const now = new Date();
                const otpExpire = new Date(now.getTime() + 10 * 60 * 1000);

                let query: any = {
                    otpCode: otp,
                    otpExpirationTime: otpExpire,
                };

                const updatedUser = await AuthService.updateUser(query, userExist.user.id);

                const min = otpExpire.getMinutes();
                const hour = otpExpire.getHours();

                let otpMessage = `Your attempted to log in on ${APP_NAME}, Your 6-digit code is ${otp}. Expires in ${padTo2Digits(
                    hour
                )}:${padTo2Digits(min)}.`;
                const emailBody = await twoFaEmailBody(userExist.user.firstName, otp);
                await sendMail(
                    emailBody,
                    userExist.user.email,
                    `${APP_NAME} - Two-FA Verification`
                );

                if (response) {
                    response.data.refreshToken = null;
                    response.data.token = null;
                    response.message = `An OTP has been sent to your Email`
                }
            }

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async resetPassword(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(phoneNumber, countryCode);
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            const otp = genOtpToken(6);
            const now = new Date();
            const otpExpire = new Date(now.getTime() + 10 * 60 * 1000);

            let query: any = {
                otpCode: otp,
                otpExpirationTime: otpExpire,
            };

            const updatedUser = await AuthService.updateUser(query, emailExist.id);

            const min = otpExpire.getMinutes();
            const hour = otpExpire.getHours();

            let otpMessage = `Your account has been created on ${APP_NAME}, Your 6-digit code is ${otp}. Expires in ${padTo2Digits(
                hour
            )}:${padTo2Digits(min)}.`;

            if (isValidEmail) {
                const emailBody = await resetPasswordEmailBody(
                    emailExist.firstName,
                    otp
                );
                await sendMail(
                    emailBody,
                    emailExist.email,
                    `${APP_NAME} - OTP Verification`
                );
            } else {
                await sendSms(otpMessage, `${emailOrPhone}`);
            }

            const response = {
                message: "OTP Sent!!!",
                data: {},
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async verifyResetPassword(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone, otpCode} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode
                );
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (emailExist.otpCode !== otpCode) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid OTP!!!`
                );
            }
            const now: Date = new Date();
            if (emailExist.otpExpirationTime < now) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `OTP Expired, Please request a new OTP!!!`
                );
            }

            let query: any = {
                resetPasswordCheckCompleted: true,
            };

            const updatedUser = await AuthService.updateUser(query, emailExist.id);

            const response = {
                message: "OTP Verified!!!",
                data: updatedUser,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async setResetPasswordWithOtp(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone, otpCode, password} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode
                );
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (emailExist.otpCode !== otpCode) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid OTP!!!`
                );
            }
            const now: Date = new Date();
            if (emailExist.otpExpirationTime < now) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `OTP Expired, Please request a new OTP!!!`
                );
            }

            if (!isPassword(password)) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid password!!!`
                );
            }

            //HASHING THE password with bcryptjs
            const salt = await bcriptjs.genSalt(10);
            const hashedPassword = await bcriptjs.hash(password, salt);

            let query: any = {
                password: hashedPassword,
                resetPasswordCheckCompleted: false,
            };

            const updatedUser = await AuthService.updateUser(query, emailExist.id);

            const response = {
                message: "Password reset completed!!!",
                data: updatedUser,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async completeResetPassword(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone, password} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode
                );
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User does not exists`
                );
            }

            //HASHING THE password with bcryptjs
            const salt = await bcriptjs.genSalt(10);
            const hashedPassword = await bcriptjs.hash(password, salt);
            const query = {
                password: hashedPassword,
                resetPasswordCheckCompleted: false,
            };

            if (!emailExist.resetPasswordCheckCompleted) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You have not verified your reset password OTP.`
                );
            }

            const updatedUser = await AuthService.updateUser(query, emailExist.id);

            const response = await generateToken(
                req,
                updatedUser,
                "Your password has been updated!!!",
                isValidPhone
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async changePassword(req: CustomRequest, res: Response) {
        try {
            const {oldPassword, newPassword, passwordHint} = req.body;
            let emailExist = await AuthService.getUserByEmail(
                req.user.email.toLowerCase()
            );

            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (!emailExist.password) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User does not have a password, please use reset password option`
                );
            }

            const password = await bcriptjs.compare(oldPassword, emailExist.password);

            if (!password) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Incorrect old password`
                );
            }

            //HASHING THE password with bcryptjs
            const salt = await bcriptjs.genSalt(10);
            const hashedPassword = await bcriptjs.hash(newPassword, salt);
            const query = {
                password: hashedPassword,
                passwordHint: passwordHint,
                resetPasswordCheckCompleted: false,
            };

            const updatedUser = await AuthService.updateUser(query, BigInt(emailExist.id));

            const response = await generateToken(
                req,
                updatedUser,
                "Your password has been updated!!!",
                true
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async refreshAuthToken(req: CustomRequest, res: Response) {
        try {
            const {emailOrPhone, refreshToken} = req.body;
            const isValidEmail: boolean = isEmail(emailOrPhone);
            const isValidPhone: boolean = isPhone(emailOrPhone);
            if (!isValidEmail && !isValidPhone) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Invalid email or phone number`
                );
            }

            let emailExist: any;
            if (isValidEmail) {
                emailExist = await AuthService.getUserByEmail(
                    emailOrPhone.toLowerCase()
                );
            } else {
                // Split the string into two parts: first 4 characters and the rest
                const [countryCode, phoneNumber] = [
                    emailOrPhone.slice(0, 4),
                    emailOrPhone.slice(4),
                ];
                emailExist = await AuthService.getUserByPhone(
                    phoneNumber,
                    countryCode
                );
            }
            if (!emailExist) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusNotFound,
                    ResponseStatus.Error,
                    `User not found!!!`
                );
            }

            if (emailExist.isDeleted) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User does not exists!!!`
                );
            }

            const hasExpired =
                moment().format("YYYY-MM-DD H:m:s") >
                moment(emailExist.nextLoginEnableDate).format("YYYY-MM-DD H:m:s");

            if (emailExist.loginDisabled && !hasExpired) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Failure,
                    `Your account is temporarily disabled due to multiple incorrect login attempts. Try again in ${hasExpired}`
                );
            }

            if (!emailExist.accountEnabled) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Your account has been disabled.`
                );
            }

            if (emailExist.requestDelete) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `You requested to delete your account, you can no longer access your account until our admin responds to your request.`
                );
            }

            if (emailExist.accountSuspended) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `Your account has been suspended by ${APP_NAME}, please contact customer care for support.`
                );
            }

            const device = await AuthService.getSingleDevice(req.device.deviceUniqueId);

            if (!device || device.refreshToken !== refreshToken) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusUnauthorized,
                    ResponseStatus.Error,
                    `Invalid refresh token.`
                );
            }

            const singleUser = await AuthService.getSingleUser(emailExist.id);
            const response = await generateToken(
                req,
                singleUser,
                "Token Refreshed!!!",
                isValidPhone
            );

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

    async getUser(req: CustomRequest, res: Response) {
        try {
            const {id} = req.params;

            const user = await AuthService.getSingleUser(BigInt(id));
            if (!user) {
                return createResponse(
                    res,
                    HttpStatusCode.StatusBadRequest,
                    ResponseStatus.Error,
                    `User not found`
                );
            }

            const response = {
                message: "User fetched!!!",
                data: user,
            };

            return createResponse(
                res,
                HttpStatusCode.StatusCreated,
                ResponseStatus.Success,
                response
            );
        } catch (err: any) {
            return createResponse(
                res,
                HttpStatusCode.StatusBadRequest,
                ResponseStatus.Error,
                `${err.message}`
            );
        }
    },

};

async function generateToken(
    req: CustomRequest,
    currentUser: any,
    message: string,
    isPhone: boolean = false
) {
    const device = await AuthService.getSingleDevice(req.device.deviceUniqueId);
    if (!device) {
        await AuthService.addDevice({
            name: req.device.name,
            deviceUniqueId: req.device.deviceUniqueId,
            deviceIp: req.device.deviceIp,
            userId: currentUser.id,
        })
    }

    const token = await authenticate(currentUser);
    const refreshToken = crypto.randomBytes(32).toString("hex");
    let query = {token, refreshToken};
    await AuthService.updateDeviceToken(query, req.device.deviceUniqueId);

    const user = await AuthService.getSingleUser(BigInt(currentUser.id));

    if (!user) return null;

    let role: any = {
        role: String,
        permission: [],
    }

    if (user.userType === "storeOwner") {
        role.permission = extractValues(Permissions.SuperAdmin);
        role.role = "Admin"
    } else {
        for (let i = 0; i < user.storeWorkers.length; i++) {
            let p = user.storeWorkers[i];
            role.role = p.storeProfileRole.title;
            p.storeProfileRole.permissions.split(",").map((perm) => role.permission.push(perm.trim()));
        }
    }

    let staffId = "";
    if (user.storeWorkers.length > 0) {
        for (let i = 0; i < user.storeWorkers.length; i++) {
            staffId = user.storeWorkers[i].staffCode;
        }
    }

    const check =
        (isPhone && user.isPhoneVerified === true) ||
        (!isPhone && user.isEmailVerified === true);
    return {
        message: message || "Your login was successful.",
        data: {
            user: {
                id: String(user.id),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                staffCode: staffId,
                phoneNumber: user.phoneNumber,
                countryCode: user.countryCode,
                isPhoneVerified: user.isPhoneVerified,
                isEmailVerified: user.isEmailVerified,
                profilePicture: user.profilePicture,
                passwordHint: user.passwordHint,
                userType: user.userType,
                enableTwoFa: user.enableTwoFa,
                receiveNewsLetter: user.receiveNewsLetter,
                receiveNotification: user.receiveNotification,
                resetPasswordCheckCompleted: user.resetPasswordCheckCompleted,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                ownerStore: user.ownedStores,
                worksIn: user.storeWorkers,
                roles: role,
            },
            token: check ? token : null,
            refreshToken: check ? refreshToken : null,
        },
    };
}
