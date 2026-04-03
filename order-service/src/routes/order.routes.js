const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - itemId
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         itemId:
 *           type: string
 *           example: item-001
 *         name:
 *           type: string
 *           example: Margherita Pizza
 *         price:
 *           type: number
 *           example: 1200
 *         quantity:
 *           type: integer
 *           example: 2
 *     CreateOrder:
 *       type: object
 *       required:
 *         - userId
 *         - restaurantId
 *         - items
 *         - deliveryAddress
 *       properties:
 *         userId:
 *           type: string
 *           example: user-001
 *         restaurantId:
 *           type: string
 *           example: rest-001
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         deliveryAddress:
 *           type: string
 *           example: 45 Beach Road, Colombo 06
 *     UpdateStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *           example: CONFIRMED
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (validates user & restaurant via service calls)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 *       404:
 *         description: User or restaurant not found
 */
router.post('/', controller.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/', controller.getAllOrders);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Get orders by user ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: user-001
 *     responses:
 *       200:
 *         description: Orders for the user
 */
router.get('/user/:userId', controller.getOrdersByUser);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: order-001
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', controller.getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: order-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatus'
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', controller.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled
 */
router.put('/:id/cancel', controller.cancelOrder);

module.exports = router;
