import type { Category, Product } from '../types';

export const citiesByState: { [key: string]: string[] } = {
  AC: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
  AL: ['Maceió', 'Arapiraca', 'Palmeira dos Índios'],
  AP: ['Macapá', 'Santana', 'Laranjal do Jari'],
  AM: ['Manaus', 'Parintins', 'Itacoatiara'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  CE: ['Fortaleza', 'Juazeiro do Norte', 'Caucaia'],
  DF: ['Brasília', 'Taguatinga', 'Ceilândia'],
  ES: ['Vitória', 'Vila Velha', 'Serra'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'],
  MA: ['São Luís', 'Imperatriz', 'Caxias'],
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis'],
  MS: ['Campo Grande', 'Dourados', 'Três Lagoas'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Ribeirão das Neves'],
  PA: ['Belém', 'Ananindeua', 'Santarém'],
  PB: ['João Pessoa', 'Campina Grande', 'Santa Rita'],
  PR: ['Curitiba', 'Londrina', 'Maringá'],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda'],
  PI: ['Teresina', 'Parnaíba', 'Picos'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias'],
  RN: ['Natal', 'Mossoró', 'Parnamirim'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
  RO: ['Porto Velho', 'Ji-Paraná', 'Ariquemes'],
  RR: ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau'],
  SP: ['São Paulo', 'Campinas', 'Santo André'],
  SE: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto'],
  TO: ['Palmas', 'Araguaína', 'Gurupi'],
};

// Função para gerar distância e estimativa de entrega aleatórias
export const generateRandomDeliveryInfo = () => {
  const distance = (Math.random() * 9 + 1).toFixed(1); // 1 a 10 km
  const minTime = Math.floor(Math.random() * 41) + 10; // 10 a 50 min
  const maxTime = Math.min(minTime + Math.floor(Math.random() * 20) + 10, 50); // Máximo 50 min
  return { distance, minTime, maxTime };
};


export const mockCategories: Category[] = [
  {
    id: 'hamburgers',
    name: 'Hambúrgueres',
    icon: 'FaHamburger',
    products: [
      {
        id: 1,
        name: 'Burger Clássico',
        description: 'Pão brioche, carne 180g, queijo cheddar, alface, tomate e maionese artesanal.',
        price: 29.90,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      },
      {
        id: 2,
        name: 'Burger BBQ',
        description: 'Pão australiano, carne 180g, bacon, molho BBQ e cebola caramelizada.',
        price: 34.90,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
      },
    ],
  },
  {
    id: 'drinks',
    name: 'Bebidas',
    icon: 'FaCocktail',
    products: [
      {
        id: 3,
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Sprite ou Guaraná 350ml.',
        price: 6.90,
        image: 'https://cdn.pixabay.com/photo/2019/08/13/20/02/coca-cola-4404130_1280.jpg',
      },
            {
        id: 4,
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Sprite ou Guaraná 350ml.',
        price: 6.90,
        image: 'https://cdn.pixabay.com/photo/2019/08/13/20/02/coca-cola-4404130_1280.jpg',
      },
            {
        id: 5,
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Sprite ou Guaraná 350ml.',
        price: 6.90,
        image: 'https://cdn.pixabay.com/photo/2019/08/13/20/02/coca-cola-4404130_1280.jpg',
      },
    ],
  },
  {
    id: 'sides',
    name: 'Porções',
    icon: 'FaPizzaSlice',
    products: [
      {
        id: 6,
        name: 'Batata Frita',
        description: 'Porção de batata frita crocante 200g.',
        price: 15.90,
        image: 'https://cdn.pixabay.com/photo/2013/12/11/08/35/food-226773_1280.jpg',
      },
    ],
  },
];

export const mockPromotions: Product[] = [
  {
    id: 7,
    name: 'Combo do Dia',
    description: 'Burger Clássico + Batata Frita + Refrigerante.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
  },
];