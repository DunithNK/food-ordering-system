const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readUsers, writeUsers } = require('../db/database');
const User = require('../models/user.model');

const JWT_SECRET = 'food_ordering_secret_key_2026';

const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    const users = readUsers();
    if (users.find(u => u.email === email))
      return res.status(409).json({ success: false, message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone, address });
    users.push(newUser);
    writeUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({ success: true, message: 'User registered successfully', data: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ success: true, message: 'Login successful', data: { user: userWithoutPassword, token } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const getAllUsers = (req, res) => {
  const users = readUsers();
  const sanitized = users.map(({ password, ...rest }) => rest);
  return res.status(200).json({ success: true, data: sanitized });
};

const getUserById = (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password, ...userWithoutPassword } = user;
  return res.status(200).json({ success: true, data: userWithoutPassword });
};

const updateUser = async (req, res) => {
  try {
    const users = readUsers();
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, phone, address } = req.body;
    if (name) users[index].name = name;
    if (phone) users[index].phone = phone;
    if (address) users[index].address = address;
    writeUsers(users);
    const { password, ...userWithoutPassword } = users[index];
    return res.status(200).json({ success: true, message: 'User updated', data: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const deleteUser = (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });
  users.splice(index, 1);
  writeUsers(users);
  return res.status(200).json({ success: true, message: 'User deleted successfully' });
};

module.exports = { register, login, getAllUsers, getUserById, updateUser, deleteUser };