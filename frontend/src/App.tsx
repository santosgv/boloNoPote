import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import StateSelector from './components/StateSelector';
import Header from './components/Header';
import Menu from './components/Menu';
import Promotions from './components/Promotions';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Toast from './components/Toast';
import { mockPromotions } from './data/mockData';
import type { CartItem, Product,Category } from './types';
import { AnimatePresence } from 'framer-motion';

// Configure axios to send cookies for CSRF
axios.defaults.withCredentials = true;

const App: React.FC = () => {
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize session_id from localStorage or generate new
    let storedSessionId = localStorage.getItem('cart_session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('cart_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    const savedState = localStorage.getItem('selectedState');
    const savedCity = localStorage.getItem('selectedCity');
    if (savedState && savedCity) {
      setIsStateSelected(true);
    }

    // Fetch CSRF token
    axios.get('http://localhost:8000/api/csrf/')
      .then(() => {
        console.log('CSRF cookie set'); // Debug

        // Fetch categories
        axios.get('http://localhost:8000/api/categories/')
          .then((response) => setCategories(response.data))
          .catch((error) => console.error('Erro ao buscar categorias:', error));

        // Fetch products
        axios.get('http://localhost:8000/api/products/')
          .then((response) => setProducts(response.data))
          .catch((error) => console.error('Erro ao buscar produtos:', error));

        // Fetch cart items
        axios.get(`http://localhost:8000/api/cart/?session_id=${storedSessionId}`)
          .then((response) => setCartItems(response.data))
          .catch((error) => console.error('Erro ao buscar carrinho:', error));
      })
      .catch((error) => console.error('Erro ao buscar CSRF token:', error));
  }, []);

  const addToCart = async (product: Product) => {
    if (!sessionId) return;
    try {
      const csrfToken = Cookies.get('csrftoken') || '';
      console.log('Adding to cart, session_id:', sessionId); // Debug
      const response = await axios.post(
        'http://localhost:8000/api/cart/',
        { product_id: product.id, quantity: 1, session_id: sessionId },
        { headers: { 'X-CSRFToken': csrfToken } }
      );
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.product.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, response.data.data];
      });
      // Update session_id if returned (in case backend generates new)
      if (response.data.session_id) {
        setSessionId(response.data.session_id);
        localStorage.setItem('cart_session_id', response.data.session_id);
      }
      setToast({
        message: `Produto ${product.name} adicionado ao carrinho!`,
        id: Date.now(),
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      setToast({
        message: 'Erro ao adicionar o produto ao carrinho.',
        id: Date.now(),
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!sessionId) return;
    try {
      const csrfToken = Cookies.get('csrftoken') || '';
      console.log('Removing from cart, session_id:', sessionId); // Debug
      await axios.delete(`http://localhost:8000/api/cart/${productId}/?session_id=${sessionId}`, {
        headers: { 'X-CSRFToken': csrfToken },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
      setToast({
        message: 'Produto removido do carrinho!',
        id: Date.now(),
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      setToast({
        message: 'Erro ao remover o produto do carrinho.',
        id: Date.Now(),
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleStateSelect = (state: string, city: string) => {
    setIsStateSelected(true);
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

  // Organize products by category, including uncategorized products
  const categorizedProducts = [
    ...categories.map((category) => ({
      ...category,
      products: products.filter((product) => product.category?.id === category.id),
    })),
    {
      id: 0,
      name: 'Sem Categoria',
      products: products.filter((product) => !product.category),
    },
  ].filter((category) => category.products.length > 0);
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
                    <Menu categories={categorizedProducts} addToCart={addToCart} />
                   {/*  <Promotions promotions={mockPromotions} addToCart={addToCart} /> */}
                    <Cart
                      cartItems={cartItems}
                      removeFromCart={removeFromCart}
                      openCheckout={openCheckout}
                    />
                  </>
                )}
                <AnimatePresence>
                  {isCheckoutOpen && (
                    <Checkout cartItems={cartItems} onClose={closeCheckout} sessionId={sessionId} />
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