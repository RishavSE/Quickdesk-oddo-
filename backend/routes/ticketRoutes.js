import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; // adjust path
import { createTicket, getUserTickets } from '../controllers/ticketController.js';

const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/', authMiddleware, getUserTickets);

export default router;
