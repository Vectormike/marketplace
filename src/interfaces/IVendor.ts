export interface IVendor {
  _id: string;
  name: string;
  businessName: string;
  email: string;
  password: string;
  phoneNumber: number;
}

export interface IVendorInput {
  name: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  password: string;
}
