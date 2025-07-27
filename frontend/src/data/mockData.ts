

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

