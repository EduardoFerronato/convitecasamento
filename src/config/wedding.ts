export const weddingConfig = {
  couple: {
    bride: "Anna",
    groom: "Eduardo",
    hashtag: "#AnnaEEduardo",
  },

  weddingDate: "2026-09-12T16:00:00-04:00",
  rsvpDeadline: "2026-08-31T23:59:59-04:00",

  invitation: {
    subtitle: "Temos a honra de convidar você para celebrar o nosso casamento",
  },

  countdown: {
    phrase: "até o grande dia",
  },

  events: [
    {
      title: "Cerimônia",
      time: "17:00",
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
        year: "Fev 2025",
        title: "Primeiro olhar",
        text: "Nos vimos pela primeira vez jogando truco. Desde então, não parava de olhar para ela.",
      },
      {
        year: "Set 2025",
        title: "O reencontro",
        text: "Meses depois, nos encontramos de novo na loja de um amigo na faculdade. Ela me chamou para o aniversário dela, e dali em diante não nos desgrudamos mais.",
      },
      {
        year: "2025–2026",
        title: "Nossos passos",
        text: "Namoro em 05/11/2025, noivado em 08/02/2026 e casamento civil em 26/06/2026. Cada data, um sim a mais.",
      },
      {
        year: "Set 2026",
        title: "Nossa celebração",
        text: "Agora convidamos vocês para celebrar conosco o dia em que unimos nossas vidas.",
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
        price: "R$ 1300",
        link: "https://www.mercadolivre.com.br/rob-aspirador-xiaomi-s40-inteligente-aspira-passa-pano-app-branco/p/MLB62162344?pdp_filters=item_id%3AMLB7087930772&matt_tool=38524122&ua=hMOgIaROlbb3uF1cJmYkYpgrWUQ8fxyk85Kys7kPbnxYuK4#origin=share&sid=share&wid=MLB7087930772&action=copy",
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
    honeymoon: {
      title: "Lua de Mel",
      label: "Contribuição especial",
      description:
        "Nossa lua de mel é um sonho que todos podem ajudar a realizar. Não há valor fixo — cada contribuição, do tamanho que for, faz diferença para nós.",
      buttonLabel: "Quero contribuir",
      pixKey: "00000000000",
      pixKeyLabel: "Chave Pix (CPF)",
      qrCodeImage: "/images/pix-qrcode.svg",
    },
  },

  rsvp: {
    title: "Confirme sua Presença",
    label: "RSVP",
    successMessage: "Obrigado! Sua confirmação foi registrada com sucesso.",
  },
};

export type WeddingConfig = typeof weddingConfig;
