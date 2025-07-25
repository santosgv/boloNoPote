import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import type { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  removeFromCart: (productId: number) => void;
  openCheckout: () => void; // Nova prop para abrir o modal
}

const Cart: React.FC<CartProps> = ({ cartItems, removeFromCart, openCheckout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      {/* Ícone flutuante para mobile */}
      <motion.button
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 bg-gray-100 right-4 text-dark p-3 rounded-full shadow-lg z-40 md:hidden"
        onClick={toggleCart}
        aria-label="Abrir carrinho"
      >
        <FaShoppingCart className="text-2xl" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </motion.button>

      {/* Carrinho para desktop e modal para mobile */}
      <AnimatePresence>
        {(isCartOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bg-gray-100 bottom-4 right-4 rounded-lg shadow-lg p-4 z-40
              ${isCartOpen ? 'w-full max-w-[90vw] max-h-[70vh] overflow-y-auto' : 'w-80 max-h-96 overflow-y-auto md:w-80'}
              md:md:max-h-96 md:overflow-y-auto md:w-80
              ${isCartOpen ? 'top-0 md:top-auto bg-opacity-50 backdrop-blur-sm flex items-center justify-center md: md:backdrop-blur-none' : ''}`}
          >
            <div className="relative">
              {/* Botão de fechar para mobile */}
              {isCartOpen && (
                <button
                  className="absolute top-2 right-2 text-yellow md:hidden"
                  onClick={toggleCart}
                  aria-label="Fechar carrinho"
                >
                  <FaTimes className="text-xl" />
                </button>
              )}
              <div className="flex items-center mb-4">
                <FaShoppingCart className="text-2xl text-yellow mr-2" />
                <h2 className="text-xl font-bold text-yellow">Carrinho</h2>
              </div>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Carrinho vazio</p>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm font-semibold text-yellow">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          R$ {item.product.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red hover:text-yellow"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <p className="text-lg font-bold text-orange">
                      Total: R$ {total.toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        openCheckout();
                        setIsCartOpen(false); // Fecha o carrinho em mobile
                      }}
                      className="mt-4 block px-4 py-2 bg-green-500 text-white rounded-lg text-center hover:bg-red hover:text-white transition-colors"
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;