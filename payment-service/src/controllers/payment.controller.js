const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { readPayments, writePayments } = require('../db/database');

const ORDER_SERVICE_URL = 'http://localhost:8083';
const VALID_METHODS = ['CARD', 'CASH', 'ONLINE_BANKING'];

const processPayment = (method) => method === 'CASH' ? true : Math.random() > 0.1;

const makePayment = async (req, res) => {
  try {
    const { orderId, userId, amount, method } = req.body;
    if (!orderId || !userId || !amount || !method)
      return res.status(400).json({ success: false, message: 'orderId, userId, amount and method are required' });
    if (!VALID_METHODS.includes(method))
      return res.status(400).json({ success: false, message: `Invalid method. Valid: ${VALID_METHODS.join(', ')}` });

    const payments = readPayments();
    const existing = payments.find(p => p.orderId === orderId && p.status === 'SUCCESS');
    if (existing) return res.status(409).json({ success: false, message: 'Payment already completed', data: existing });

    try { await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}`); }
    catch { return res.status(404).json({ success: false, message: `Order ${orderId} not found` }); }

    const isSuccess = processPayment(method);
    const newPayment = {
      id: `pay-${uuidv4().slice(0,8)}`, orderId, userId, amount, method,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      transactionRef: isSuccess ? `TXN-${uuidv4().slice(0,10).toUpperCase()}` : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    payments.push(newPayment);
    writePayments(payments);

    if (isSuccess) {
      try { await axios.put(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, { status: 'CONFIRMED' }); }
      catch (e) { console.warn('Could not update order status:', e.message); }
    }
    return res.status(201).json({ success: isSuccess, message: isSuccess ? 'Payment successful' : 'Payment failed', data: newPayment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const getAllPayments = (req, res) => {
  return res.status(200).json({ success: true, data: readPayments() });
};

const getPaymentById = (req, res) => {
  const payment = readPayments().find(p => p.id === req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  return res.status(200).json({ success: true, data: payment });
};

const getPaymentByOrderId = (req, res) => {
  const payment = readPayments().find(p => p.orderId === req.params.orderId);
  if (!payment) return res.status(404).json({ success: false, message: 'No payment for this order' });
  return res.status(200).json({ success: true, data: payment });
};

const refundPayment = (req, res) => {
  const payments = readPayments();
  const index = payments.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Payment not found' });
  if (payments[index].status !== 'SUCCESS')
    return res.status(400).json({ success: false, message: 'Only successful payments can be refunded' });
  payments[index].status = 'REFUNDED';
  payments[index].updatedAt = new Date().toISOString();
  writePayments(payments);
  return res.status(200).json({ success: true, message: 'Refunded', data: payments[index] });
};

module.exports = { makePayment, getAllPayments, getPaymentById, getPaymentByOrderId, refundPayment };