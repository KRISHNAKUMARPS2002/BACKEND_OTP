# Node.js Authentication System with Twilio OTP Verification

This Node.js project implements a simple authentication system with OTP (One-Time Password) verification using Twilio for sending SMS messages.

## Setup

### Prerequisites

- Node.js installed on your machine
- PostgreSQL installed and running
- Twilio account (for sending SMS messages)

### Installation

1. Clone the repository:

   bash
   git clone https://github.com/KRISHNAKUMARPS2002/BACKEND_OTP.git
   

2. Navigate to the project directory:

   bash
   cd your-repo
   

3. Install dependencies:

   bash
   npm install
   

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following environment variables to the `.env` file:

     env
     TWILIO_ACCOUNT_SID=your_twilio_account_sid
     TWILIO_AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number
     JWT_SECRET=your_jwt_secret
     DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/backend_otp
     

     Replace placeholders (`your_twilio_account_sid`, `your_twilio_auth_token`, etc.) with your actual Twilio credentials, JWT secret, and PostgreSQL database credentials.

5. Create PostgreSQL database:

   - Run the SQL script `database.sql` in your PostgreSQL database to create the necessary tables.

6. Start the server:

   bash
   npm start
   

   Your server should now be running on `http://localhost:3000`.

## Usage

### Register a New User

- **Endpoint:** `POST /api/auth/register`
- **Request Body:** JSON object with keys `username`, `password`, `phoneNumber`, and `role`.
- **Purpose:** Register a new user by providing their username, password, phone number, and role (optional).

### Verify OTP

- **Endpoint:** `POST /api/auth/verify-otp`
- **Request Body:** JSON object with keys `phoneNumber` and `otp`.
- **Purpose:** Verify the OTP (One-Time Password) sent to the user's phone number during registration.

### Login

- **Endpoint:** `POST /api/auth/login`
- **Request Body:** JSON object with keys `phoneNumber` and `password`.
- **Purpose:** Authenticate a user by checking their phone number and password against the stored credentials.


