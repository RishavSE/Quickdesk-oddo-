import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },   // who commented, e.g. user email
  createdAt: { type: Date, default: Date.now },
});

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
    email: {
      type: String,
      required: true,
    },
    comments: [commentSchema],  // Add this array of comment subdocuments
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
