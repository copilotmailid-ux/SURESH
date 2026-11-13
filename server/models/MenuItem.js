import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['burgers', 'pizza', 'snacks', 'momos', 'beverages', 'desserts'],
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: '', // 'Chef Pick', 'Hot', 'Bestseller'
    },
    station: {
      type: String,
      default: 'grill',
      enum: ['grill', 'fryer', 'oven', 'steamer', 'barista', 'bakery', 'hot expo'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;

