/* eslint-disable prettier/prettier */
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
  orderId: {
    type: String,
    required: true,
  },
  cart: {
    type: Array,
    required: true,
    default: [],
  },
  createdDate: {
    type: Date,
  },
  updatedDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: status,
    default: 'Pending',
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
  paid: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IOrder & mongoose.Document>('Order', Order);
