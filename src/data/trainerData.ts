import { ServiceItem, TestimonialItem, TrainingExerciseItem, FaqItem } from '../types';
import { WHATSAPP_MESSAGES } from '../utils/whatsapp';

export const TRAINER_INFO = {
  name: 'João Victor Salvaia',
  brand: 'JV Salvaia Personal Trainer',
  cref: '173684-G/SP',
  experience: '7 Anos de Experiência',
  city: 'Jundiaí - SP',
  specialty: 'Hipertrofia & Biomecânica',
  headline: 'FAÇO DO SEU OBJETIVO A MINHA META.',
  subheadline:
    'Treinamento personalizado para quem quer treinar com estratégia, técnica e acompanhamento.',
  whatsappBadge: 'Resposta direta pelo WhatsApp',
  finalCtaHeadline: 'VAMOS TIRAR SEU OBJETIVO DO PAPEL?',
  finalCtaSubheadline:
    'Fale diretamente com João Victor e descubra o acompanhamento ideal para você.',
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'presencial',
    title: 'Personal Trainer Presencial',
    subtitle: 'Atendimento exclusivo em academias e condomínios',
    badge: 'Mais Procurado',
    recommended: true,
    description:
      'Atendimento exclusivo em academias e condomínios com estrutura fitness de Jundiaí e região.',
    highlights: [
      'Correção biomecânica',
      'Ajustes em tempo real',
      'Acompanhamento durante o treino',
    ],
    ctaText: 'QUERO TREINAR PRESENCIALMENTE',
    whatsappMessage: WHATSAPP_MESSAGES.presencial,
  },
  {
    id: 'online',
    title: 'Consultoria Online',
    subtitle: 'Planejamento individual e suporte direto',
    badge: '100% Individualizado',
    description:
      'Planejamento individualizado e suporte direto para você treinar com orientação mesmo à distância.',
    highlights: [
      'Treino personalizado',
      'Análise de execução',
      'Ajustes periódicos',
    ],
    ctaText: 'QUERO A CONSULTORIA ONLINE',
    whatsappMessage: WHATSAPP_MESSAGES.online,
  },
  {
    id: 'avaliacao',
    title: 'Avaliação Física Minuciosa',
    subtitle: 'Mapeamento completo do seu ponto de partida',
    badge: 'Diagnóstico Preciso',
    description:
      'Mapeamento completo para entender seu ponto de partida e definir metas.',
    highlights: [
      'Avaliação postural',
      'Medidas corporais',
      'Metas individualizadas',
    ],
    ctaText: 'QUERO AGENDAR',
    whatsappMessage: WHATSAPP_MESSAGES.avaliacao,
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: '1',
    name: 'Rodrigo Almeida',
    context: 'Aluno Presencial (Jundiaí - SP)',
    text: 'Treinava há 3 anos estagnado no mesmo peso e sentia desconforto no ombro no supino. O João Victor ajustou minha pegada e postura na primeira semana. Ganhei 4,5 kg de massa magra com total segurança.',
    result: '+4.5 kg de massa magra',
    rating: 5,
  },
  {
    id: '2',
    name: 'Matheus Silveira',
    context: 'Aluno Consultoria Online',
    text: 'A consultoria online do João Victor é extremamente profissional. O suporte no WhatsApp responde rápido e a análise dos vídeos de execução faz parecer que ele está do meu lado na academia.',
    result: '+35 kg no Leg Press',
    rating: 5,
  },
  {
    id: '3',
    name: 'Lucas Ferreira',
    context: 'Aluno Presencial (Jundiaí - SP)',
    text: "O lema 'Faço do seu objetivo a minha meta' é real. Ele cobra de verdade, não deixa você roubar na execução e ajusta cada detalhe do treino. Valeu cada centavo investido.",
    result: 'Redução de 6% de gordura e mais densidade muscular',
    rating: 5,
  },
  {
    id: '4',
    name: 'Rafael Mendes',
    context: 'Aluno Presencial (Condomínio em Jundiaí)',
    text: 'Treinar na academia do condomínio com o João foi a melhor decisão. Praticidade total, zero perda de tempo e uma intensidade com biomecânica que eu nunca conseguiria atingir sozinho.',
    result: '+5.2 kg de massa magra',
    rating: 5,
  },
  {
    id: '5',
    name: 'Gabriel Santos',
    context: 'Aluno Consultoria Online',
    text: 'Tinha muita dificuldade em desenvolver peitoral e braços. Com a periodização progressiva do João Victor, em 4 meses tive mais resultados do que em 2 anos treinando com ficha padrão de academia.',
    result: 'Braço: de 36cm para 39.5cm',
    rating: 5,
  },
  {
    id: '6',
    name: 'Felipe Zanin',
    context: 'Aluno Presencial (Jundiaí - SP)',
    text: 'Técnica apurada e feedback cirúrgico. As correções de postura e o controle de cadência nas repetições mudaram completamente a densidade das minhas costas com zero dor articular.',
    result: '+28 kg no Agachamento Livre',
    rating: 5,
  },
];

export const TRAINING_EXERCISES_DATA: TrainingExerciseItem[] = [
  {
    id: 'hack-squat',
    title: 'Exercício no Hack Squat',
    photoUrl: '/Exercício no Hack Squat.JPG',
    fallbackPhotoUrl: '/exercicio-no-hack-squat.jpg',
    instagramUrl: 'https://www.instagram.com/reel/DY5eVLaJbUJ/',
    tag: 'Biomecânica de Pernas',
    description:
      'Posicionamento de pés, amplitude profunda e controle de cadência para máximo recrutamento de quadríceps.',
  },
  {
    id: 'triceps-coice',
    title: 'Tríceps Coice na Polia Unilateral',
    photoUrl: '/Tríceps COICE na polia unilateral.JPG',
    fallbackPhotoUrl: '/triceps-coice-na-polia-unilateral.jpg',
    instagramUrl: 'https://www.instagram.com/reel/DY2wWJOp3UF/',
    tag: 'Isolamento & Pico de Contração',
    description:
      'Alinhamento com o vetor de força do cabo para contração máxima da cabeça lateral do tríceps sem sobrecarga no ombro.',
  },
  {
    id: 'rosca-scott',
    title: 'Rosca Scott com Halteres',
    photoUrl: '/Rosca Scott com Halteres.JPG',
    fallbackPhotoUrl: '/rosca-scott-com-halteres.jpg',
    instagramUrl: 'https://www.instagram.com/reel/DXU5LJ8CXPR/',
    tag: 'Bíceps & Tensão Contínua',
    description:
      'Apoio firme no banco Scott eliminando qualquer balanço ou impulso para isolamento completo da musculatura do bíceps.',
  },
  {
    id: 'remada-livre',
    title: 'Remada Livre com Halteres',
    photoUrl: '/Remada livre com halteres.JPG',
    fallbackPhotoUrl: '/remada-livre-com-halteres.jpg',
    instagramUrl: 'https://www.instagram.com/reel/DXIDtOKCXd4/',
    tag: 'Dorsais & Densidade',
    description:
      'Depressão e retração escapular com cotovelo direcionado para trabalhar espessura e densidade da musculatura dorsal.',
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'Onde você atende presencialmente?',
    answer:
      'Atendo nas principais academias e estúdios de Jundiaí e região, além de condomínios residenciais que possuam estrutura fitness.',
  },
  {
    question: 'Nunca treinei com personal. Posso começar?',
    answer:
      'Com certeza. O acompanhamento é 100% individualizado para você aprender a técnica correta desde o início com total segurança.',
  },
  {
    question: 'Como funciona a consultoria online?',
    answer:
      'Você recebe seu planejamento individualizado, envia vídeos da execução para análise detalhada e conta com suporte direto no WhatsApp para dúvidas e ajustes contínuos.',
  },
  {
    question: 'A avaliação física é obrigatória?',
    answer:
      'Não é obrigatória, mas é fortemente recomendada para mapear desbalanços, medidas corporais e definir metas com precisão.',
  },
  {
    question: 'Como faço para começar?',
    answer:
      'Basta clicar em qualquer botão do WhatsApp no site para falar diretamente comigo e combinarmos o formato ideal para você.',
  },
];
