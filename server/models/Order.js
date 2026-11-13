import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  station: {
    type: String,
    default: 'grill',
  },
  notes: {
    type: String,
    default: '',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    tableNumber: {
      type: String,
      required: true,
    },
    waiterName: {
      type: String,
      default: 'Rahul S.',
    },
    guestCount: {
      type: Number,
      default: 2,
    },
    orderType: {
      type: String,
      enum: ['dine_in', 'takeaway'],
      default: 'dine_in',
    },
    items: [orderItemSchema],
    kitchenNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'served', 'billed', 'completed', 'cancelled'],
      default: 'preparing',
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0, // 5% GST
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'cash', 'card', 'none'],
      default: 'none',
    },
    paidAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

