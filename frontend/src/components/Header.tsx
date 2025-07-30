import React from 'react';
import logo from '../assets/11842.png'; 
import { motion } from 'framer-motion';

interface HeaderProps {
  resetLocation: () => void;
}

const Header: React.FC<HeaderProps> = ({ resetLocation }) => {
  return (
    <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: 'url(https://images6.guiadohamburguer.com/fotos/512-micro-hamburgueria/01-entrada-micro-hamburgueria.jpg)' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2"
      >
        <img
          src={logo}
          alt="Logo"
          className="w-35 h-35 rounded-full border-4  border-yellow shadow-xl"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-2xl font-bold text-white text-center"
        >
          Burger House
        </motion.h1>
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