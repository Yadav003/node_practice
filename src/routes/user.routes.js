import express from 'express';
import { createUser, getUsers, updateUser, deleteUser, getCurrentUser } from '../controllers/user.controllers.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST route to create a new user
router.post('/users', createUser);

// GET route to fetch all users
router.get('/users', getUsers);

// GET current logged-in user (protected)
router.get('/users/me', protect, getCurrentUser);

// PATCH route to update a user by id (partial update)
router.patch('/users/:id', updateUser);

// DELETE route to remove a user by id
router.delete('/users/:id', deleteUser);

export default router;

