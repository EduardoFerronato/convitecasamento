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
        title: "Mesa de truco",
        text: "Nos conhecemos em fevereiro, à mesa de um bar para jogar truco. Foi a primeira vez que nos vimos — jogamos, rimos, e naquele dia não rolou nada a mais. Mas, a partir dali, eu não parava de olhar para ela, encantado.",
      },
      {
        year: "Set 2025",
        title: "O reencontro",
        text: "Só em setembro nos reencontramos de novo, na loja de um amigo dentro da faculdade, na semana do aniversário dela — dia 20 de setembro. Ver Anna depois de alguns meses fez meu olho brilhar outra vez. Entre conversa e brincadeira, ela me chamou para o aniversário dela no bar.",
      },
      {
        year: "Set 2025",
        title: "O aniversário",
        text: "Na festa, com a celebração no ar, começamos a conversar de verdade. Eu nem pensava em relacionamento na época — mas do dia do aniversário dela até hoje não nos desgrudamos mais. Sempre juntos, fazendo tudo a dois.",
      },
      {
        year: "05 Nov 2025",
        title: "Pedido de namoro",
        text: "No dia 5 de novembro, oficializamos o que já sentíamos: um pediu o outro em namoro, e dissemos sim ao começo de tudo.",
      },
      {
        year: "08 Fev 2026",
        title: "O noivado",
        text: "Em 8 de fevereiro, com o coração cheio, veio o pedido de noivado — mais um passo na construção do nosso futuro.",
      },
      {
        year: "26 Jun 2026",
        title: "Casamento civil",
        text: "No dia 26 de junho, diante da lei e do nosso amor, nos casamos no civil. Já éramos um do outro; naquele dia, o papel confirmou o que a gente já sabia.",
      },
      {
        year: "Set 2026",
        title: "Nossa celebração",
        text: "Agora, em setembro, convidamos todos que amamos para celebrar conosco este novo capítulo — o dia em que unimos nossas vidas diante de vocês.",
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
