import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { isDbMockMode } from '../config/db.js';
import { getInMemoryStore } from '../config/seed.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      ward: user.ward
    },
    process.env.JWT_SECRET || 'civic_ai_super_secret_jwt_key_2026_hackathon',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'citizen', department, ward, languagePreference } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Please provide name, email, and password.', 400);
    }

    if (isDbMockMode()) {
      const store = getInMemoryStore();
      if (store.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return sendError(res, 'User already exists with this email.', 400);
      }
      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        password,
        role,
        department: department || null,
        ward: ward || 'Ward-12 (Connaught Place & Central)',
        jurisdictionZone: 'Central Zone',
        languagePreference: languagePreference || 'en',
        createdAt: new Date()
      };
      store.users.push(newUser);
      const token = generateToken(newUser);
      return sendSuccess(res, 'Registered successfully', { user: newUser, token }, 201);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'User already exists with this email.', 400);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      department,
      ward,
      languagePreference
    });

    const token = generateToken(user);
    const userRes = user.toObject();
    delete userRes.password;

    return sendSuccess(res, 'Registered successfully', { user: userRes, token }, 201);
  } catch (error) {\n    next(error);\n  }\n};\n\nexport const login = async (req, res, next) => {\n  try {\n    const { email, password } = req.body;\n\n    if (!email || !password) {\n      return sendError(res, 'Please provide email and password.', 400);\n    }\n\n    if (isDbMockMode()) {\n      const store = getInMemoryStore();\n      const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());\n      if (!user || user.password !== password) {\n        return sendError(res, 'Invalid email or password credentials.', 401);\n      }\n      const token = generateToken(user);\n      const userRes = { ...user };\n      delete userRes.password;\n      return sendSuccess(res, 'Logged in successfully', { user: userRes, token });\n    }\n\n    const user = await User.findOne({ email: email.toLowerCase() });\n    if (!user) {\n      return sendError(res, 'Invalid email or password credentials.', 401);\n    }\n\n    const isMatch = await user.matchPassword(password);\n    if (!isMatch && user.password !== password) {\n      return sendError(res, 'Invalid email or password credentials.', 401);\n    }\n\n    const token = generateToken(user);\n    const userRes = user.toObject();\n    delete userRes.password;\n\n    return sendSuccess(res, 'Logged in successfully', { user: userRes, token });\n  } catch (error) {\n    next(error);\n  }\n};\n\nexport const getMe = async (req, res, next) => {\n  try {\n    return sendSuccess(res, 'Current user profile fetched', { user: req.user });\n  } catch (error) {\n    next(error);\n  }\n};\n\nexport const getDemoAccounts = async (req, res, next) => {\n  try {\n    const demoAccounts = [\n      { role: 'citizen', name: 'Ramesh Sharma', email: 'citizen@example.com', password: 'password123', label: 'Citizen Reporter' },\n      { role: 'field_officer', name: 'Rajesh Verma', email: 'officer@roads.gov.in', password: 'password123', label: 'Roads Field Officer' },\n      { role: 'supervisor', name: 'Sunita Rao', email: 'supervisor@civic.gov.in', password: 'password123', label: 'Department Supervisor' },\n      { role: 'admin', name: 'Dr. Amit Malhotra', email: 'admin@delhi.gov.in', password: 'password123', label: 'Municipal Commissioner' },\n      { role: 'auditor', name: 'Kavita Swaminathan', email: 'auditor@audit.gov.in', password: 'password123', label: 'Independent Grievance Auditor' }\n    ];\n    return sendSuccess(res, 'Demo credentials retrieved for hackathon evaluation', { demoAccounts });\n  } catch (error) {\n    next(error);\n  }\n};\n