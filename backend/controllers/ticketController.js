import Ticket from "../models/Ticket.js"; // adjust path

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ticket = new Ticket({
      title,
      description,
      user: req.user._id,
      email: req.user.email, // ✅ Store user's email
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Ticket creation error:', error.message);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('Fetch tickets error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc Get single ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Ensure user is owner
    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    console.log('User from auth middleware:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied. Only admin or agent can view all tickets.' });
    }

    const tickets = await Ticket.find();
    console.log('Tickets found:', tickets.length);

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error in getAllTickets:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};








export const updateTicketStatusOrComment = async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (status) ticket.status = status;
    if (comment !== undefined) ticket.comment = comment;

    await ticket.save();
    res.status(200).json({ message: 'Ticket updated successfully', ticket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
