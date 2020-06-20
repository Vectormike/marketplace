export interface IOrder {
  _id: string;
  user: object;
  cart: object;
  date: string;
  orderStatus: string;
  name: string;
  address: string;
  paymentStatus: string;
}
