// Shared constants across the application

// Bcrypt configuration
export const SALT_ROUNDS = 10;

// Tribe names
export const TRIBE_NAMES = [
    "ORANGE TRIBE",
    "SCARLET TRIBE",
    "AZURE TRIBE",
    "SILVER TRIBE",
    "GREEN TRIBE",
    "BLUE TRIBE",
    "PINK TRIBE",
    "WHITE TRIBE",
    "CARBON TRIBE",
    "GRAPHITE TRIBE",
    "ONYX TRIBE"
];

// Cookie configuration
export const COOKIE_NAME = "TrIWOoeGridSports";
export const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

// JWT configuration
export const JWT_EXPIRES_IN = "30d";

// OTP configuration
export const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
export const OTP_LENGTH = 4;
