import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'resolved', 'in-progress'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: { // ✅ Add this
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
