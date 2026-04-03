const fs = require('fs');
const path = require('path');

const REST_FILE = path.join(__dirname, 'restaurants.json');
const MENU_FILE = path.join(__dirname, 'menus.json');

const defaultRestaurants = [
  { id: 'rest-001', name: 'Pizza Palace', address: '12 Galle Road, Colombo 03', phone: '0112345678', cuisine: 'Italian', rating: 4.5, isOpen: true, createdAt: new Date().toISOString() },
  { id: 'rest-002', name: 'Burger Barn', address: '45 Kandy Road, Colombo 10', phone: '0119876543', cuisine: 'American', rating: 4.2, isOpen: true, createdAt: new Date().toISOString() },
  { id: 'rest-003', name: 'Spice Garden', address: '78 Union Place, Colombo 02', phone: '0115555555', cuisine: 'Sri Lankan', rating: 4.8, isOpen: true, createdAt: new Date().toISOString() }
];

const defaultMenus = {
  'rest-001': [
    { id: 'item-001', name: 'Margherita Pizza', description: 'Classic tomato and cheese', price: 1200, category: 'Pizza', available: true },
    { id: 'item-002', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni', price: 1500, category: 'Pizza', available: true },
    { id: 'item-003', name: 'Garlic Bread', description: 'Crispy garlic bread', price: 400, category: 'Sides', available: true }
  ],
  'rest-002': [
    { id: 'item-004', name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', price: 900, category: 'Burgers', available: true },
    { id: 'item-005', name: 'Cheese Burger', description: 'Double cheese beef burger', price: 1100, category: 'Burgers', available: true },
    { id: 'item-006', name: 'French Fries', description: 'Crispy golden fries', price: 350, category: 'Sides', available: true }
  ],
  'rest-003': [
    { id: 'item-007', name: 'Rice & Curry', description: 'Traditional Sri Lankan meal', price: 700, category: 'Main Course', available: true },
    { id: 'item-008', name: 'Kottu Roti', description: 'Classic egg kottu', price: 850, category: 'Main Course', available: true },
    { id: 'item-009', name: 'Pol Sambol', description: 'Coconut sambol side dish', price: 150, category: 'Sides', available: true }
  ]
};

if (!fs.existsSync(REST_FILE)) fs.writeFileSync(REST_FILE, JSON.stringify(defaultRestaurants, null, 2));
if (!fs.existsSync(MENU_FILE)) fs.writeFileSync(MENU_FILE, JSON.stringify(defaultMenus, null, 2));

function readRestaurants() { return JSON.parse(fs.readFileSync(REST_FILE, 'utf8')); }
function writeRestaurants(data) { fs.writeFileSync(REST_FILE, JSON.stringify(data, null, 2)); }
function readMenus() { return JSON.parse(fs.readFileSync(MENU_FILE, 'utf8')); }
function writeMenus(data) { fs.writeFileSync(MENU_FILE, JSON.stringify(data, null, 2)); }

module.exports = { readRestaurants, writeRestaurants, readMenus, writeMenus };