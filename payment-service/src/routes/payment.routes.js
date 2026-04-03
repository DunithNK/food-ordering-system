const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     MakePayment:
 *       type: object
 *       required:
 *         - orderId
 *         - userId
 *         - amount
 *         - method
 *       properties:
 *         orderId:
 *           type: string
 *           example: order-001
 *         userId:
 *           type: string
 *           example: user-001
 *         amount:
 *           type: number
 *           example: 2000
 *         method:
 *           type: string
 *           enum: [CARD, CASH, ONLINE_BANKING]
 *           example: CARD
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Process a payment for an order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MakePayment'
 *     responses:
 *       201:
 *         description: Payment processed (success or failed)
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 *       409:
 *         description: Payment already completed for this order
 */
router.post('/', controller.makePayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments
 */
router.get('/', controller.getAllPayments);

/**
 * @swagger
 * /payments/order/{orderId}:
 *   get:
 *     summary: Get payment by Order ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: order-001
 *     responses:
 *       200:
 *         description: Payment for the order
 *       404:
 *         description: No payment found
 */
router.get('/order/:orderId', controller.getPaymentByOrderId);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: pay-001
 *     responses:
 *       200:
 *         description: Payment details
 *       404:
 *         description: Payment not found
 */
router.get('/:id', controller.getPaymentById);

/**
 * @swagger
 * /payments/{id}/refund:
 *   put:
 *     summary: Refund a successful payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: pay-001
 *     responses:
 *       200:
 *         description: Payment refunded
 *       400:
 *         description: Cannot refund non-successful payment
 *       404:
 *         description: Payment not found
 */
router.put('/:id/refund', controller.refundPayment);

module.exports = router;
