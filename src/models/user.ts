import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
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
      default: 'user',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
