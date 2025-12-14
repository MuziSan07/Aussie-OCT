// // controllers/authController.js
// import bcrypt from "bcryptjs";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // Validation helpers
// const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// const validatePhone = (phone) => /^\+?[\d\s\-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
// const validatePassword = (password) => password && password.length >= 8;

// // ===============================
// // Register Controller
// // ===============================
// export const register = async (req, res) => {
//   try {
//     const { email, phone, password, confirmPassword } = req.body;

//     if (!email || !phone || !password || !confirmPassword)
//       return res.status(400).json({ success: false, message: "All fields are required" });

//     if (!validateEmail(email))
//       return res.status(400).json({ success: false, message: "Invalid email format" });

//     if (!validatePhone(phone))
//       return res.status(400).json({ success: false, message: "Invalid phone number format" });

//     if (!validatePassword(password))
//       return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });

//     if (password !== confirmPassword)
//       return res.status(400).json({ success: false, message: "Passwords do not match" });

//     const existingUser = await prisma.emailSetup.findFirst({ where: { email } });
//     if (existingUser)
//       return res.status(400).json({ success: false, message: "Email already registered" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.emailSetup.create({
//       data: { email, phone, password: hashedPassword },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Account created successfully",
//       data: { id: user.id, email: user.email, phone: user.phone },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ success: false, message: "Server error. Please try again later." });
//   }
// };

// // ===============================
// // Login Controller
// // ===============================
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email and password are required" });

//     const user = await prisma.emailSetup.findFirst({ where: { email } });
//     if (!user)
//       return res.status(401).json({ success: false, message: "Invalid email or password" });

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword)
//       return res.status(401).json({ success: false, message: "Invalid email or password" });

//     res.json({
//       success: true,
//       message: "Login successful",
//       data: { id: user.id, email: user.email, phone: user.phone },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Server error. Please try again later." });
//   }
// };

// // ===============================
// // Health Check
// // ===============================
// export const healthCheck = (req, res) => {
//   res.json({ status: "ok" });
// };


// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// JWT Secret (you should put this in .env file)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-this-in-production";

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+?[\d\s\-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
const validatePassword = (password) => password && password.length >= 8;

// ===============================
// Register Controller (STUDENTS ONLY)
// ===============================
export const register = async (req, res) => {
  try {
    const { email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!email || !phone || !password || !confirmPassword)
      return res.status(400).json({ success: false, message: "All fields are required" });
    
    if (!validateEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email format" });
    
    if (!validatePhone(phone))
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    
    if (!validatePassword(password))
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    
    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    // Check if user exists
    const existingUser = await prisma.emailSetup.findFirst({ where: { email } });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (ALWAYS as STUDENT role)
    const user = await prisma.emailSetup.create({
      data: { 
        email, 
        phone, 
        password: hashedPassword,
        role: "STUDENT" // Always create as STUDENT
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { 
        id: user.id, 
        email: user.email, 
        phone: user.phone,
        role: user.role,
        token
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ===============================
// Login Controller (ADMIN + STUDENT)
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    // Find user with profile
    const user = await prisma.emailSetup.findFirst({ 
      where: { email },
      include: {
        profile: true
      }
    });

    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    // Check if user is active
    if (user.status === "DEACTIVATED")
      return res.status(401).json({ success: false, message: "Account has been deactivated. Please contact support." });

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    // Update last activity
    await prisma.emailSetup.update({
      where: { id: user.id },
      data: { lastActivity: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Check if profile is complete
    const hasProfile = user.profile !== null;

    res.json({
      success: true,
      message: "Login successful",
      data: { 
        id: user.id, 
        email: user.email, 
        phone: user.phone,
        role: user.role,
        hasProfile,
        username: user.profile?.username || null,
        profilePic: user.profile?.profilePic || null,
        token
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ===============================
// Health Check
// ===============================
export const healthCheck = (req, res) => {
  res.json({ status: "ok" });
};