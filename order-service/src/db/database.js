const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'orders.json');

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

function readOrders() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function writeOrders(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

module.exports = { readOrders, writeOrders };