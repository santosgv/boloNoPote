export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category | null;
}

export interface Category {
  id: number;
  name: string;
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