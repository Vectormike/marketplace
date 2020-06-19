import { IVendor } from '../interfaces/IVendor';
import mongoose from 'mongoose';

const Vendor = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 11,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
    role: {
      type: String,
      default: 'vendor',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IVendor & mongoose.Document>('Vendor', Vendor);
