export interface EventItem {
  id: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  date?: string;
  time: string;
  isRecurring: boolean;
  recurringPattern?: string;
  ticketUrl?: string;
  image?: string;
}

export const events: EventItem[] = [
  // Recurring
  {
    id: 'r1',
    title: { fr: 'Les Lundis de l’Humour', en: 'Comedy Mondays' },
    description: {
      fr: 'Chaque semaine, une sélection d’humoristes francophones testent du nouveau matériel dans une ambiance décontractée.',
      en: 'Each week features a lineup of francophone comedians trying out new material in a fun, casual setting.',
    },
    time: '20:00',
    isRecurring: true,
    recurringPattern: 'Chaque lundi / Every Monday',
  },
  {
    id: 'r2',
    title: { fr: 'Mercredi Jockey Open-Mic', en: 'Wednesday Jockey Open-Mic' },
    description: {
      fr: 'Soirée open-mic pour les humoristes émergents. Inscriptions vers 19h15.',
      en: 'Open-mic comedy night for emerging comedians. Sign-up starts around 7:15 PM.',
    },
    time: '20:00',
    isRecurring: true,
    recurringPattern: 'Chaque mercredi / Every Wednesday',
  },
  {
    id: 'r3',
    title: { fr: 'Les Dimanches du Conte', en: 'Storytelling Sundays' },
    description: {
      fr: 'Des conteurs talentueux racontent des histoires – du comique au poignant – dans une ambiance chaleureuse.',
      en: 'Talented storytellers narrate tales – from comedic to poignant – in a cozy setting.',
    },
    time: '19:30',
    isRecurring: true,
    recurringPattern: 'Chaque dimanche / Every Sunday',
  },
  {
    id: 'r4',
    title: { fr: 'Vendredis Musique Latine', en: 'Latin Music Fridays' },
    description: {
      fr: 'Le Jockey se transforme en piste de danse avec de la musique latine (salsa, reggaeton) et un DJ.',
      en: 'Le Jockey transforms into a dance party with Latin music (salsa, reggaeton) and a DJ.',
    },
    time: '22:00',
    isRecurring: true,
    recurringPattern: 'Chaque vendredi / Every Friday',
  },

  // Special Events
  {
    id: 's1',
    title: { fr: 'Ladyfest Présente: Debout.tes/Stand-Up', en: 'Ladyfest Presents: Debout.tes/Stand-Up' },
    description: {
      fr: 'Une soirée d’humour féministe bilingue, dans le cadre du Ladyfest Montréal.',
      en: 'A one-night feminist bilingual comedy show, part of Ladyfest Montréal.',
    },
    date: '2025-11-28',
    time: '20:00',
    isRecurring: false,
  },
  {
    id: 's2',
    title: { fr: 'Histoire Comédie Club – 5e édition', en: 'History Comedy Club – 5th edition' },
    description: {
      fr: 'Cinq humoristes passionnés d’histoire partagent des numéros remplis de blagues sur des événements historiques.',
      en: 'Five comedians passionate about history share stand-up sets full of jokes on historical events.',
    },
    date: '2025-11-29',
    time: '20:00',
    isRecurring: false,
  },
  {
    id: 's3',
    title: { fr: 'L’enfant, le perdu et la fille', en: 'L’enfant, le perdu et la fille' },
    description: {
      fr: 'Une heure de stand-up avec Delphine Lestage Archambault, Thomas Freitas-Bourassa et Justin D. Gélinas.',
      en: 'A one-hour stand-up comedy showcase featuring three up-and-coming comedians.',
    },
    date: '2025-12-04',
    time: '20:00',
    isRecurring: false,
  },
  {
    id: 's4',
    title: { fr: 'Le WOW Show #11 avec Émilie Ouellette', en: 'The WOW Show #11 with Émilie Ouellette' },
    description: {
      fr: 'Spectacle de variétés humoristiques animé par Émilie Ouellette. Ambiance open-mic interactive.',
      en: 'A recurring comedy variety show hosted by Émilie Ouellette. Interactive open-mic vibe.',
    },
    date: '2025-12-05',
    time: '20:00',
    isRecurring: false,
  },
  {
    id: 's5',
    title: { fr: 'Devenez maître de l’univers en 6 présentations PowerPoint', en: 'Become Master of the Universe in 6 PowerPoint Presentations' },
    description: {
      fr: 'Six humoristes donnent des présentations PowerPoint sur des sujets farfelus.',
      en: 'Six comedians give PowerPoint presentations on outrageous topics.',
    },
    date: '2025-12-16',
    time: '20:00',
    isRecurring: false,
  },
  {
    id: 's6',
    title: { fr: 'Le Dating Show (25–40 ans)', en: 'The Dating Show (25–40 years)' },
    description: {
      fr: 'Un jeu de rencontre interactif en direct animé par Charlie Morin, conçu pour les célibataires de 25 à 40 ans.',
      en: 'An interactive live dating game show hosted by Charlie Morin, designed for singles ages 25–40.',
    },
    date: '2026-01-30',
    time: '19:30',
    isRecurring: false,
  },
];
