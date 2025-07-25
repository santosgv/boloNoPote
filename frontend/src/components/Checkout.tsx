import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { CartItem, Address } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems }) => {
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você integrará com o backend Django para enviar o endereço e gerar o Pix
    console.log('Endereço:', address);
    console.log('Itens do carrinho:', cartItems);
  };

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-burger-dark p-8 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold text-burger-yellow mb-6 text-center">Finalizar Compra</h2>

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
        </form>

        {/* Seção de Pagamento via Pix */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-burger-orange mb-2">Pagamento via Pix</h3>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-300">
              Integração com Pix será implementada no backend Django.
            </p>
            <p className="text-gray-300 mt-2">
              Após preencher o endereço, clique em "Confirmar Pedido" para gerar o QR code.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between">
          <Link
            to="/"
            className="px-4 py-2 bg-burger-red text-white rounded-lg hover:bg-burger-yellow hover:text-burger-dark transition-colors"
          >
            Voltar
          </Link>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-burger-yellow text-burger-dark rounded-lg hover:bg-burger-red hover:text-white transition-colors"
          >
            Confirmar Pedido
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;