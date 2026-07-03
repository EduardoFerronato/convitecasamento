export const weddingConfig = {
  couple: {
    bride: "Anna",
    groom: "Eduardo",
    hashtag: "#AnnaEEduardo",
  },

  weddingDate: "2026-09-12T16:00:00-04:00",
  rsvpDeadline: "2026-08-31T23:59:59-04:00",

  invitation: {
    subtitle: "Temos a honra de convidar você para celebrar",
  },

  countdown: {
    phrase: "até nos tornarmos um só",
  },

  events: [
    {
      title: "Cerimônia",
      time: "16:00",
      location: "Chácara do Abreu",
      address: "Sinop — MT",
      mapUrl: "https://www.google.com/maps/search/Ch%C3%A1cara+do+Abreu+Sinop+MT",
    },
  ],

  story: {
    title: "Nossa História",
    label: "Nossa Jornada",
    chapters: [
      {
        year: "2018",
        title: "O Primeiro Olhar",
        text: "Nos conhecemos em um café da tarde entre amigos. Uma conversa sobre livros se transformou em horas de risadas e, sem perceber, já estávamos planejando o próximo encontro.",
      },
      {
        year: "2020",
        title: "A Mudança",
        text: "Em uma viagem à beira-mar, sob um céu estrelado, Eduardo pediu Anna em casamento. Entre lágrimas de alegria e abraços apertados, dissemos sim ao nosso futuro juntos.",
      },
      {
        year: "2023",
        title: "Construindo Sonhos",
        text: "Juntos, construímos nosso lar e compartilhamos sonhos, planos e risadas. Cada dia reafirmou que éramos feitos um para o outro.",
      },
      {
        year: "2026",
        title: "Para Sempre",
        text: "O dia em que diremos 'sim' diante de todos que amamos. O começo de um novo capítulo.",
        isFinal: true,
      },
    ],
  },

  gifts: {
    title: "Lista de Presentes",
    label: "Presentes",
    subtitle:
      "Sua presença é o maior presente. Mas se desejar nos presentear, aqui estão algumas sugestões.",
    items: [
      {
        name: "Jogo de Cama King",
        category: "Quarto",
        price: "R$ 450",
        link: "https://example.com/presente-1",
      },
      {
        name: "Aspirador Robô",
        category: "Casa",
        price: "R$ 890",
        link: "https://example.com/presente-2",
      },
      {
        name: "Jogo de Panelas",
        category: "Cozinha",
        price: "R$ 520",
        link: "https://example.com/presente-3",
      },
      {
        name: "Conjunto de Taças",
        category: "Casa",
        price: "R$ 280",
        link: "https://example.com/presente-4",
      },
      {
        name: "Máquina de Café",
        category: "Cozinha",
        price: "R$ 650",
        link: "https://example.com/presente-5",
      },
      {
        name: "Lua de Mel",
        category: "Experiência",
        price: "Valor livre",
        link: "https://example.com/presente-6",
      },
      {
        name: "Jogo de Toalhas",
        category: "Quarto",
        price: "R$ 320",
        link: "https://example.com/presente-7",
      },
      {
        name: "Liquidificador Premium",
        category: "Cozinha",
        price: "R$ 380",
        link: "https://example.com/presente-8",
      },
    ],
  },

  rsvp: {
    title: "Confirme sua Presença",
    label: "RSVP",
    successMessage: "Obrigado! Sua confirmação foi registrada com sucesso.",
  },
};

export type WeddingConfig = typeof weddingConfig;
