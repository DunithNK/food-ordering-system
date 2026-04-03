const { v4: uuidv4 } = require('uuid');
const { readRestaurants, writeRestaurants, readMenus, writeMenus } = require('../db/database');

const getAllRestaurants = (req, res) => {
  const restaurants = readRestaurants();
  return res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
};

const getRestaurantById = (req, res) => {
  const restaurant = readRestaurants().find(r => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  return res.status(200).json({ success: true, data: restaurant });
};

const createRestaurant = (req, res) => {
  const { name, address, phone, cuisine } = req.body;
  if (!name || !address || !cuisine)
    return res.status(400).json({ success: false, message: 'Name, address and cuisine are required' });
  const restaurants = readRestaurants();
  const newRestaurant = { id: `rest-${uuidv4().slice(0,6)}`, name, address, phone: phone || '', cuisine, rating: 0, isOpen: true, createdAt: new Date().toISOString() };
  restaurants.push(newRestaurant);
  writeRestaurants(restaurants);
  const menus = readMenus();
  menus[newRestaurant.id] = [];
  writeMenus(menus);
  return res.status(201).json({ success: true, message: 'Restaurant created', data: newRestaurant });
};

const updateRestaurant = (req, res) => {
  const restaurants = readRestaurants();
  const index = restaurants.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  const { name, address, phone, cuisine, isOpen, rating } = req.body;
  if (name) restaurants[index].name = name;
  if (address) restaurants[index].address = address;
  if (phone) restaurants[index].phone = phone;
  if (cuisine) restaurants[index].cuisine = cuisine;
  if (isOpen !== undefined) restaurants[index].isOpen = isOpen;
  if (rating !== undefined) restaurants[index].rating = rating;
  writeRestaurants(restaurants);
  return res.status(200).json({ success: true, message: 'Restaurant updated', data: restaurants[index] });
};

const deleteRestaurant = (req, res) => {
  const restaurants = readRestaurants();
  const index = restaurants.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  restaurants.splice(index, 1);
  writeRestaurants(restaurants);
  return res.status(200).json({ success: true, message: 'Restaurant deleted' });
};

const getMenuByRestaurantId = (req, res) => {
  const restaurant = readRestaurants().find(r => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  const menus = readMenus();
  const menu = menus[req.params.id] || [];
  return res.status(200).json({ success: true, restaurant: restaurant.name, count: menu.length, data: menu });
};

const addMenuItem = (req, res) => {
  const restaurant = readRestaurants().find(r => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  const { name, description, price, category } = req.body;
  if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price are required' });
  const menus = readMenus();
  const newItem = { id: `item-${uuidv4().slice(0,6)}`, name, description: description || '', price, category: category || 'General', available: true };
  if (!menus[req.params.id]) menus[req.params.id] = [];
  menus[req.params.id].push(newItem);
  writeMenus(menus);
  return res.status(201).json({ success: true, message: 'Menu item added', data: newItem });
};

module.exports = { getAllRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant, getMenuByRestaurantId, addMenuItem };