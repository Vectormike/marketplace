export interface IOrder {
  _id: string;
  user: object;
  cart: object;
  date: string;
  preparing: boolean;
  ontheway: boolean;
  delivered: boolean;
  name: string;
  address: string;
  paymentStatus: string;
}
