const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profiles.controller');
const {
  createProfileValidation,
  updateProfileValidation,
  getProfilesValidation,
  getProfileByIdValidation
} = require('../validators/profiles.validator');
const { validateRequest } = require('../middleware/validate-request');

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: User profile management
 */

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: List profiles (paginated)
 *     tags: [Profiles]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: visibility
 *         schema:
 *           type: string
 *           enum: [public, private]
 *         description: Filter by profile visibility
 *     responses:
 *       200:
 *         description: A paginated list of profiles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 */
router.get('/', getProfilesValidation, validateRequest, profilesController.getProfiles);

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create or update a profile (safe)
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: Profile created or updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       409:
 *         description: Conflict (e.g., username already taken)
 */
router.post('/', createProfileValidation, validateRequest, profilesController.createOrUpdateProfile);

/**
 * @swagger
 * /profiles/{user_id}:
 *   get:
 *     summary: Get profile by user ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 */
router.get('/:user_id', getProfileByIdValidation, validateRequest, profilesController.getProfileById);

/**
 * @swagger
 * /profiles/{user_id}:
 *   put:
 *     summary: Update a profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request (invalid fields)
 *       403:
 *         description: Forbidden (not the owner)
 *       404:
 *         description: Profile not found
 */
router.put('/:user_id', updateProfileValidation, validateRequest, profilesController.updateProfile);

module.exports = router;
