import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-dark rounded-xl shadow-lg p-4 flex flex-col items-center transform transition-all duration-300 hover:shadow-2xl"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-40 h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold text-yellow">{product.name}</h3>
      <p className="text-sm text-gray-500 text-center mb-2">{product.description}</p>
      <p className="text-lg font-semibold text-orange">R$ {product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:text-dark transition-colors"
      >
        Adicionar
      </button>
    </motion.div>
  );
};

export default ProductCard;