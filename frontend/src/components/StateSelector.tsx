import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { citiesByState, generateRandomDeliveryInfo } from '../data/mockData';

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

interface StateSelectorProps {
  onSelect: (state: string, city: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ onSelect }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocated, setIsLocated] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    distance: string;
    minTime: number;
    maxTime: number;
  } | null>(null);

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity(''); // Reseta a cidade ao mudar o estado
    setIsLocated(false);
    setDeliveryInfo(null);
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    setIsLoading(true);

    // Simula busca por 3 segundos
    setTimeout(() => {
      setIsLoading(false);
      setIsLocated(true);
      setDeliveryInfo(generateRandomDeliveryInfo());
      // Salva estado e cidade no localStorage
      localStorage.setItem('selectedState', selectedState);
      localStorage.setItem('selectedCity', city);
      // Mostra mensagem de "Unidade localizada" por 1 segundo antes de abrir o cardápio
      setTimeout(() => {
        onSelect(selectedState, city);
      }, 3000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-burger-dark p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <FaSpinner className="animate-spin text-4xl text-burger-yellow mb-4" />
              <p className="text-xl text-burger-yellow">Procurando unidades próximas...</p>
            </motion.div>
          ) : isLocated && deliveryInfo ? (
            <motion.div
              key="located"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xl text-burger-yellow">
                Foi encontrada uma unidade a {deliveryInfo.distance}km em {selectedCity}, estimativa
                de entrega de {deliveryInfo.minTime} a {deliveryInfo.maxTime} min.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text enfants3xl font-bold mb-6 text-burger-yellow">Onde você está?</h2>
              <select
                value={selectedState}
                onChange={handleStateSelect}
                className="w-full p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow mb-4"
              >
                <option value="" disabled>
                  Escolha um estado
                </option>
                {brazilianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {selectedState && (
                <select
                  value={selectedCity}
                  onChange={handleCitySelect}
                  className="w-full p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow"
                >
                  <option value="" disabled>
                    Escolha uma cidade
                  </option>
                  {citiesByState[selectedState]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StateSelector;