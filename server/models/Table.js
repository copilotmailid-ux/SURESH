import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 2,
    },
    section: {
      type: String,
      default: 'Floor 1',
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'preparing', 'ready', 'billing'],
      default: 'available',
    },
    activeOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    currentWaiter: {
      type: String,
      default: 'Rahul S.',
    },
    guestCount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    seatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.model('Table', tableSchema);
export default Table;

