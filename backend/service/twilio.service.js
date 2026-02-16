import { twilioClient } from "../config/twilio.config.js";


// verification code for signup user
export const sendPhoneVerificationOtp = async (phoneNumber, name, code) => {

    if (!phoneNumber) throw new Error("Phone Number is missing");

    if (!name) throw new Error("Name is missing")

    if (!code) throw new Error("Verification code is missing");

    try {
        const message = await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
            body: `${name} your verification code for Grid Sports is ${code} valid only for 10 minutes.`,
        });

        return message;

    } catch (error) {
        throw new Error(error.message);
    };
};


// verification code for forgot password
export const sendPhoneForgotOtp = async (phoneNumber, name, code) => {
    if (!phoneNumber) throw new Error("Phone Number is missing");

    if (!name) throw new Error("Name is missing")

    if (!code) throw new Error("Verification code is missing");

    try {
        const message = await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
            body: `${name} your password reset code for Grid Sports is ${code} valid only for 10 minutes.`
        });

        return message;

    } catch (error) {
        throw new Error(error.message);
    };
};