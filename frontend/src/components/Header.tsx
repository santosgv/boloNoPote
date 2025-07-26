import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  resetLocation: () => void;
}

const Header: React.FC<HeaderProps> = ({ resetLocation }) => {
  return (
    <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550547660-d9450f859349)' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2"
      >
        <img
          src="https://cdn.pixabay.com/photo/2014/07/15/13/36/coffee-shop-393954_1280.jpg"
          alt="Logo"
          className="w-32 h-32 rounded-full border-4 border-burger-yellow shadow-xl"
        />
      </motion.div>
      <button
        onClick={resetLocation}
        className="absolute top-4 right-4 px-4 py-2 bg-burger-red text-white rounded-lg hover:bg-burger-yellow hover:text-burger-dark transition-colors"
      >
        Alterar Localização
      </button>
    </div>
  );
};

export default Header;