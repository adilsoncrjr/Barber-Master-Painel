export const landingContent = {
  header: {
    logo: "TRIVOR",
    links: [
      { href: "#planos", label: "Planos" },
      { href: "/areadocliente", label: "Área do Cliente" },
      { href: "/login", label: "Entrar no App" },
    ],
    cta: {
      href: "/cadastro",
      label: "Criar minha barbearia",
    },
  },
  hero: {
    eyebrow: "Sistema premium para barbearias modernas",
    title: "Organize sua barbearia com um sistema feito para barbeiros.",
    subtitle: "Agenda, clientes, planos mensais e relatórios em um único painel.",
    primaryCta: {
      href: "/cadastro",
      label: "Criar minha barbearia agora",
    },
    secondaryCta: {
      href: "#como-funciona",
      label: "Ver como funciona",
    },
  },
  problem: {
    title: "Barbearias precisam de organização.",
    items: [
      "Agenda bagunçada",
      "Faltas de clientes",
      "Horários vazios",
      "Pouco controle financeiro",
    ],
    closing: "O TRIVOR resolve isso em um único sistema.",
  },
  product: {
    title: "Seu painel completo em foco.",
    subtitle: "O TRIVOR foi desenhado para deixar o dia a dia da barbearia mais simples, previsível e profissional.",
    blocks: [
      {
        id: "agenda",
        title: "Agenda inteligente",
        description: "Organize horários e visualize sua agenda com clareza.",
        imageKey: "agenda",
      },
      {
        id: "clients",
        title: "Controle de clientes",
        description: "Acompanhe frequência, histórico e relacionamento.",
        imageKey: "clients",
      },
      {
        id: "controls",
        title: "Gestão completa",
        description: "Configure regras de agenda, cancelamentos e bloqueios.",
        imageKey: "controls",
      },
      {
        id: "dashboard",
        title: "Painel da barbearia",
        description: "Veja faturamento, horários livres e desempenho.",
        imageKey: "dashboard",
      },
    ],
  },
  features: {
    title: "Tudo que sua barbearia precisa.",
    subtitle: "Recursos essenciais, sem complicação.",
    items: [
      {
        key: "agenda",
        title: "Agenda",
        description: "Horários claros, bloqueios e fila de espera.",
      },
      {
        key: "clients",
        title: "Clientes",
        description: "Cadastro completo e histórico de visitas.",
      },
      {
        key: "plans",
        title: "Planos",
        description: "Planos mensais com recorrência organizada.",
      },
      {
        key: "reports",
        title: "Relatórios",
        description: "Indicadores simples para decisões melhores.",
      },
      {
        key: "automations",
        title: "Automações",
        description: "Lembretes, confirmações e avisos automáticos.",
      },
      {
        key: "no-shows",
        title: "Controle de faltas",
        description: "Políticas claras e mais compromisso.",
      },
    ],
  },
  howItWorks: {
    id: "como-funciona",
    title: "Comece em poucos minutos.",
    subtitle: "Sem burocracia, sem complicação.",
    steps: [
      {
        step: 1,
        title: "Crie sua conta",
        description: "Defina seu acesso ao painel TRIVOR.",
      },
      {
        step: 2,
        title: "Cadastre sua barbearia",
        description: "Inclua os dados principais do negócio.",
      },
      {
        step: 3,
        title: "Comece a usar",
        description: "Configure agenda, planos e clientes.",
      },
    ],
  },
  finalCta: {
    title: "Pronto para profissionalizar sua barbearia?",
    subtitle: "Leva menos de 2 minutos para começar.",
    primaryCta: {
      href: "/cadastro",
      label: "Criar minha barbearia agora",
    },
  },
} as const;

