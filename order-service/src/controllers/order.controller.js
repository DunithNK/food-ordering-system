const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { readOrders, writeOrders } = require('../db/database');

const USER_SERVICE_URL = 'http://localhost:8081';
const RESTAURANT_SERVICE_URL = 'http://localhost:8082';
const ORDER_STATUSES = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

const createOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, deliveryAddress } = req.body;
    if (!userId || !restaurantId || !items || items.length === 0 || !deliveryAddress)
      return res.status(400).json({ success: false, message: 'userId, restaurantId, items and deliveryAddress are required' });

    try { await axios.get(`${USER_SERVICE_URL}/users/${userId}`); }
    catch { return res.status(404).json({ success: false, message: `User ${userId} not found` }); }

    try { await axios.get(`${RESTAURANT_SERVICE_URL}/restaurants/${restaurantId}`); }
    catch { return res.status(404).json({ success: false, message: `Restaurant ${restaurantId} not found` }); }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = { id: `order-${uuidv4().slice(0,8)}`, userId, restaurantId, items, totalAmount, status: 'PENDING', deliveryAddress, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

    const orders = readOrders();
    orders.push(newOrder);
    writeOrders(orders);
    return res.status(201).json({ success: true, message: 'Order created successfully', data: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const getAllOrders = (req, res) => {
  const orders = readOrders();
  return res.status(200).json({ success: true, count: orders.length, data: orders });
};

const getOrderById = (req, res) => {
  const order = readOrders().find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  return res.status(200).json({ success: true, data: order });
};

const getOrdersByUser = (req, res) => {
  const orders = readOrders().filter(o => o.userId === req.params.userId);
  return res.status(200).json({ success: true, count: orders.length, data: orders });
};

const updateOrderStatus = (req, res) => {
  const orders = readOrders();
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });
  const { status } = req.body;
  if (!status || !ORDER_STATUSES.includes(status))
    return res.status(400).json({ success: false, message: `Invalid status. Valid: ${ORDER_STATUSES.join(', ')}` });
  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  writeOrders(orders);
  return res.status(200).json({ success: true, message: 'Order status updated', data: orders[index] });
};

const cancelOrder = (req, res) => {
  const orders = readOrders();
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });
  if (orders[index].status === 'DELIVERED')
    return res.status(400).json({ success: false, message: 'Cannot cancel a delivered order' });
  orders[index].status = 'CANCELLED';
  orders[index].updatedAt = new Date().toISOString();
  writeOrders(orders);
  return res.status(200).json({ success: true, message: 'Order cancelled', data: orders[index] });
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrdersByUser, updateOrderStatus, cancelOrder };