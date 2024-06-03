const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to generate a 4-digit numeric OTP
const generateNumericOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
};

// Register a new user
exports.register = async (req, res) => {
  const { username, password, phoneNumber, role } = req.body;

  try {
    // Generate OTP
    const otp = generateNumericOTP();

    // Generate JWT token
    const token = jwt.sign({ phoneNumber, role }, JWT_SECRET);

    // Store OTP and JWT token in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      "INSERT INTO users (username, password, phone_number, role, otp_code, jwt_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, hashedPassword, phoneNumber, role, otp, token]
    );

    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    // Log registration process
    console.log(`User registered: ${username} (${phoneNumber}), OTP: ${otp}`);

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Verify OTP for user registration
exports.verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await db.query(
      "SELECT * FROM users WHERE phone_number = $1 AND otp_code = $2",
      [phoneNumber, otp]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Update user status to 'verified' and clear OTP code
    await db.query(
      "UPDATE users SET status = 'verified', otp_code = null WHERE phone_number = $1",
      [phoneNumber]
    );

    // Log OTP verification process
    console.log(`OTP verified for user: ${phoneNumber}`);

    res
      .status(200)
      .json({ msg: "OTP verified successfully. User status updated." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login a user
exports.login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Log login attempt
    console.log(`User login attempt: ${phoneNumber}`);

    const user = await db.query("SELECT * FROM users WHERE phone_number = $1", [
      phoneNumber,
    ]);

    if (user.rows.length === 0) {
      console.log(
        `Login failed: User with phone number ${phoneNumber} not found`
      );
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      console.log(`Login failed: Incorrect password for user ${phoneNumber}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET);
    console.log(`User logged in: ${phoneNumber}`);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
