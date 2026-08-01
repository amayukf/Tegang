import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const normalizePhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('251')) return digits;
  if (digits.startsWith('0')) return '251' + digits.slice(1);
  if (digits.length === 9) return '251' + digits;
  return digits;
};

const validRoles = ['customer', 'provider'];

export const signup = async (req, res) => {
  try {
    let { name, phone, password, role } = req.body;

    if (!name || !phone || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    phone = normalizePhone(phone);
    if (phone.length < 12) {
      return res.status(400).json({ message: 'Please provide a valid phone number' });
    }

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User with this phone already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      phone,
      passwordHash,
      role
    });

    if (role === 'provider') {
      const { category, priceRangeMin, priceRangeMax, location } = req.body;
      await ProviderProfile.create({
        userId: user._id,
        category: category || 'other',
        location: location || '',
        priceRangeMin: priceRangeMin ? Number(priceRangeMin) : 0,
        priceRangeMax: priceRangeMax ? Number(priceRangeMax) : 5000
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Error creating account' });
  }
};

export const login = async (req, res) => {
  try {
    let { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    phone = normalizePhone(phone);
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
