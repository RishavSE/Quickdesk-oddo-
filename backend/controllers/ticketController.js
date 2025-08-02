import Ticket from '../models/Ticket.js'; // adjust path


export const createTicket = async (req, res) => {
  try {
    console.log('Incoming ticket data:', req.body);
    console.log('Authenticated user:', req.user);

    const { title, description } = req.body;
    const userId = req.user.id;

    const ticket = new Ticket({
      title,
      description,
      user: userId,
    });

    await ticket.save();
    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    console.error('Create ticket error:', err);
    res.status(500).json({ message: 'Server error' });
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
