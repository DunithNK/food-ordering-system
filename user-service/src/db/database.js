const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'users.json');

// Seed default user if file doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const seed = [{
    id: 'user-001',
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    phone: '0711234567',
    address: '123 Main St, Colombo',
    createdAt: new Date().toISOString()
  }];
  fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
}

function readUsers() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

module.exports = { readUsers, writeUsers };