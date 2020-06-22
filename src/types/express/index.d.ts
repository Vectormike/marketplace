import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IVendor } from '../../interfaces/IVendor';
import { IOrder } from '../../interfaces/IOrder';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type VendorModel = Model<IVendor & Document>;
    export type OrderModel = Model<IOrder & Document>;
  }
}
