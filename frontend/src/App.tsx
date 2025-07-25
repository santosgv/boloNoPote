import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StateSelector from './components/StateSelector';
import Header from './components/Header';
import Menu from './components/Menu';
import Promotions from './components/Promotions';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Toast from './components/Toast';
import { mockCategories, mockPromotions } from './data/mockData';
import type { CartItem, Product } from './types';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Verifica o localStorage ao carregar a aplicação
  useEffect(() => {
    const savedState = localStorage.getItem('selectedState');
    const savedCity = localStorage.getItem('selectedCity');
    if (savedState && savedCity) {
      setIsStateSelected(true);
    }
  }, []);

  const handleStateSelect = (state: string, city: string) => {
    setIsStateSelected(true);
  };

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    setToast({
      message: `Produto ${product.name} adicionado ao carrinho!`,
      id: Date.now(),
    });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const resetLocation = () => {
    localStorage.removeItem('selectedState');
    localStorage.removeItem('selectedCity');
    setIsStateSelected(false);
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-burger-dark">
        <AnimatePresence>
          {toast && <Toast key={toast.id} message={toast.message} />}
        </AnimatePresence>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {!isStateSelected ? (
                  <StateSelector onSelect={handleStateSelect} />
                ) : (
                  <>
                    <Header resetLocation={resetLocation} />
                    <Menu categories={mockCategories} addToCart={addToCart} />
                    <Promotions promotions={mockPromotions} addToCart={addToCart} />
                    <Cart
                      cartItems={cartItems}
                      removeFromCart={removeFromCart}
                      openCheckout={openCheckout}
                    />
                  </>
                )}
                <AnimatePresence>
                  {isCheckoutOpen && (
                    <Checkout cartItems={cartItems} onClose={closeCheckout} />
                  )}
                </AnimatePresence>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;