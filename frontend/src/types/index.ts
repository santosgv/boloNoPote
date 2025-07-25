export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}