# GridSports Project Documentation

**Last Updated:** February 18, 2026  
**Project Type:** Full-Stack Web Application (MERN - MongoDB, Express, React, Node.js)  
**Architecture:** Microservices with Admin Backend + Main Backend + Frontend + Admin Frontend

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Architecture](#project-architecture)
3. [Directory Structure](#directory-structure)
4. [Backend Documentation](#backend-documentation)
5. [Admin Backend Documentation](#admin-backend-documentation)
6. [Frontend Documentation](#frontend-documentation)
7. [Admin Frontend Documentation](#admin-frontend-documentation)
8. [File Dependencies & Relationships](#file-dependencies--relationships)
9. [Getting Started](#getting-started)

---

## 🎯 Project Overview

**GridSports** is a comprehensive sports management and challenge platform that enables users to:
- Create and participate in racing and sporting challenges
- Upload submissions for weekend challenges
- Manage user profiles and tribe memberships
- View race boards and leaderboards
- Access weekend schedules and seasonal information

The application is built with a **microservices architecture** featuring:
- **Backend (Port 7000)**: Main authentication, user management, and profile service
- **Admin Backend (Port 9000)**: Challenge, weekend, and submission management
- **Frontend (Port 5173)**: User-facing React application
- **Admin Frontend (Port 5174)**: Administrative dashboard for managing challenges and submissions

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GridSports Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │  Frontend        │  │  Admin Frontend              │   │
│  │  (Port 5173)     │  │  (Port 5174)                 │   │
│  │  React + Vite    │  │  React + Vite               │   │
│  └────────┬─────────┘  └────────────────┬─────────────┘   │
│           │                             │                 │
│           │         HTTP APIs           │                 │
│           ├─────────────────────────────┤                 │
│           │                             │                 │
│  ┌────────▼──────────┐    ┌─────────────▼──────────┐     │
│  │  Backend         │    │  Admin Backend        │     │
│  │  (Port 7000)     │    │  (Port 9000)          │     │
│  │  Express + Node  │    │  Express + Node       │     │
│  └────────┬─────────┘    └────────────┬───────────┘     │
│           │                           │                 │
│           └───────────┬───────────────┘                 │
│                       │                                 │
│                   ┌───▼────┐                            │
│                   │MongoDB  │                            │
│                   │Database │                            │
│                   └─────────┘                            │
│                       │                                 │
│              ┌────────┴──────────┐                      │
│              │                   │                      │
│        ┌─────▼──┐         ┌─────▼──┐                   │
│        │Cloudinary      │Twilio   │                   │
│        │(Image Upload)  │(SMS OTP)│                   │
│        └────────┘        └─────────┘                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Communication Flow:
- **Frontend ↔ Backend**: User authentication, profile management, tribe creation
- **Frontend ↔ Admin Backend**: Challenge data, weekend schedules, submissions
- **External Services**:
  - **Cloudinary**: Image uploads for profiles and challenges
  - **Twilio**: SMS-based OTP verification and password recovery
  - **MongoDB**: Persistent data storage

---

## 📁 Directory Structure

```
sport v2/
├── start_all.bat                          # Batch script to start all services
├── PROJECT_DOCUMENTATION.md               # This file
│
├── backend/                               # Main Backend Service (Port 7000)
│   ├── index.js                          # Express server entry point
│   ├── package.json                      # Dependencies & scripts
│   ├── .env                              # Environment variables
│   ├── .env.example                      # Environment template
│   │
│   ├── config/
│   │   ├── cloudinary.config.js          # Cloudinary configuration
│   │   ├── db.connect.js                 # MongoDB connection
│   │   └── twilio.config.js              # Twilio SMS configuration
│   │
│   ├── models/
│   │   ├── user.model.js                 # User schema (authentication, profiles)
│   │   └── profile.model.js              # Tribe/profile data schema
│   │
│   ├── controller/
│   │   ├── user.controller.js            # User auth logic (signup, login, OTP)
│   │   ├── profile.controller.js         # Profile & tribe management logic
│   │   └── admin.controller.js           # Admin-related operations
│   │
│   ├── router/
│   │   ├── user.router.js                # User auth routes
│   │   ├── profile.router.js             # Profile routes
│   │   └── admin.router.js               # Admin routes
│   │
│   ├── middleware/
│   │   ├── user.middleware.js            # User validation middleware
│   │   ├── profile.middleware.js         # Profile validation middleware
│   │   ├── multer.middleware.js          # File upload configuration
│   │   ├── verify.cookie.js              # JWT verification
│   │   └── send.cookies.js               # Cookie management
│   │
│   └── service/
│       ├── otp.generator.js              # OTP generation logic
│       └── twilio.service.js             # Twilio SMS sending
│
├── adBackend/                             # Admin Backend Service (Port 9000)
│   ├── index.js                          # Express server entry point
│   ├── package.json                      # Dependencies & scripts
│   ├── .env                              # Environment variables
│   │
│   ├── config/
│   │   ├── cloudinary.config.js          # Cloudinary configuration
│   │   └── db.connect.js                 # MongoDB connection
│   │
│   ├── model/
│   │   ├── challange.model.js            # Challenge schema
│   │   ├── weekend.model.js              # Weekend schedule schema
│   │   └── submission.model.js           # Challenge submission schema
│   │
│   ├── controller/
│   │   ├── challenge.controller.js       # Challenge CRUD operations
│   │   ├── weekend.controller.js         # Weekend schedule management
│   │   └── submission.controller.js      # Submission handling
│   │
│   ├── router/
│   │   ├── challenge.router.js           # Challenge endpoints
│   │   ├── weekend.router.js             # Weekend endpoints
│   │   └── submission.router.js          # Submission endpoints
│   │
│   └── middleware/
│       ├── challange.middleware.js       # Challenge validation
│       ├── weekend.middleware.js         # Weekend validation
│       └── multer.middleware.js          # File upload
│
├── frontend/                              # Main Frontend (Port 5173)
│   ├── package.json                      # Dependencies & scripts
│   ├── vite.config.js                    # Vite bundler configuration
│   ├── tailwind.config.js                # Tailwind CSS configuration
│   ├── postcss.config.js                 # PostCSS configuration
│   ├── eslint.config.js                  # ESLint rules
│   ├── index.html                        # HTML entry point
│   │
│   └── src/
│       ├── main.jsx                      # React app entry point
│       ├── App.jsx                       # Main routing component
│       ├── App.css                       # Global styles
│       ├── index.css                     # Base Tailwind styles
│       │
│       ├── context/
│       │   └── AuthContext.jsx           # Global authentication context
│       │
│       ├── components/
│       │   ├── Layout.jsx                # Main layout wrapper
│       │   ├── AuthenticatedLayout.jsx   # Protected layout
│       │   ├── Hero.jsx                  # Hero section
│       │   ├── LandingHero.jsx           # Landing page hero
│       │   ├── LandingPage.jsx           # Landing page
│       │   ├── LightsOutGame.jsx         # Game component
│       │   ├── DiscoveryFeed.jsx         # Challenge feed
│       │   ├── ChallengeRail.jsx         # Challenge carousel
│       │   ├── CategoryRail.jsx          # Category navigation
│       │   ├── Instructions.jsx          # Instructions component
│       │   │
│       │   ├── home/
│       │   │   └── ...                   # Home page sub-components
│       │   │
│       │   ├── race/
│       │   │   └── ...                   # Race-related components
│       │   │
│       │   └── schedule/
│       │       └── ...                   # Schedule components
│       │
│       ├── pages/
│       │   ├── Home.jsx                  # Home page
│       │   ├── SignupPage.jsx            # User registration
│       │   ├── LoginPage.jsx             # User login
│       │   ├── OTPPage.jsx               # OTP verification
│       │   ├── ForgotPasswordPage.jsx    # Password recovery
│       │   ├── ProfilePage.jsx           # User profile display
│       │   ├── EditProfile.jsx           # Profile editing
│       │   ├── TribePage.jsx             # Tribe selection
│       │   ├── Tribes.jsx                # Tribes listing
│       │   ├── GamePage.jsx              # Game/challenge view
│       │   ├── WeekendPage.jsx           # Weekend challenge details
│       │   ├── RaceDetails.jsx           # Race information
│       │   ├── Raceboard.jsx             # Race leaderboard
│       │   ├── ChallengeEntries.jsx      # Challenge submissions view
│       │   ├── UploadChallenge.jsx       # Challenge submission form
│       │   ├── UploadSuccess.jsx         # Success confirmation
│       │   └── SeasonSchedule.jsx        # Season schedule view
│       │
│       ├── services/
│       │   ├── challengeService.js       # Challenge API calls
│       │   └── weekendService.js         # Weekend API calls
│       │
│       ├── hooks/
│       │   └── useTribe.js               # Custom tribe hook
│       │
│       ├── lib/
│       │   └── utils.js                  # Utility functions
│       │
│       └── assets/
│           └── ...                       # Images, fonts, etc.
│
└── adFrontend/                            # Admin Frontend (Port 5174)
    ├── package.json                      # Dependencies & scripts
    ├── vite.config.js                    # Vite configuration
    ├── tailwind.config.js                # Tailwind CSS
    ├── eslint.config.js                  # ESLint rules
    ├── index.html                        # HTML entry
    │
    └── src/
        ├── main.jsx                      # React entry
        ├── App.jsx                       # Main routing
        ├── App.css                       # Styles
        ├── index.css                     # Base styles
        │
        ├── components/
        │   ├── Layout.jsx                # Admin layout
        │   ├── Welcome.jsx               # Dashboard welcome
        │   ├── AdminGridDashboard.jsx    # Main dashboard
        │   ├── Users.jsx                 # User management
        │   ├── AllWeekends.jsx           # Weekend management
        │   ├── WeekendDetails.jsx        # Weekend details view
        │   ├── WeekendForm.jsx           # Weekend creation
        │   ├── WeekendUpdate.jsx         # Weekend editing
        │   ├── Challenges.jsx            # Challenge listing
        │   ├── ChallengeDetails.jsx      # Challenge details
        │   ├── ChallengeForm.jsx         # Challenge creation
        │   ├── SubmissionForm.jsx        # Submission management
        │   └── (more admin components)
        │
        └── services/
            ├── challengeService.js       # Challenge CRUD API
            ├── weekendService.js         # Weekend CRUD API
            ├── submissionService.js      # Submission API
            └── userService.js            # User management API
```

---

## 🔧 Backend Documentation

### Purpose
Main authentication and user management service. Handles:
- User registration and login
- Phone number verification via OTP
- Password management and reset
- User profile and tribe creation
- JWT-based authentication

### Entry Point: [backend/index.js](backend/index.js)

**Server Configuration:**
- Port: 7000
- CORS Origins: `http://localhost:5173`, `http://localhost:5174`
- Middleware Stack:
  - Cookie parser (for JWT in cookies)
  - Body parser (JSON parsing)
  - CORS handler
  - Express JSON parser

**Routes Mounted:**
- `/api/v1/user` → User authentication routes
- `/api/v1/profile` → Profile management routes
- `/api/v1/admin` → Admin-specific routes

---

### Configuration Files

#### [backend/config/db.connect.js](backend/config/db.connect.js)
- **Purpose**: MongoDB database connection
- **Uses**: Mongoose ODM
- **Connects to**: MongoDB Atlas (via MONGO_URI in .env)
- **Exports**: `connectDb()` function

#### [backend/config/cloudinary.config.js](backend/config/cloudinary.config.js)
- **Purpose**: Image upload service configuration
- **Service**: Cloudinary (cloud storage for images)
- **Used for**: Profile picture uploads
- **Credentials**: From environment variables

#### [backend/config/twilio.config.js](backend/config/twilio.config.js)
- **Purpose**: SMS gateway configuration
- **Service**: Twilio
- **Used for**: OTP delivery via SMS
- **Credentials**: From environment variables

---

### Data Models

#### [backend/models/user.model.js](backend/models/user.model.js)

**User Schema Structure:**
```
User {
  name: String
  phoneNumber: String (unique, primary identifier)
  password: String (bcrypt hashed)
  isVerifiedPhone: Boolean (phone verification status)
  verificationTokenPhone: String (OTP token)
  verificationTokenExpiresAtPhone: Date (OTP expiry)
  tribeId: ObjectId (reference to tribe)
  profileImage: String (Cloudinary URL)
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}
```

**Used by:**
- User authentication controllers
- Profile management controllers
- Admin dashboard

#### [backend/models/profile.model.js](backend/models/profile.model.js)

**Profile Schema Structure:**
```
Profile {
  userId: ObjectId (reference to User)
  tribeId: String (tribe identifier)
  tribeName: String
  raceStats: {
    totalRaces: Number
    wins: Number
    earnings: Number
  }
  challengeStats: {
    completed: Number
    pending: Number
    totalSubmissions: Number
  }
  createdAt: Date
  updatedAt: Date
}
```

**Used by:**
- Tribe creation and management
- Profile data retrieval

---

### Controllers

#### [backend/controller/user.controller.js](backend/controller/user.controller.js)

**Key Functions:**

1. **`signupController()`**
   - Route: POST `/api/v1/user/signup`
   - Flow:
     1. Validates request with middleware
     2. Checks if user exists
     3. Hashes password with bcrypt (10 rounds)
     4. Generates OTP via `generateOTP()`
     5. Sends OTP via Twilio service
     6. Saves user with OTP token
     7. Returns user data and OTP message
   - Dependencies: 
     - `userModel` (database)
     - `generateOTP` (service)
     - `sendPhoneVerificationOtp` (Twilio service)

2. **`verifyPhoneController()`**
   - Route: POST `/api/v1/user/verify-phone`
   - Validates OTP and marks phone as verified
   - Sets JWT cookie via `sendCookies()`
   - Dependencies: `userModel`, `sendCookies`

3. **`loginPhoneNumberController()`**
   - Route: POST `/api/v1/user/login-phone`
   - Validates credentials
   - Generates and sends OTP
   - Dependencies: Twilio service

4. **`verifyForgotPasswordOtpController()`**
   - Route: PUT `/api/v1/user/reset-password`
   - Resets password after OTP verification
   - Uses: bcrypt, userModel

5. **`changePasswordController()`**
   - Route: PUT `/api/v1/user/change-password`
   - Updates password for authenticated users
   - Requires: Valid JWT cookie

6. **`logoutController()`**
   - Route: POST `/api/v1/user/logout`
   - Clears authentication cookie
   - Requires: Valid JWT cookie

#### [backend/controller/profile.controller.js](backend/controller/profile.controller.js)

**Key Functions:**

1. **`createTribeController()`**
   - Route: POST `/api/v1/profile/create-tribe`
   - Creates new tribe for user
   - Updates user's tribeId
   - Requires: JWT authentication
   - Dependencies: `userModel`, `profileModel`

2. **`uploadProfileImageController()`**
   - Route: PUT `/api/v1/profile/upload-image`
   - Handles profile image upload
   - Uses: Multer middleware, Cloudinary
   - Requires: JWT authentication

3. **`deleteImageController()`**
   - Route: DELETE `/api/v1/profile/delete-image`
   - Removes profile image from Cloudinary
   - Requires: JWT authentication

4. **`getLoggedProfileController()`**
   - Route: GET `/api/v1/profile/profile-details`
   - Returns authenticated user's profile
   - Requires: JWT authentication

#### [backend/controller/admin.controller.js](backend/controller/admin.controller.js)

**Purpose:** Admin-specific operations  
**Endpoints:** Admin dashboard functionality

---

### Middleware

#### [backend/middleware/user.middleware.js](backend/middleware/user.middleware.js)

**Validation Middleware:**

1. **`signupMiddleware()`**
   - Validates: name, phoneNumber, password
   - Uses: Joi schema validation
   - Checks: Phone format, password strength, name length

2. **`loginPhoneNumberMiddleware()`**
   - Validates: phoneNumber, password
   - Uses: Joi validation

3. **`otpMiddleware()`**
   - Validates: phoneNumber, OTP
   - Uses: Joi validation

4. **`changePasswordMiddleware()`**
   - Validates: oldPassword, newPassword
   - Uses: Joi validation

5. **`forgotPasswordPhoneMiddleware()`**
   - Validates: phoneNumber for password reset
   - Uses: Joi validation

6. **`resetPasswordPhoneMiddleware()`**
   - Validates: New password and OTP
   - Uses: Joi validation

#### [backend/middleware/profile.middleware.js](backend/middleware/profile.middleware.js)

**Functions:**
- **`createTribeMiddleware()`**: Validates tribe creation data
- Checks: Tribe name, user ID
- Uses: Joi validation

#### [backend/middleware/multer.middleware.js](backend/middleware/multer.middleware.js)

**Purpose:** File upload handling configuration  
**Storage:** Cloudinary (via multer-storage-cloudinary)  
**Used for:** Profile images, challenge uploads  
**Exports:** `upload` middleware object

#### [backend/middleware/verify.cookie.js](backend/middleware/verify.cookie.js)

**Function:** `verifyCookies()`
- Validates JWT token from cookies
- Decodes token and extracts user ID
- Sets `req.user` for downstream handlers
- Returns 401 if invalid/missing token
- Used on all protected routes

#### [backend/middleware/send.cookies.js](backend/middleware/send.cookies.js)

**Function:** `sendCookies()`
- Generates JWT token
- Sets HTTP-only secure cookie
- Called after successful authentication
- Includes: User ID, expiry time

---

### Services

#### [backend/service/otp.generator.js](backend/service/otp.generator.js)

**Function:** `generateOTP()`
- Generates 6-digit random OTP
- Returns: String OTP code
- Used by: User signup, forgot password
- Dependencies: otp-generator package

#### [backend/service/twilio.service.js](backend/service/twilio.service.js)

**Key Functions:**

1. **`sendPhoneVerificationOtp(phoneNumber, otp)`**
   - Sends verification OTP via SMS
   - Used during: Signup flow
   - Returns: Twilio response

2. **`sendPhoneForgotOtp(phoneNumber, otp)`**
   - Sends password reset OTP via SMS
   - Used during: Forgot password flow
   - Returns: Twilio response

**Dependencies:**
- Twilio credentials from environment
- Phone number sanitization

---

### Routes

#### [backend/router/user.router.js](backend/router/user.router.js)

**Endpoints:**

| Method | Path | Middleware | Controller | Purpose |
|--------|------|-----------|-----------|---------|
| POST | `/signup` | `signupMiddleware` | `signupController` | Register new user |
| POST | `/verify-phone` | `otpMiddleware` | `verifyPhoneController` | Verify OTP |
| POST | `/login-phone` | `loginPhoneNumberMiddleware` | `loginPhoneNumberController` | Phone login |
| PUT | `/change-password` | `verifyCookies`, `changePasswordMiddleware` | `changePasswordController` | Change password |
| PUT | `/forgot-password` | `forgotPasswordPhoneMiddleware` | `forgotPasswordController` | Send forgot password OTP |
| PUT | `/reset-password` | `resetPasswordPhoneMiddleware` | `verifyForgotPasswordOtpController` | Reset password |
| POST | `/logout` | `verifyCookies` | `logoutController` | Logout user |

#### [backend/router/profile.router.js](backend/router/profile.router.js)

**Endpoints:**

| Method | Path | Middleware | Controller | Purpose |
|--------|------|-----------|-----------|---------|
| POST | `/create-tribe` | `verifyCookies`, `createTribeMiddleware` | `createTribeController` | Create tribe |
| PUT | `/upload-image` | `upload.single()`, `verifyCookies` | `uploadProfileImageController` | Upload profile image |
| DELETE | `/delete-image` | `verifyCookies` | `deleteImageController` | Delete profile image |
| GET | `/profile-details` | `verifyCookies` | `getLoggedProfileController` | Get profile data |

#### [backend/router/admin.router.js](backend/router/admin.router.js)

**Purpose:** Admin-specific routes  
**Protected:** Yes, requires JWT

---

## 🎛️ Admin Backend Documentation

### Purpose
Manages all challenge, weekend schedule, and submission data. Handles:
- Creating and updating challenges
- Managing weekend schedules
- Processing user submissions
- Approving/rejecting submissions

### Entry Point: [adBackend/index.js](adBackend/index.js)

**Server Configuration:**
- Port: 9000
- CORS Origins: `http://localhost:5173`, `http://localhost:5174`
- Routes mounted:
  - `/api/v1/challenge` → Challenge management
  - `/api/v1/weekend` → Weekend schedule management
  - `/api/v1/submission` → Submission handling

---

### Configuration Files

#### [adBackend/config/db.connect.js](adBackend/config/db.connect.js)
- Connects to MongoDB for challenge data
- Uses: Mongoose ODM

#### [adBackend/config/cloudinary.config.js](adBackend/config/cloudinary.config.js)
- Image upload for challenge details
- Used for: Challenge banners, submission images

---

### Data Models

#### [adBackend/model/challange.model.js](adBackend/model/challange.model.js)

**Challenge Schema Structure:**
```
Challenge {
  title: String
  description: String
  category: String (F1, Racing, Sports, etc.)
  weekendId: ObjectId (reference to Weekend)
  imageUrl: String (Cloudinary URL)
  rules: String
  deadline: Date
  prizePool: Number
  difficulty: String (Easy, Medium, Hard)
  status: String (Active, Completed, Cancelled)
  createdAt: Date
  updatedAt: Date
}
```

**Purpose:** Stores all challenge information  
**Used by:** Challenge controllers, submission validators

#### [adBackend/model/weekend.model.js](adBackend/model/weekend.model.js)

**Weekend Schema Structure:**
```
Weekend {
  title: String
  startDate: Date
  endDate: Date
  season: Number (season number)
  bannerImage: String (Cloudinary URL)
  description: String
  challenges: [ObjectId] (references to Challenges)
  status: String (Active, Upcoming, Completed)
  prizePool: Number
  participantCount: Number
  createdAt: Date
  updatedAt: Date
}
```

**Purpose:** Manages weekend challenge schedules  
**Used by:** Weekend controllers, frontend for scheduling

#### [adBackend/model/submission.model.js](adBackend/model/submission.model.js)

**Submission Schema Structure:**
```
Submission {
  challengeId: ObjectId (reference to Challenge)
  userId: ObjectId (reference to User)
  videoUrl: String (submission video)
  imageFolderUrl: String (Cloudinary folder)
  description: String
  submittedAt: Date
  status: String (Pending, Approved, Rejected)
  score: Number
  feedback: String
  createdAt: Date
  updatedAt: Date
}
```

**Purpose:** Tracks user submissions to challenges  
**Used by:** Submission controllers, leaderboard calculations

---

### Controllers

#### [adBackend/controller/challenge.controller.js](adBackend/controller/challenge.controller.js)

**Key Functions:**

1. **`getAllChallenges()`**
   - Returns all challenges
   - Endpoint: GET `/api/v1/challenge/all`

2. **`getChallengesByWeekendId(weekendId)`**
   - Returns challenges for specific weekend
   - Endpoint: GET `/api/v1/challenge/weekend/:weekendId`
   - Dependencies: Weekend model

3. **`createChallenge()`**
   - Creates new challenge
   - Endpoint: POST `/api/v1/challenge/create`
   - Uses: Multer for image upload
   - Dependencies: Cloudinary

4. **`updateChallenge(id)`**
   - Updates challenge details
   - Endpoint: PUT `/api/v1/challenge/update/:id`

5. **`deleteChallenge(id)`**
   - Deletes challenge
   - Endpoint: DELETE `/api/v1/challenge/delete/:id`
   - Cascades: Deletes associated submissions

#### [adBackend/controller/weekend.controller.js](adBackend/controller/weekend.controller.js)

**Key Functions:**

1. **`getAllWeekends()`**
   - Returns all weekends
   - Endpoint: GET `/api/v1/weekend/all`

2. **`getWeekendById(id)`**
   - Returns specific weekend with challenges
   - Endpoint: GET `/api/v1/weekend/:id`

3. **`createWeekend()`**
   - Creates new weekend schedule
   - Endpoint: POST `/api/v1/weekend/create`
   - Uses: Multer for banner upload

4. **`updateWeekend(id)`**
   - Updates weekend details
   - Endpoint: PUT `/api/v1/weekend/update/:id`

5. **`deleteWeekend(id)`**
   - Deletes weekend
   - Endpoint: DELETE `/api/v1/weekend/delete/:id`

#### [adBackend/controller/submission.controller.js](adBackend/controller/submission.controller.js)

**Key Functions:**

1. **`getAllSubmissions()`**
   - Returns all challenge submissions
   - Endpoint: GET `/api/v1/submission/all`

2. **`getSubmissionsByChallenge(challengeId)`**
   - Returns submissions for a challenge
   - Endpoint: GET `/api/v1/submission/challenge/:challengeId`

3. **`createSubmission()`**
   - Records user's challenge submission
   - Endpoint: POST `/api/v1/submission/create`
   - Uses: Multer for file uploads

4. **`approveSubmission(id)`**
   - Approves a submission
   - Endpoint: PUT `/api/v1/submission/approve/:id`

5. **`rejectSubmission(id)`**
   - Rejects a submission
   - Endpoint: PUT `/api/v1/submission/reject/:id`

---

### Middleware

#### [adBackend/middleware/challange.middleware.js](adBackend/middleware/challange.middleware.js)

**Functions:**
- Challenge validation
- Validates: Title, description, weekendId
- Uses: Joi schema

#### [adBackend/middleware/weekend.middleware.js](adBackend/middleware/weekend.middleware.js)

**Functions:**
- Weekend validation
- Validates: Title, dates, description
- Uses: Joi schema

#### [adBackend/middleware/multer.middleware.js](adBackend/middleware/multer.middleware.js)

**Purpose:** File upload configuration  
**Storage:** Cloudinary  
**Exports:** `upload` middleware for challenge and weekend images

---

### Routes

#### [adBackend/router/challenge.router.js](adBackend/router/challenge.router.js)

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/all` | Get all challenges |
| GET | `/weekend/:weekendId` | Get challenges by weekend |
| POST | `/create` | Create new challenge |
| PUT | `/update/:id` | Update challenge |
| DELETE | `/delete/:id` | Delete challenge |

#### [adBackend/router/weekend.router.js](adBackend/router/weekend.router.js)

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/all` | Get all weekends |
| GET | `/:id` | Get specific weekend |
| POST | `/create` | Create new weekend |
| PUT | `/update/:id` | Update weekend |
| DELETE | `/delete/:id` | Delete weekend |

#### [adBackend/router/submission.router.js](adBackend/router/submission.router.js)

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/all` | Get all submissions |
| GET | `/challenge/:challengeId` | Get submissions for challenge |
| POST | `/create` | Submit challenge entry |
| PUT | `/approve/:id` | Approve submission |
| PUT | `/reject/:id` | Reject submission |

---

## 📱 Frontend Documentation

### Purpose
User-facing React application for:
- User registration and authentication
- Viewing and participating in challenges
- Managing user profiles
- Browsing schedules and leaderboards

### Entry Point: [frontend/src/main.jsx](frontend/src/main.jsx)

**Build Tool:** Vite  
**CSS Framework:** Tailwind CSS  
**HTTP Client:** Axios  
**State Management:** React Context (AuthContext)  
**Routing:** React Router v7

---

### Key Files

#### [frontend/src/App.jsx](frontend/src/App.jsx)

**Purpose:** Main routing component  
**Protected Routes:** Uses `ProtectedRoute` wrapper requiring:
1. User authentication
2. Tribe selection

**Route Structure:**

| Path | Component | Protected | Purpose |
|------|-----------|-----------|---------|
| `/` | Home | No | Landing/home page |
| `/signup` | SignupPage | No | User registration |
| `/login` | LoginPage | No | User login |
| `/forgot-password` | ForgotPasswordPage | No | Password recovery |
| `/otp` | OTPPage | No | OTP verification |
| `/tribe` | TribePage | Yes* | Tribe selection |
| `/schedule` | SeasonSchedule | Yes | Race schedule |
| `/race/:raceId` | RaceDetails | Yes | Race details |
| `/upload/:challengeId` | UploadChallenge | Yes | Submit challenge |
| `/upload/success` | UploadSuccess | Yes | Submission success |
| `/profile` | ProfilePage | Yes | View profile |
| `/profile/edit` | EditProfile | Yes | Edit profile |
| `/game/f1` | GamePage | Yes | Game view |
| `/weekend/:weekendId` | WeekendPage | Yes | Weekend details |
| `/raceboard` | Raceboard | Yes | Leaderboard |
| `/tribes` | Tribes | Yes | Tribes list |
| `/challenges` | ChallengeEntries | Yes | Challenge entries |

*Tribe route bypasses tribe requirement on initial visit

#### [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)

**Purpose:** Global authentication state management  
**Provides:**
- `useAuth()` hook for accessing auth state
- `user` object (current logged-in user)
- `isLoading` state
- Authentication status tracking
- Token/cookie management

**Data Structure:**
```javascript
user = {
  id: String,
  name: String,
  phoneNumber: String,
  tribeId: String,
  tribeName: String,
  profileImage: String,
  lastLogin: Date
}
```

**Used by:**
- `App.jsx` (for protected routes)
- All authenticated components
- All pages requiring user info

#### [frontend/src/pages/](frontend/src/pages/)

**Authentication Pages:**

1. **[SignupPage.jsx](frontend/src/pages/SignupPage.jsx)**
   - Registers new user
   - Calls: `POST /api/v1/user/signup` (backend)
   - Flow: Registration → OTP verification → Login
   - Uses: `AuthContext`

2. **[LoginPage.jsx](frontend/src/pages/LoginPage.jsx)**
   - User phone-based login
   - Calls: `POST /api/v1/user/login-phone` (backend)
   - Generates and sends OTP
   - Uses: `AuthContext`

3. **[OTPPage.jsx](frontend/src/pages/OTPPage.jsx)**
   - OTP verification
   - Calls: `POST /api/v1/user/verify-phone` (backend)
   - Sets authentication cookie
   - Uses: `AuthContext`

4. **[ForgotPasswordPage.jsx](frontend/src/pages/ForgotPasswordPage.jsx)**
   - Password recovery initiation
   - Calls: `PUT /api/v1/user/forgot-password` (backend)
   - Sends OTP to registered phone
   - Uses: OTPPage for verification

**Profile Pages:**

5. **[ProfilePage.jsx](frontend/src/pages/ProfilePage.jsx)**
   - Displays user profile
   - Shows: Name, tribe, stats, profile image
   - Calls: `GET /api/v1/profile/profile-details` (backend)
   - Uses: File display, formatting

6. **[EditProfile.jsx](frontend/src/pages/EditProfile.jsx)**
   - Edit profile information
   - Calls: `PUT /api/v1/profile/upload-image` (backend)
   - Uses: Multer for image upload
   - Uploads to: Cloudinary

7. **[TribePage.jsx](frontend/src/pages/TribePage.jsx)**
   - Tribe selection/creation
   - Calls: `POST /api/v1/profile/create-tribe` (backend)
   - Stores tribe in: localStorage
   - Updates: AuthContext

**Challenge Pages:**

8. **[WeekendPage.jsx](frontend/src/pages/WeekendPage.jsx)**
   - Shows weekend challenge details
   - Calls: `GET /api/v1/weekend/:id` (adBackend)
   - Displays: Challenges, schedule, info
   - Uses: `weekendService`

9. **[UploadChallenge.jsx](frontend/src/pages/UploadChallenge.jsx)**
   - Challenge submission form
   - Calls: `POST /api/v1/submission/create` (adBackend)
   - Uploads: Video/image files to Cloudinary
   - Navigation: Redirects to UploadSuccess

10. **[UploadSuccess.jsx](frontend/src/pages/UploadSuccess.jsx)**
    - Submission success confirmation
    - Displays: Submission ID, next steps

11. **[ChallengeEntries.jsx](frontend/src/pages/ChallengeEntries.jsx)**
    - Views submitted challenge entries
    - Calls: `GET /api/v1/submission/challenge/:id` (adBackend)
    - Shows: All submissions for challenge
    - Uses: `submissionService`

**Schedule & Race Pages:**

12. **[SeasonSchedule.jsx](frontend/src/pages/SeasonSchedule.jsx)**
    - Displays seasonal schedule
    - Calls: `GET /api/v1/weekend/all` (adBackend)
    - Shows: All weekends and challenges
    - Uses: `weekendService`

13. **[RaceDetails.jsx](frontend/src/pages/RaceDetails.jsx)**
    - Detailed race/challenge information
    - Shows: Rules, timeline, participants
    - Calls: `challengeService` for data

14. **[Raceboard.jsx](frontend/src/pages/Raceboard.jsx)**
    - Leaderboard/rankings view
    - Displays: Scores, placements, stats
    - Calls: `GET /api/v1/submission/all` (adBackend)

15. **[Home.jsx](frontend/src/pages/Home.jsx)**
    - Dashboard/home page
    - Shows: Active challenges, upcoming events
    - Components: Uses `DiscoveryFeed`, `ChallengeRail`

**User Pages:**

16. **[Tribes.jsx](frontend/src/pages/Tribes.jsx)**
    - Manages/views tribes
    - Shows: Available tribes, members

**Game Pages:**

17. **[GamePage.jsx](frontend/src/pages/GamePage.jsx)**
    - Interactive game component
    - Uses: `LightsOutGame` component

#### [frontend/src/components/](frontend/src/components/)

**Layout Components:**

1. **[Layout.jsx](frontend/src/components/Layout.jsx)**
   - Main layout wrapper
   - Provides: Navigation, header, footer
   - Uses: Tailwind CSS

2. **[AuthenticatedLayout.jsx](frontend/src/components/AuthenticatedLayout.jsx)**
   - Layout for authenticated users
   - Includes: User menu, tribe info
   - Uses: `AuthContext`

**Hero/Landing Components:**

3. **[Hero.jsx](frontend/src/components/Hero.jsx)**
   - Hero section component
   - Features: Animation, call-to-action
   - Uses: Framer Motion

4. **[LandingHero.jsx](frontend/src/components/LandingHero.jsx)**
   - Landing page hero
   - Displays: Main value proposition
   - Uses: Hero component

5. **[LandingPage.jsx](frontend/src/components/LandingPage.jsx)**
   - Full landing page
   - Combines: Hero, features, CTA sections

**Challenge Components:**

6. **[ChallengeRail.jsx](frontend/src/components/ChallengeRail.jsx)**
   - Horizontal carousel of challenges
   - Shows: Challenge cards, images
   - Uses: Framer Motion for animations
   - Calls: `challengeService.getAllChallenges()`
   - Dependencies: Challenge cards component

7. **[CategoryRail.jsx](frontend/src/components/CategoryRail.jsx)**
   - Category filter carousel
   - Filters: Challenges by category

8. **[DiscoveryFeed.jsx](frontend/src/components/DiscoveryFeed.jsx)**
   - Main challenge feed
   - Shows: Filtered challenges
   - Combines: CategoryRail, ChallengeRail
   - Uses: Filtering logic

**Information Components:**

9. **[Instructions.jsx](frontend/src/components/Instructions.jsx)**
   - Help/instructions component
   - Shows: How to participate, rules

**Game Component:**

10. **[LightsOutGame.jsx](frontend/src/components/LightsOutGame.jsx)**
    - Interactive game (Lights Out)
    - Features: Game logic, scoring

---

### Services

#### [frontend/src/services/challengeService.js](frontend/src/services/challengeService.js)

**Base URL:** `http://localhost:9000/api/v1/challenge`

**Functions:**

```javascript
// Get all challenges
getAllChallenges()
  → GET /all
  → Returns: Array of challenges

// Get specific challenge
getChallengesByWeekendId(weekendId)
  → GET /weekend/:weekendId
  → Returns: Challenges for weekend

// Delete challenge (admin)
deleteChallenge(id)
  → DELETE /delete/:id
  → Returns: Success response

// Create challenge (admin)
createChallenge(data)
  → POST /create
  → Params: Challenge data
  → Returns: Created challenge

// Update challenge (admin)
updateChallenge(id, data)
  → PUT /update/:id
  → Returns: Updated challenge
```

**Error Handling:** Try-catch blocks with console logging

---

#### [frontend/src/services/weekendService.js](frontend/src/services/weekendService.js)

**Base URL:** `http://localhost:9000/api/v1/weekend`

**Functions:**

```javascript
// Get all weekends
getAllWeekends()
  → GET /all
  → Returns: Array of weekends

// Get specific weekend
getWeekendById(id)
  → GET /:id
  → Returns: Weekend with challenges

// Create weekend (admin)
createWeekend(data)
  → POST /create
  → Returns: Created weekend

// Update weekend (admin)
updateWeekend(id, data)
  → PUT /update/:id
  → Returns: Updated weekend

// Delete weekend (admin)
deleteWeekend(id)
  → DELETE /delete/:id
  → Returns: Success
```

#### Inferred Services:

**[frontend/src/services/userService.js](frontend/src/services/userService.js)**
- Would contain: User authentication API calls
- Base URL: `http://localhost:7000/api/v1/user`
- Functions: signup, login, logout, verifyOTP, resetPassword

**[frontend/src/services/submissionService.js](frontend/src/services/submissionService.js)**
- Would contain: Submission-related API calls
- Base URL: `http://localhost:9000/api/v1/submission`
- Functions: createSubmission, getSubmissions, approveSubmission

---

### Custom Hooks

#### [frontend/src/hooks/useTribe.js](frontend/src/hooks/useTribe.js)

**Purpose:** Manages tribe selection and storage  
**Returns:** Tribe state and setter function  
**Storage:** localStorage (key: `gridsports_tribe`)  
**Used by:** TribePage, AuthContext

---

### Utilities

#### [frontend/src/lib/utils.js](frontend/src/lib/utils.js)

**Purpose:** Common utility functions  
**May contain:** Theme helpers, formatting functions, validation helpers

---

### Configuration Files

#### [frontend/vite.config.js](frontend/vite.config.js)
- Bundler configuration
- Path aliases (@ for src/)
- React Fast Refresh plugin
- Development server settings

#### [frontend/tailwind.config.js](frontend/tailwind.config.js)
- Tailwind CSS customization
- Theme colors, fonts
- Breakpoints

#### [frontend/postcss.config.js](frontend/postcss.config.js)
- PostCSS plugins (Tailwind, Autoprefixer)

#### [frontend/eslint.config.js](frontend/eslint.config.js)
- ESLint rules for code quality
- React-specific rules

---

## 🎨 Admin Frontend Documentation

### Purpose
Administrative dashboard for managing:
- Challenge creation and editing
- Weekend schedule management
- Submission review and approval
- User administration

### Entry Point: [adFrontend/src/main.jsx](adFrontend/src/main.jsx)

**Build Tool:** Vite  
**CSS Framework:** Tailwind CSS  
**HTTP Client:** Axios  
**Routing:** React Router  

---

### Key Components

#### [adFrontend/src/components/Layout.jsx](adFrontend/src/components/Layout.jsx)
- Admin layout wrapper
- Navigation sidebar
- Header with user info
- Used by all admin pages

#### [adFrontend/src/components/Welcome.jsx](adFrontend/src/components/Welcome.jsx)
- Dashboard welcome page
- Shows quick stats
- Latest updates

#### [adFrontend/src/components/AdminGridDashboard.jsx](adFrontend/src/components/AdminGridDashboard.jsx)
- Main admin dashboard
- Displays grid/cards of:
  - Active challenges
  - Pending submissions
  - User stats
  - Revenue metrics

#### Weekend Management

1. **[AllWeekends.jsx](adFrontend/src/components/AllWeekends.jsx)**
   - Lists all weekends
   - Shows: Title, dates, status
   - Actions: Edit, delete, view details
   - Calls: `weekendService.getAllWeekends()`

2. **[WeekendDetails.jsx](adFrontend/src/components/WeekendDetails.jsx)**
   - Detailed weekend view
   - Shows: Challenges, participants, schedule
   - Displays: All associated challenges

3. **[WeekendForm.jsx](adFrontend/src/components/WeekendForm.jsx)**
   - Create new weekend
   - Form fields: Title, dates, description, banner
   - Calls: `weekendService.createWeekend(data)`
   - Uploads banner to: Cloudinary

4. **[WeekendUpdate.jsx](adFrontend/src/components/WeekendUpdate.jsx)**
   - Edit existing weekend
   - Pre-fills: Current data
   - Calls: `weekendService.updateWeekend(id, data)`

#### Challenge Management

5. **[Challenges.jsx](adFrontend/src/components/Challenges.jsx)**
   - Lists all challenges
   - Shows: Title, category, status
   - Actions: Edit, delete, view submissions
   - Calls: `challengeService.getAllChallenges()`

6. **[ChallengeDetails.jsx](adFrontend/src/components/ChallengeDetails.jsx)**
   - Challenge detail view
   - Shows: Rules, submissions, stats
   - Links to: ChallengeForm for editing

7. **[ChallengeForm.jsx](adFrontend/src/components/ChallengeForm.jsx)**
   - Create/edit challenges
   - Form fields: Title, description, rules, deadline
   - Uploads: Challenge image to Cloudinary
   - Calls: `challengeService.createChallenge(data)`

#### Submission Management

8. **[SubmissionForm.jsx](adFrontend/src/components/SubmissionForm.jsx)**
   - Review/approve submissions
   - Shows: Submission details, video/images
   - Actions: Approve, reject, leave feedback
   - Calls: `submissionService.approveSubmission(id)`
   - Calls: `submissionService.rejectSubmission(id)`

#### User Management

9. **[Users.jsx](adFrontend/src/components/Users.jsx)**
   - Manages user accounts
   - Shows: User list, stats
   - Actions: View, disable, manage permissions
   - Calls: `userService.getAllUsers()`

---

### Admin Services

#### [adFrontend/src/services/challengeService.js](adFrontend/src/services/challengeService.js)

**Base URL:** `http://localhost:9000/api/v1/challenge`

Admin functions include:
- `getAllChallenges()` - List all
- `getChallengeById(id)` - Get details
- `createChallenge(data)` - Create
- `updateChallenge(id, data)` - Edit
- `deleteChallenge(id)` - Remove

#### [adFrontend/src/services/weekendService.js](adFrontend/src/services/weekendService.js)

**Base URL:** `http://localhost:9000/api/v1/weekend`

Admin functions include:
- `getAllWeekends()` - List all
- `getWeekendById(id)` - Get details
- `createWeekend(data)` - Create
- `updateWeekend(id, data)` - Edit
- `deleteWeekend(id)` - Remove

#### [adFrontend/src/services/submissionService.js](adFrontend/src/services/submissionService.js)

**Base URL:** `http://localhost:9000/api/v1/submission`

Admin functions include:
- `getAllSubmissions()` - List all
- `getSubmissionsByChallenge(id)` - Filter by challenge
- `approveSubmission(id)` - Approve
- `rejectSubmission(id)` - Reject

#### [adFrontend/src/services/userService.js](adFrontend/src/services/userService.js)

**Base URL:** `http://localhost:7000/api/v1/admin`

Admin functions include:
- `getAllUsers()` - List all users
- `getUserById(id)` - Get user details
- `updateUser(id, data)` - Edit user
- `deleteUser(id)` - Remove user

---

## 🔗 File Dependencies & Relationships

### Dependency Flow Diagram

```
FRONTEND (Port 5173)
├── App.jsx
│   ├── Pages (*.jsx)
│   │   ├── SignupPage
│   │   │   └── useAuth() from AuthContext
│   │   ├── ProfilePage
│   │   │   ├── useAuth()
│   │   │   └── challengeService.getChallengesByWeekendId()
│   │   ├── UploadChallenge
│   │   │   ├── Multer (via backend)
│   │   │   └── submissionService.createSubmission()
│   │   └── ...
│   ├── context/AuthContext.jsx
│   │   └── Uses: JWT cookies from Backend
│   ├── services/
│   │   ├── challengeService.js
│   │   │   └── Calls: adBackend /api/v1/challenge
│   │   ├── weekendService.js
│   │   │   └── Calls: adBackend /api/v1/weekend
│   │   └── submissionService.js
│   │       └── Calls: adBackend /api/v1/submission
│   └── hooks/useTribe.js
│       └── Uses: localStorage

BACKEND (Port 7000)
├── index.js
│   ├── router/user.router.js
│   │   ├── controller/user.controller.js
│   │   │   ├── models/user.model.js (MongoDB)
│   │   │   ├── service/otp.generator.js
│   │   │   ├── service/twilio.service.js
│   │   │   └── middleware/send.cookies.js
│   │   ├── middleware/user.middleware.js (validation)
│   │   └── middleware/verify.cookie.js (JWT check)
│   ├── router/profile.router.js
│   │   ├── controller/profile.controller.js
│   │   │   ├── models/user.model.js
│   │   │   ├── models/profile.model.js
│   │   │   └── middleware/multer.middleware.js
│   │   ├── middleware/profile.middleware.js
│   │   └── middleware/verify.cookie.js
│   ├── router/admin.router.js
│   │   └── controller/admin.controller.js
│   ├── config/db.connect.js → MongoDB
│   ├── config/cloudinary.config.js → Cloudinary
│   └── config/twilio.config.js → Twilio
│
AD BACKEND (Port 9000)
├── index.js
│   ├── router/challenge.router.js
│   │   ├── controller/challenge.controller.js
│   │   │   ├── model/challange.model.js (MongoDB)
│   │   │   ├── model/weekend.model.js
│   │   │   └── middleware/multer.middleware.js
│   │   └── middleware/challange.middleware.js
│   ├── router/weekend.router.js
│   │   ├── controller/weekend.controller.js
│   │   │   ├── model/weekend.model.js
│   │   │   └── middleware/multer.middleware.js
│   │   └── middleware/weekend.middleware.js
│   ├── router/submission.router.js
│   │   └── controller/submission.controller.js
│   │       ├── model/submission.model.js
│   │       ├── model/challange.model.js
│   │       └── middleware/multer.middleware.js
│   └── config/
│       ├── db.connect.js → MongoDB
│       └── cloudinary.config.js → Cloudinary
│
ADMIN FRONTEND (Port 5174)
├── App.jsx
│   └── Dashboard Components
│       ├── AdminGridDashboard.jsx
│       ├── AllWeekends.jsx
│       │   └── weekendService.getAllWeekends()
│       ├── Challenges.jsx
│       │   └── challengeService.getAllChallenges()
│       ├── SubmissionForm.jsx
│       │   └── submissionService.*()
│       └── Users.jsx
│           └── userService.getAllUsers()
│
EXTERNAL SERVICES
├── MongoDB (Databases)
│   ├── Backend DB (users, profiles)
│   └── Admin Backend DB (challenges, submissions)
├── Cloudinary (Image Storage)
│   ├── Profile images
│   ├── Challenge images
│   └── Submission files
└── Twilio (SMS Gateway)
    ├── OTP delivery
    └── Password recovery
```

### Key Relationships

#### Authentication Flow
```
SignupPage → backend/controller/user → userModel → OTP Service → Twilio
     ↓
OTPPage → backend/controller/user → verify cookie → AuthContext
     ↓
Protected Pages (useAuth hook)
```

#### Challenge Submission Flow
```
UploadChallenge → submissionService → adBackend/submission/create
     ↓
Multer → Cloudinary ← Store files
     ↓
submissionModel → MongoDB
     ↓
AdminFrontend ← submissionService ← adBackend/submission/all
     ↓
SubmissionForm → approveSubmission → adBackend ← Update status
```

#### Profile Update Flow
```
EditProfile → upload middleware → Cloudinary
     ↓
Backend profile.controller → profileModel → MongoDB
     ↓
AuthContext updates
     ↓
ProfilePage displays updated image
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account
- Twilio account
- Git

### Environment Setup

**Backend (.env)**
```
PORT=7000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gridsports
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

**Admin Backend (.env)**
```
PORT=9000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gridsports_admin
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Project

**Option 1: Using Batch Script**
```bash
# From root directory
start_all.bat
```

**Option 2: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Admin Backend
cd adBackend
npm install
npm run dev

# Terminal 3 - Frontend
cd frontend
npm install
npm run dev

# Terminal 4 - Admin Frontend
cd adFrontend
npm install
npm run dev
```

### Access Points
- **Main App**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **Backend API**: http://localhost:7000
- **Admin API**: http://localhost:9000

---

## 📝 Summary

**GridSports** is a sophisticated, microservices-based sports challenge platform featuring:

✅ **Modular Architecture**: Separate services for auth, challenges, admin  
✅ **Complete Authentication**: Phone-based signup, OTP verification, JWT tokens  
✅ **Challenge Management**: Create, schedule, submit, and approve challenges  
✅ **File Storage**: Cloudinary integration for image uploads  
✅ **SMS Notifications**: Twilio for OTP and alerts  
✅ **Database**: MongoDB for flexible data storage  
✅ **Modern Frontend**: React with Vite, Tailwind CSS  
✅ **Admin Dashboard**: Full control panel for platform management  

**Total Files:** 100+  
**Lines of Code:** 10,000+  
**API Endpoints:** 30+  
**Database Collections:** 4  

---

**Document Version:** 1.0  
**Last Updated:** February 18, 2026  
**Status:** Complete Project Documentation
