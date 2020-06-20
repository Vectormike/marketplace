import { IOrder } from '../interfaces/IOrder';
import mongoose, { Schema } from 'mongoose';

/**
 * Order status
 */
const status = ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Refund'];

const Order = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  cart: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: status,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
});

export default mongoose.model<IOrder & mongoose.Document>('Order', Order);
