import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();

  // ─── HISTOIRE ────────────────────────────────────────────────────────────────
  const histoire = await prisma.category.create({
    data: {
      name: 'Histoire',
      description: "L'histoire de la Côte d'Ivoire, de la colonisation à nos jours.",
      slug: 'histoire',
    },
  });

  // ─── GÉOGRAPHIE ──────────────────────────────────────────────────────────────
  const geographie = await prisma.category.create({
    data: {
      name: 'Géographie',
      description: "La géographie physique et humaine de la Côte d'Ivoire.",
      slug: 'geographie',
    },
  });

  // ─── CULTURE & TRADITIONS ────────────────────────────────────────────────────
  const culture = await prisma.category.create({
    data: {
      name: 'Culture & Traditions',
      description: "Les traditions, arts, gastronomie et cultures de la Côte d'Ivoire.",
      slug: 'culture',
    },
  });

  // ─── ÉCONOMIE ────────────────────────────────────────────────────────────────
  const economie = await prisma.category.create({
    data: {
      name: 'Économie',
      description: "L'économie et le développement de la Côte d'Ivoire.",
      slug: 'economie',
    },
  });

  // ─── SPORT ───────────────────────────────────────────────────────────────────
  const sport = await prisma.category.create({
    data: {
      name: 'Sport',
      description: "Le sport et les athlètes de la Côte d'Ivoire.",
      slug: 'sport',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // HISTOIRE QUESTIONS (10)
  // ─────────────────────────────────────────────────────────────────────────────
  await prisma.question.create({
    data: {
      text: "Qui était le premier président de la Côte d'Ivoire ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: 'Félix Houphouët-Boigny', isCorrect: true },
          { text: 'Alassane Ouattara', isCorrect: false },
          { text: 'Laurent Gbagbo', isCorrect: false },
          { text: 'Henri Konan Bédié', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "En quelle année la Côte d'Ivoire a-t-elle obtenu son indépendance ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: '1960', isCorrect: true },
          { text: '1958', isCorrect: false },
          { text: '1962', isCorrect: false },
          { text: '1955', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle était la première capitale coloniale de la Côte d'Ivoire ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: 'Grand-Bassam', isCorrect: true },
          { text: 'Abidjan', isCorrect: false },
          { text: 'Bouaké', isCorrect: false },
          { text: 'Yamoussoukro', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel pays a colonisé la Côte d'Ivoire ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: 'La France', isCorrect: true },
          { text: 'Le Royaume-Uni', isCorrect: false },
          { text: 'Le Portugal', isCorrect: false },
          { text: 'La Belgique', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle est la capitale officielle de la Côte d'Ivoire ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: 'Yamoussoukro', isCorrect: true },
          { text: 'Abidjan', isCorrect: false },
          { text: 'Bouaké', isCorrect: false },
          { text: 'Daloa', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Combien d'années Félix Houphouët-Boigny a-t-il dirigé la Côte d'Ivoire ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: '33 ans', isCorrect: true },
          { text: '25 ans', isCorrect: false },
          { text: '40 ans', isCorrect: false },
          { text: '20 ans', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel traité a officialisé la colonisation française de la Côte d'Ivoire ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: 'Traité de Paris (1889)', isCorrect: true },
          { text: 'Traité de Berlin', isCorrect: false },
          { text: 'Accord de Bruxelles', isCorrect: false },
          { text: "Traité d'Alger", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "En quelle année la première crise politico-militaire ivoirienne a-t-elle éclaté ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: '2002', isCorrect: true },
          { text: '1999', isCorrect: false },
          { text: '2005', isCorrect: false },
          { text: '2010', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Qui a succédé à Félix Houphouët-Boigny à la présidence ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: 'Henri Konan Bédié', isCorrect: true },
          { text: 'Alassane Ouattara', isCorrect: false },
          { text: 'Robert Guéï', isCorrect: false },
          { text: 'Laurent Gbagbo', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel est le nom du premier parti politique de la Côte d'Ivoire fondé par Houphouët-Boigny ?",
      categoryId: histoire.id,
      answers: {
        create: [
          { text: 'PDCI', isCorrect: true },
          { text: 'FPI', isCorrect: false },
          { text: 'RDR', isCorrect: false },
          { text: 'UDPCI', isCorrect: false },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GÉOGRAPHIE QUESTIONS (10)
  // ─────────────────────────────────────────────────────────────────────────────
  await prisma.question.create({
    data: {
      text: "Quelle est la plus grande ville de la Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: 'Abidjan', isCorrect: true },
          { text: 'Bouaké', isCorrect: false },
          { text: 'Yamoussoukro', isCorrect: false },
          { text: 'Korhogo', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Combien de pays frontaliers a la Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: '5', isCorrect: true },
          { text: '4', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '3', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel est le plus haut sommet de la Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: 'Mont Nimba', isCorrect: true },
          { text: 'Mont Tonkpi', isCorrect: false },
          { text: 'Massif du Man', isCorrect: false },
          { text: 'Pic de Fako', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel océan borde la Côte d'Ivoire au sud ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: 'Océan Atlantique', isCorrect: true },
          { text: 'Océan Indien', isCorrect: false },
          { text: 'Mer Méditerranée', isCorrect: false },
          { text: 'Golfe de Guinée seulement', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel fleuve est le plus long en Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: 'Le Bandama', isCorrect: true },
          { text: 'La Comoé', isCorrect: false },
          { text: 'Le Sassandra', isCorrect: false },
          { text: 'Le Cavally', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Dans quelle région se trouve la forêt du Banco ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: 'Abidjan', isCorrect: true },
          { text: 'Bouaké', isCorrect: false },
          { text: 'Man', isCorrect: false },
          { text: 'San-Pédro', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel pays se trouve à l'est de la Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: 'Le Ghana', isCorrect: true },
          { text: 'Le Libéria', isCorrect: false },
          { text: 'La Guinée', isCorrect: false },
          { text: 'Le Burkina Faso', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Combien de régions administratives compte la Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: '14', isCorrect: true },
          { text: '10', isCorrect: false },
          { text: '20', isCorrect: false },
          { text: '12', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle est la superficie approximative de la Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: '322 000 km²', isCorrect: true },
          { text: '200 000 km²', isCorrect: false },
          { text: '450 000 km²', isCorrect: false },
          { text: '150 000 km²', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel est le principal port de la Côte d'Ivoire ?",
      categoryId: geographie.id,
      answers: {
        create: [
          { text: "Port d'Abidjan", isCorrect: true },
          { text: 'Port de San-Pédro', isCorrect: false },
          { text: 'Port de Sassandra', isCorrect: false },
          { text: 'Port de Grand-Bassam', isCorrect: false },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // CULTURE & TRADITIONS QUESTIONS (10)
  // ─────────────────────────────────────────────────────────────────────────────
  await prisma.question.create({
    data: {
      text: "Quelle danse-masque ivoirien est inscrit au patrimoine immatériel de l'UNESCO ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Le Zaouli', isCorrect: true },
          { text: 'Le Gbégbé', isCorrect: false },
          { text: 'Le Goli', isCorrect: false },
          { text: 'Le Djimini', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle est l'ethnie la plus représentée en Côte d'Ivoire ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Les Akan', isCorrect: true },
          { text: 'Les Mandé', isCorrect: false },
          { text: 'Les Krou', isCorrect: false },
          { text: 'Les Gur', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle ville abrite la Basilique Notre-Dame de la Paix ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Yamoussoukro', isCorrect: true },
          { text: 'Abidjan', isCorrect: false },
          { text: 'Bouaké', isCorrect: false },
          { text: 'Assinie', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel tissu traditionnel ivoirien est fabriqué artisanalement ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Le Kita (tissu Baoulé)', isCorrect: true },
          { text: 'Le Kente', isCorrect: false },
          { text: 'Le Bogolan', isCorrect: false },
          { text: 'Le Pagne Ndalé', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel est le plat national ivoirien à base d'igname pilée ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Le Foutou', isCorrect: true },
          { text: "L'Attieke", isCorrect: false },
          { text: 'Le Bangui', isCorrect: false },
          { text: 'Le Kedjenou', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel mets est fait à base de semoule de manioc fermentée ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: "L'Attiéké", isCorrect: true },
          { text: 'Le Foutou', isCorrect: false },
          { text: 'Le Placali', isCorrect: false },
          { text: 'Le Dégué', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel groupe ethnique est réputé pour la sculpture de masques sacrés Guro ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Les Gouro', isCorrect: true },
          { text: 'Les Baoulé', isCorrect: false },
          { text: 'Les Sénoufo', isCorrect: false },
          { text: 'Les Bété', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle fête nationale est célébrée le 7 août en Côte d'Ivoire ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: "La Fête de l'Indépendance", isCorrect: true },
          { text: 'La Fête du Travail', isCorrect: false },
          { text: 'La Fête Nationale', isCorrect: false },
          { text: 'La Fête des Mères', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle langue est la langue officielle de la Côte d'Ivoire ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Le Français', isCorrect: true },
          { text: 'Le Dioula', isCorrect: false },
          { text: 'Le Baoulé', isCorrect: false },
          { text: 'Le Bété', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Dans quel style musical ivoirien Douk Saga a-t-il popularisé ?",
      categoryId: culture.id,
      answers: {
        create: [
          { text: 'Le Coupé-Décalé', isCorrect: true },
          { text: 'Le Zouglou', isCorrect: false },
          { text: 'Le Zoblazo', isCorrect: false },
          { text: "L'Afrobeats", isCorrect: false },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ÉCONOMIE QUESTIONS (10)
  // ─────────────────────────────────────────────────────────────────────────────
  await prisma.question.create({
    data: {
      text: "La Côte d'Ivoire est le premier producteur mondial de... ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'Cacao', isCorrect: true },
          { text: 'Café', isCorrect: false },
          { text: 'Coton', isCorrect: false },
          { text: 'Anacarde', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle est la monnaie officielle de la Côte d'Ivoire ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'Le Franc CFA', isCorrect: true },
          { text: 'Le Dollar ivoirien', isCorrect: false },
          { text: 'Le Franc ivoirien', isCorrect: false },
          { text: "L'Euro CEDEAO", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Dans quelle organisation économique régionale la Côte d'Ivoire est-elle membre ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'La CEDEAO', isCorrect: true },
          { text: "L'UEMOA seulement", isCorrect: false },
          { text: 'Le COMESA', isCorrect: false },
          { text: "L'IGAD", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel est le principal secteur d'exportation de la Côte d'Ivoire ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: "L'Agro-industrie", isCorrect: true },
          { text: "L'Industrie minière", isCorrect: false },
          { text: 'Le Tourisme', isCorrect: false },
          { text: 'Les TIC', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle est la bourse régionale des valeurs mobilières dont Abidjan est le siège ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'La BRVM', isCorrect: true },
          { text: 'La JSE', isCorrect: false },
          { text: 'La NASD', isCorrect: false },
          { text: 'La BVC', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle culture de rente est surnommée \"l'or brun\" en Côte d'Ivoire ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'Le Cacao', isCorrect: true },
          { text: 'Le Café', isCorrect: false },
          { text: "L'Hévéa", isCorrect: false },
          { text: 'La Banane', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel grand projet d'infrastructure relie Abidjan à Lagos ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'L\'Autoroute Abidjan-Lagos', isCorrect: true },
          { text: 'Le Train côtier', isCorrect: false },
          { text: 'Le Canal transafricain', isCorrect: false },
          { text: 'L\'Autoroute sahélienne', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel est le nom du plan économique ivoirien lancé en 2012 ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'Le Plan National de Développement (PND)', isCorrect: true },
          { text: 'Vision Côte d\'Ivoire 2025', isCorrect: false },
          { text: 'Plan Émergence 2030', isCorrect: false },
          { text: 'Agenda 2063 Côte d\'Ivoire', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quelle zone franche industrielle se trouve à Abidjan ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'La Zone Franche d\'Abidjan (GZAI)', isCorrect: true },
          { text: 'Zone Industrielle Yopougon', isCorrect: false },
          { text: 'Zone de Cocody', isCorrect: false },
          { text: 'Parc technologique de Bingerville', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "La Côte d'Ivoire est classée dans quel groupe selon la Banque Mondiale ?",
      categoryId: economie.id,
      answers: {
        create: [
          { text: 'Pays à revenu intermédiaire inférieur', isCorrect: true },
          { text: 'Pays pauvre très endetté', isCorrect: false },
          { text: 'Pays à revenu élevé', isCorrect: false },
          { text: 'Pays à revenu intermédiaire supérieur', isCorrect: false },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SPORT QUESTIONS (10)
  // ─────────────────────────────────────────────────────────────────────────────
  await prisma.question.create({
    data: {
      text: "En quelle année la Côte d'Ivoire a-t-elle remporté sa première Coupe d'Afrique des Nations (CAN) ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: '1992', isCorrect: true },
          { text: '1988', isCorrect: false },
          { text: '1996', isCorrect: false },
          { text: '2000', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel footballeur ivoirien est le meilleur buteur de l'histoire de la sélection nationale ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: 'Didier Drogba', isCorrect: true },
          { text: 'Yaya Touré', isCorrect: false },
          { text: 'Didier Zokora', isCorrect: false },
          { text: 'Salomon Kalou', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Combien de fois la Côte d'Ivoire a-t-elle remporté la CAN jusqu'en 2024 ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: '3 fois', isCorrect: true },
          { text: '2 fois', isCorrect: false },
          { text: '4 fois', isCorrect: false },
          { text: '1 fois', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Dans quel club anglais Didier Drogba a-t-il joué le plus longtemps ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: 'Chelsea FC', isCorrect: true },
          { text: 'Arsenal', isCorrect: false },
          { text: 'Manchester United', isCorrect: false },
          { text: 'Liverpool', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel sprinter ivoirien a remporté une médaille aux Jeux Olympiques ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: 'Marie-Josée Ta Lou', isCorrect: true },
          { text: 'Murielle Ahouré', isCorrect: false },
          { text: 'Gneki Guirou', isCorrect: false },
          { text: 'Cheick Cissé', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel club ivoirien a remporté le plus de Ligues des Champions africaine (CAF) ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: 'ASEC Mimosas', isCorrect: true },
          { text: 'Africa Sports', isCorrect: false },
          { text: "Stade d'Abidjan", isCorrect: false },
          { text: 'Séwé Sports', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Dans quel sport Cheick Cissé a-t-il remporté une médaille d'or olympique à Rio 2016 ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: 'Le Taekwondo', isCorrect: true },
          { text: 'La Boxe', isCorrect: false },
          { text: 'Le Judo', isCorrect: false },
          { text: 'La Lutte', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel est le surnom de l'équipe nationale de football de la Côte d'Ivoire ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: 'Les Éléphants', isCorrect: true },
          { text: 'Les Lions', isCorrect: false },
          { text: 'Les Aigles', isCorrect: false },
          { text: 'Les Léopards', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "En quelle année la Côte d'Ivoire a-t-elle participé pour la première fois à une Coupe du Monde FIFA ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: '2006', isCorrect: true },
          { text: '2002', isCorrect: false },
          { text: '2010', isCorrect: false },
          { text: '1998', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "Quel stade est le plus grand de Côte d'Ivoire ?",
      categoryId: sport.id,
      answers: {
        create: [
          { text: "Stade Alassane Ouattara d'Ebimpé", isCorrect: true },
          { text: 'Stade Félix Houphouët-Boigny', isCorrect: false },
          { text: 'Stade de la Paix de Bouaké', isCorrect: false },
          { text: 'Stade Robert Champroux', isCorrect: false },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Categories created: 5');
  console.log('Questions created: 50 (10 per category)');
  console.log('Answers created: 200 (4 per question)');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
