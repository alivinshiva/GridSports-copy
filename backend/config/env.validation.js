import dotenv from "dotenv";
dotenv.config();

// Validate that all required environment variables are present
export const validateEnv = () => {
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
    }

    if (!process.env.ALLOWED_ORIGINS) {
        process.env.ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176';
    }

    const requiredEnvVars = [
        'PORT',
        'MONGO_URI',
        'JWT_TOKEN',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_PHONE_NUMBER'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease check your .env file and ensure all required variables are set.');
        process.exit(1);
    }

    // Keep this as console.log since logger might not be initialized yet
    console.log('✅ All required environment variables are present');
};
