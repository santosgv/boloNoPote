import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { CartItem, Address } from '../types';
import {QRCodeSVG} from 'qrcode.react';

interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  sessionId: string | null;
}


const Checkout: React.FC<CheckoutProps> = ({ cartItems, onClose, sessionId }) => {
  const selectedCity = localStorage.getItem('selectedCity');
  const selectedState = localStorage.getItem('selectedState');
  const [brcode, setBrcode] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(30); // 2 minutos
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    neighborhood: '',
    city: selectedCity || '',
    state: selectedState || '',
    zipCode: '',
  });

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };


  const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      alert('Texto copiado para a área de transferência!');
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
      alert('Falha ao copiar texto.');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      console.error('No session_id available');
      return;
    }
    try {
      const csrfToken = Cookies.get('csrftoken') || '';
      console.log('Creating order, session_id:', sessionId); // Debug
      const response = await axios.post(
        'http://localhost:8000/api/order/',
        {
          address: {
            street: address.street,
            number: address.number,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zip_code: address.zipCode,
          },
          total,
          session_id: sessionId,
        },
        { headers: { 'X-CSRFToken': csrfToken } }
      );
      console.log('Pedido criado:', response.data);
      window.location.assign("/");
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

    const gerarQrCodePix = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/gerar-pix/', {
      valor: total.toFixed(2),
      session_id: sessionId,
    });
    setBrcode(response.data.brcode);
  } catch (error) {
    console.error('Erro ao gerar QR Code PIX:', error);
  }
};


useEffect(() => {
  if (brcode && timer > 0) {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }
}, [brcode, timer]);

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];



  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gray-50 p-8 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-burger-yellow hover:text-burger-red"
          aria-label="Fechar modal"
        >
          <FaTimes className="text-xl" />
        </button>
        <h2 className="text-3xl font-bold text-burger-yellow mb-6 text-center">Finalizar Pedido</h2>

        {/* Resumo do Carrinho */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-burger-orange mb-2">Itens no Carrinho</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-300">Carrinho vazio</p>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between mb-2">
                  <p className="text-sm text-burger-yellow">
                    {item.product.name} x {item.quantity}
                  </p>
                  <p className="text-sm text-burger-orange">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <p className="text-lg font-bold text-burger-orange mt-2">
                Total: R$ {total.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Formulário de Endereço */}
        <div className='text-sm mb-4 text-center text-burger-yellow'>
        <label className="block mb-2 text-sm text-burger-yellow">Codigo de Rastreio:</label>
        <input type="text"
        className='w-full bg-slate-200 text-center pointer-events-none placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
        name='session_id'
        readOnly
        disabled
        value={sessionId || ''}
        />
        </div>
        <form onSubmit={handleSubmit} className="mb-6">
          <h3 className="text-xl font-semibold text-burger-orange mb-2">Endereço de Entrega</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleInputChange}
              placeholder="Rua"
              className="p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow"
              required
            />
            <input
              type="text"
              name="number"
              value={address.number}
              onChange={handleInputChange}
              placeholder="Número"
              className="p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow"
              required
            />
            <input
              type="text"
              name="neighborhood"
              value={address.neighborhood}
              onChange={handleInputChange}
              placeholder="Bairro"
              className="p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow"
              required
            />
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              placeholder="Cidade"
              className="p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow"
              required
            />
            <select
              name="state"
              value={address.state}
              onChange={handleInputChange}
              className="p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow"
              required
            >
              <option value="" disabled>
                Estado
              </option>
              {brazilianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={handleInputChange}
              placeholder="CEP"
              className="p-3 rounded-lg bg-white text-burger-dark focus:outline-none focus:ring-2 focus:ring-burger-yellow"
              required
            />
          </div>
          <br />
          {/* Seção de Pagamento via Pix */}
          {!brcode && (
            <button
              type="button"
              onClick={gerarQrCodePix}
              className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Gerar QR Code Pix
            </button>
          )}
{brcode && (
  <div className="flex flex-col items-center my-4 space-y-4">
    <QRCodeSVG value={brcode} size={256} />

    <div className="w-full max-w-md flex gap-2 items-center">
      <input
        type="text"
        value={brcode}
        readOnly
        className="flex-1 bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-md shadow-sm focus:outline-none"
      />
      <button
        type="button"
        onClick={() => copyToClipboard(brcode)}
        className="px-3 py-2 bg-sky-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
      >
              Copiar chave pix
            </button>
          </div>
        </div>
      )}
            <button
            type="submit"
            disabled={!brcode || timer > 0}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              !brcode || timer > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {timer > 0 ? `Aguardando pagamento (${timer}s)` : 'Confirmar Pedido'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};



export default Checkout;