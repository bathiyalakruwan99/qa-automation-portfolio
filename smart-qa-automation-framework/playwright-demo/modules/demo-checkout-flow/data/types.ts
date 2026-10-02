export interface DemoUser {
  email: string;
  password: string;
}

export interface CartItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Coupon {
  code: string;
  percentOff: number;
}

export interface PaymentDetails {
  cardholder: string;
  cardNumberMasked: string;
  expiry: string;
}

export interface DemoCheckoutTestData {
  user: DemoUser;
  items: CartItem[];
  shipping: ShippingAddress;
  coupon: Coupon;
  payment: PaymentDetails;
  expected: {
    orderRefPrefix: string;
    finalStatus: string;
    appearsInHistory: boolean;
  };
}
