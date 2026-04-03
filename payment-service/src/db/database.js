const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'payments.json');

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

function readPayments() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function writePayments(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

module.exports = { readPayments, writePayments };