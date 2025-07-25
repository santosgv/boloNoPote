import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface PromotionsProps {
  promotions: Product[];
  addToCart: (product: Product) => void;
}

const Promotions: React.FC<PromotionsProps> = ({ promotions, addToCart }) => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-burger-red to-burger-orange">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-center text-burger-dark mb-6"
      >
        Promoções do Dia
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default Promotions;