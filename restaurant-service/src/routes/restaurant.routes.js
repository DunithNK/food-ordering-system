const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurant.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - cuisine
 *       properties:
 *         name:
 *           type: string
 *           example: Sushi World
 *         address:
 *           type: string
 *           example: 10 Marine Drive, Colombo
 *         phone:
 *           type: string
 *           example: "0113456789"
 *         cuisine:
 *           type: string
 *           example: Japanese
 *     MenuItem:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: California Roll
 *         description:
 *           type: string
 *           example: Fresh avocado and crab
 *         price:
 *           type: number
 *           example: 1800
 *         category:
 *           type: string
 *           example: Sushi
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 */
router.get('/', controller.getAllRestaurants);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Add a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created
 */
router.post('/', controller.createRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: rest-001
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getRestaurantById);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update restaurant details
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', controller.updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', controller.deleteRestaurant);

/**
 * @swagger
 * /restaurants/{id}/menu:
 *   get:
 *     summary: Get menu items for a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: rest-001
 *     responses:
 *       200:
 *         description: Menu items list
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id/menu', controller.getMenuByRestaurantId);

/**
 * @swagger
 * /restaurants/{id}/menu:
 *   post:
 *     summary: Add menu item to a restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       201:
 *         description: Menu item added
 */
router.post('/:id/menu', controller.addMenuItem);

module.exports = router;
