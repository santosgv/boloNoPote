import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHamburger, FaCocktail, FaPizzaSlice } from 'react-icons/fa';
import type { Category, Product } from '../types';
import ProductCard from './ProductCard';

interface MenuProps {
  categories: Category[];
  addToCart: (product: Product) => void;
}

const iconMap: { [key: string]: JSX.Element } = {
  FaHamburger: <FaHamburger />,
  FaCocktail: <FaCocktail />,
  FaPizzaSlice: <FaPizzaSlice />,
};

const Menu: React.FC<MenuProps> = ({ categories, addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-center text-burger-yellow mb-6"
      >
        Nosso Cardápio
      </motion.h2>
      <div className="flex justify-center space-x-4 mb-8 overflow-x-auto">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            whileHover={{ scale: 1.1 }}
            className={`flex items-center px-6 py-3 rounded-lg ${
              selectedCategory === category.id
                ? 'bg-burger-yellow text-burger-dark'
                : 'bg-burger-red text-white'
            } transition-colors`}
          >
            <span className="mr-2">{iconMap[category.icon]}</span>
            {category.name}
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCategoryData?.products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default Menu;