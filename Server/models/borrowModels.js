import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },

  borrowDate: {
    type: Date,
    default: Date.now,
  },

  returnDate: {
    type: Date,
    required: false,
  },

  dueDate: {
    type: Date,
    required: true,
  },

  fine: {
    type: Number,
    default: 0,
  },

  notified: {
    type: Boolean,
    default: false,  
  },

  status: {
    type: String,
    enum: ["Borrowed", "Returned"],
    default: "Borrowed",
  },
},
{
  timestamps: true,
});

const Borrow = mongoose.model("Borrow", borrowSchema);
export default Borrow;
