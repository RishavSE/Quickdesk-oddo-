import express from 'express';
import {
  createTicket,
  getUserTickets,
  getTicketById,
  getAllTickets,
  updateTicketStatusOrComment,
} from '../controllers/ticketController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Create a new ticket (user)
router.post('/', authMiddleware, createTicket);

router.get('/agent', authMiddleware, getAllTickets);
// ✅ Get logged-in user's own tickets
router.get('/', authMiddleware, getUserTickets);

// ✅ Get a ticket by its ID
router.get('/:id', authMiddleware, getTicketById);

// ✅ Get all tickets (only if role is 'admin' or 'agent')


// ✅ Update ticket status or comment (admin or agent only)
router.put('/update/:id', authMiddleware, updateTicketStatusOrComment);



export default router;
