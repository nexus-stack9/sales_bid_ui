export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface ProductCheckoutItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sellerId: string;
}
