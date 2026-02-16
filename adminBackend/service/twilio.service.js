// Twilio SMS Service (Mock implementation)
// In production, integrate with Twilio API

export const sendPhoneVerificationOtp = async (phoneNumber, name, otp) => {
    try {
        console.log(`Sending OTP ${otp} to ${phoneNumber} for user ${name}`);
        // In production: use Twilio client to send SMS
        // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // await client.messages.create({
        //   body: `Your GridSports verification code is: ${otp}`,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   to: phoneNumber
        // });
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};

export const sendPhoneForgotOtp = async (phoneNumber, otp) => {
    try {
        console.log(`Sending forgot password OTP ${otp} to ${phoneNumber}`);
        // In production: use Twilio client to send SMS
        return true;
    } catch (error) {
        console.error("Error sending forgot password OTP:", error);
        throw error;
    }
};
