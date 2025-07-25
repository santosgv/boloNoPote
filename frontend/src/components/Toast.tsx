import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center max-w-xs"
    >
      <FaCheckCircle className="text-xl mr-2" />
      <p className="text-sm font-semibold">{message}</p>
    </motion.div>
  );
};

export default Toast;