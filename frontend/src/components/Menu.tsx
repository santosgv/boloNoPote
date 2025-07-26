import React from 'react';
import { motion } from 'framer-motion';
import type { Product, Category } from '../types';

interface MenuProps {
  categories: { id: number; name: string; products: Product[] }[];
  addToCart: (product: Product) => void;
}

const Menu: React.FC<MenuProps> = ({ categories, addToCart }) => {
  return (
    <section className="py-12 px-4">
    {/*  <h2 className="text-4xl font-bold text-burger-yellow text-center mb-8">Nosso Menu</h2> */}
      {categories.length === 0 ? (
        <p className="text-gray-300 text-center">Nenhuma categoria disponível.</p>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="mb-12">
            <h3 className="text-4xl font-bold text-burger-yellow text-center mb-8">{category.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.length === 0 ? (
                <p className="text-gray-300">Nenhum produto nesta categoria.</p>
              ) : (
                category.products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-burger-dark rounded-xl shadow-lg overflow-hidden border border-burger-orange"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      
                    )}
                    <div className="p-4">
                      <h4 className="text-xl font-bold text-burger-yellow">{product.name}</h4>
                      <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                      <p className="text-burger-orange text-lg font-semibold mt-2">
                        R$ {product.price}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-red hover:text-white transition-colors"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default Menu;