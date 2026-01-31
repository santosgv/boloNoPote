import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { API_BASE } from './config'; // Sua instância configurada do Axios
import { FaMoneyBillWave, FaShoppingBasket, FaMapMarkerAlt } from 'react-icons/fa';

// Tipagem dos dados
interface StatsData {
  total_vendas: number;
  ticket_medio: number;
  top_produtos: { name: string; vendas: number }[];
  top_bairros: { bairro: string; pedidos: number }[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get(API_BASE +'/api/z_admin/');
        setStats(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return <div className="p-8 text-center text-burger-yellow">Carregando Dashboard...</div>;
  }

  // Cores personalizadas para o tema Burger
  const COLORS = ['#F2994A', '#EB5757', '#F2C94C', '#27AE60', '#2D9CDB'];

  return (
    <div className="p-6 bg-burger-dark min-h-screen">
      <h1 className="text-3xl font-bold text-burger-yellow mb-8">Painel de Performance</h1>

      {/* Grid de Metricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl border-l-4 border-burger-yellow shadow-lg">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave className="text-3xl text-burger-yellow" />
            <div>
              <p className="text-gray-400 text-sm">Ticket Médio</p>
              <h2 className="text-2xl font-bold text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.ticket_medio)}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border-l-4 border-burger-orange shadow-lg">
          <div className="flex items-center gap-4">
            <FaShoppingBasket className="text-3xl text-burger-orange" />
            <div>
              <p className="text-gray-400 text-sm">Total de Pedidos Entregues</p>
              <h2 className="text-2xl font-bold text-white">{stats.total_vendas}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico de Produtos */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
             Top 5 Produtos mais Vendidos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_produtos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#ccc" width={100} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#F2C94C' }}
                />
                <Bar dataKey="vendas" radius={[0, 4, 4, 0]}>
                  {stats.top_produtos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Bairros */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-burger-yellow" /> Bairros mais Atendidos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_bairros}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="bairro" stroke="#ccc" fontSize={12} />
                <YAxis stroke="#ccc" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#F2994A' }}
                />
                <Bar dataKey="pedidos" fill="#F2994A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;