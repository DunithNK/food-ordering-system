const { v4: uuidv4 } = require('uuid');

class User {
  constructor({ name, email, password, phone, address }) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone || '';
    this.address = address || '';
    this.createdAt = new Date().toISOString();
  }
}

module.exports = User;
