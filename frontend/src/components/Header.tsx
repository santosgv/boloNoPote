import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface HeaderProps {
  resetLocation: () => void;
}

const Header: React.FC<HeaderProps> = ({ resetLocation }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://168.231.93.112/api/branding/?key=padrao')
      .then(response => {
        setLogoUrl(response.data.logo_url);
        setBackgroundUrl(response.data.background_url);
      })
      .catch(error => {
        console.error('Erro ao carregar branding:', error);
      });
  }, []);

  return (
    <div
      className="relative w-full h-64 bg-cover bg-center"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
      }}
    >
      {logoUrl && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2"
        >
          <img
            src={logoUrl}
            alt="Logo"
            className="w-35 h-35 rounded-full border-4 border-yellow shadow-xl"
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
      )}

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
