// Données des universités guinéennes — ParcourSup 2025

export const UNIVERSITIES = [
  {
    id: "uganc", nom: "Université Gamal Abdel Nasser de Conakry", sigle: "UGANC", ville: "Conakry", color: "#1a56db",
    image: "/images/UGANCC.png",
    desc: "La première et plus grande université publique de Guinée, spécialisée en sciences exactes, médecine et technologies. Fondée en 1962, elle accueille plus de 30 000 étudiants.",
    tags: ["Médecine", "Génie Civil", "Informatique", "Sciences"], capacite: 2075,
    filieres: [
      { nom: "Biologie", moy: 10, profils: "SE+SE-FA", cap: 225 }, { nom: "Chimie", moy: 10, profils: "SE+SE-FA+SM", cap: 225 },
      { nom: "Biochimie", moy: 10, profils: "SE+SE-FA", cap: 225 }, { nom: "Mathématiques", moy: 10, profils: "SE+SE-FA+SM", cap: 225 },
      { nom: "Physique", moy: 10, profils: "SE+SE-FA+SM", cap: 225 }, { nom: "Ingénierie Ferroviaire", moy: 13, profils: "SE+SE-FA+SM", cap: 100 },
      { nom: "Communication et Signalisation Ferroviaire", moy: 13, profils: "SE+SE-FA+SM", cap: 100 },
      { nom: "Transport Ferroviaire", moy: 13, profils: "SE+SE-FA+SM", cap: 100 },
      { nom: "Matériels Roulants Ferroviaires", moy: 13, profils: "SE+SE-FA+SM", cap: 100 },
      { nom: "NTIC", moy: 13, profils: "SE+SE-FA+SM", cap: 100 },
      { nom: "Développement Logiciel et Sécurité Informatique", moy: 13, profils: "SE+SE-FA+SM", cap: 100 },
      { nom: "Génie Chimique", moy: 14, profils: "SE+SE-FA+SM", cap: 50 }, { nom: "Génie Civil", moy: 14, profils: "SE+SE-FA+SM", cap: 50 },
      { nom: "Génie Électrique", moy: 14, profils: "SE+SE-FA+SM", cap: 50 }, { nom: "Génie Informatique", moy: 14, profils: "SE+SE-FA+SM", cap: 50 },
      { nom: "Génie Industriel & Maintenance", moy: 14, profils: "SE+SE-FA+SM", cap: 50 },
      { nom: "Génie Mécanique", moy: 14, profils: "SE+SE-FA+SM", cap: 50 }, { nom: "Télécommunications", moy: 14, profils: "SE+SE-FA+SM", cap: 50 },
    ]
  },
  {
    id: "uglcs", nom: "Université Général Lansana Conté de Sonfonia", sigle: "UGLCS", ville: "Conakry", color: "#7c3aed",
    image: "/images/uglc.png",
    desc: "Le grand pôle d'excellence pour les sciences humaines, sociales, juridiques et économiques. Référence pour le droit, l'économie et les lettres.",
    tags: ["Droit", "Économie", "Lettres", "Sciences Politiques"], capacite: 2975,
    filieres: [
      { nom: "Droit", moy: 13, profils: "SS+SS-FA", cap: 400 }, { nom: "Sciences Politiques", moy: 12, profils: "SS+SS-FA", cap: 200 },
      { nom: "Banque, Finance et Assurance", moy: 10, profils: "SE+SE-FA+SM", cap: 225 }, { nom: "Gestion", moy: 10, profils: "SE+SE-FA+SM", cap: 225 },
      { nom: "Économie", moy: 10, profils: "SE+SE-FA+SM", cap: 225 }, { nom: "Histoire", moy: 10, profils: "SS+SS-FA", cap: 200 },
      { nom: "Géographie", moy: 10, profils: "SS+SS-FA", cap: 200 }, { nom: "Sociologie", moy: 11, profils: "SS+SS-FA", cap: 200 },
      { nom: "Philosophie", moy: 10, profils: "SS+SS-FA", cap: 200 }, { nom: "Lettres Modernes", moy: 10, profils: "SS+SS-FA", cap: 200 },
      { nom: "Langue Arabe", moy: 10, profils: "SS-FA+SE-FA", cap: 300 }, { nom: "Langue Anglaise", moy: 10, profils: "SS", cap: 200 },
    ]
  },
  {
    id: "ul", nom: "Université de Labé", sigle: "UL", ville: "Labé", color: "#059669",
    image: "/images/labe.png",
    desc: "Université régionale dynamique du Fouta Djalon, offrant des formations diversifiées en sciences, gestion, informatique et énergies renouvelables.",
    tags: ["MIAGE", "Informatique", "Énergie", "Gestion"], capacite: 2975,
    filieres: [
      { nom: "MIAGE", moy: 12, profils: "SE+SE-FA+SM", cap: 225 }, { nom: "Informatique", moy: 12, profils: "SE+SE-FA+SM", cap: 75 },
      { nom: "Économie Statistique", moy: 12, profils: "SE+SE-FA+SM", cap: 225 }, { nom: "Énergie Photovoltaïque", moy: 12, profils: "SE+SE-FA+SM", cap: 200 },
      { nom: "Biologie", moy: 10, profils: "SE+SE-FA", cap: 225 }, { nom: "Mathématiques", moy: 10, profils: "SE+SE-FA+SM", cap: 225 },
      { nom: "Gestion", moy: 10, profils: "SE+SE-FA+SM", cap: 225 }, { nom: "Économie", moy: 10, profils: "SE+SE-FA+SM", cap: 200 },
      { nom: "Sociologie", moy: 10, profils: "SS+SS-FA", cap: 200 }, { nom: "Langue Arabe", moy: 10, profils: "SS-FA+SE-FA", cap: 300 },
      { nom: "Administration Publique", moy: 10, profils: "SE+SE-FA+SM", cap: 200 },
    ]
  },
  {
    id: "ujnk", nom: "Université Julius Nyerere de Kankan", sigle: "UJNK", ville: "Kankan", color: "#dc2626",
    image: "/images/kankan.png",
    desc: "Université publique de la Haute Guinée, formant des cadres en lettres, sciences humaines et sciences exactes pour le développement de la région.",
    tags: ["Lettres", "Histoire", "Sciences", "Gestion"], capacite: 2950,
    filieres: [
      { nom: "Gestion et Conservation de Patrimoines Documentaires", moy: 10, profils: "SS+SS-FA", cap: 100 },
      { nom: "Documentation et Métiers du Livre", moy: 10, profils: "SS+SS-FA", cap: 100 },
      { nom: "Histoire", moy: 10, profils: "SS+SS-FA", cap: 200 }, { nom: "Lettres Modernes", moy: 10, profils: "SS+SS-FA", cap: 200 },
      { nom: "Géographie", moy: 10, profils: "SS+SS-FA", cap: 200 }, { nom: "Sociologie", moy: 10, profils: "SS+SS-FA", cap: 200 },
      { nom: "Philosophie", moy: 10, profils: "SS+SS-FA", cap: 150 }, { nom: "Langue Anglaise", moy: 10, profils: "SS", cap: 150 },
      { nom: "Langue Arabe", moy: 10, profils: "SE-FA+SS-FA", cap: 250 }, { nom: "Gestion", moy: 10, profils: "SE+SE-FA+SM", cap: 150 },
      { nom: "Biologie", moy: 10, profils: "SE+SE-FA", cap: 150 }, { nom: "Chimie", moy: 10, profils: "SE+SE-FA+SM", cap: 150 },
      { nom: "Mathématiques", moy: 10, profils: "SE+SE-FA+SM", cap: 150 }, { nom: "Physique", moy: 10, profils: "SE+SE-FA+SM", cap: 150 },
    ]
  },
  {
    id: "uz", nom: "Université de N'Zérékoré", sigle: "UZ", ville: "N'Zérékoré", color: "#d97706",
    image: "/images/uz.svg",
    desc: "Université de la région forestière, spécialisée en gestion des ressources naturelles, environnement, hydrologie et sciences de la vie.",
    tags: ["Environnement", "Hydrologie", "Biologie", "Géographie"], capacite: 2550,
    filieres: [
      { nom: "Tronc Commun UZ (4 filières Ingénierie)", moy: 11, profils: "SE+SM+SE-FA", cap: 200 },
      { nom: "Gestion des Ressources Naturelles", moy: 10, profils: "SE+SE-FA+SM", cap: 200 },
      { nom: "Génie de l'Environnement", moy: 10, profils: "SE+SE-FA+SM", cap: 200 },
      { nom: "Hydrologie", moy: 10, profils: "SE+SE-FA+SM", cap: 200 }, { nom: "Météorologie", moy: 10, profils: "SE+SE-FA+SM", cap: 200 },
      { nom: "Géographie", moy: 10, profils: "SS+SS-FA", cap: 200 }, { nom: "Sociologie", moy: 10, profils: "SS+SS-FA", cap: 200 },
      { nom: "Langue Anglaise", moy: 10, profils: "SS", cap: 200 }, { nom: "Biologie", moy: 10, profils: "SE+SE-FA", cap: 250 },
      { nom: "Mathématiques", moy: 10, profils: "SE+SE-FA+SM", cap: 225 }, { nom: "Physique", moy: 10, profils: "SE+SE-FA+SM", cap: 225 },
    ]
  },
  {
    id: "kindia", nom: "Université de Kindia", sigle: "UK", ville: "Kindia", color: "#0891b2",
    image: "/images/uk.svg",
    desc: "Université régionale proposant une large offre en lettres, sciences humaines, gestion et sciences exactes pour la région de Kindia.",
    tags: ["Lettres", "Gestion", "Sciences", "Biologie"], capacite: 3450,
    filieres: [
      { nom: "Lettres Modernes", moy: 10, profils: "SS+SS-FA", cap: 250 }, { nom: "Géographie", moy: 10, profils: "SS+SS-FA", cap: 250 },
      { nom: "Langue Anglaise", moy: 10, profils: "SS", cap: 250 }, { nom: "Sciences du Langage", moy: 10, profils: "SS+SS-FA", cap: 250 },
      { nom: "Histoire", moy: 10, profils: "SS+SS-FA", cap: 250 }, { nom: "Sociologie", moy: 10, profils: "SS+SS-FA", cap: 250 },
      { nom: "Philosophie", moy: 10, profils: "SS+SS-FA", cap: 250 }, { nom: "Gestion", moy: 10, profils: "SE+SE-FA+SM", cap: 250 },
      { nom: "Économie", moy: 10, profils: "SE+SE-FA+SM", cap: 250 }, { nom: "Banque, Finance et Assurance", moy: 10, profils: "SE+SE-FA+SM", cap: 250 },
      { nom: "Biologie", moy: 10, profils: "SE+SE-FA", cap: 200 }, { nom: "Chimie", moy: 10, profils: "SE+SE-FA+SM", cap: 250 },
      { nom: "Mathématiques", moy: 10, profils: "SE+SE-FA+SM", cap: 250 }, { nom: "Physique", moy: 10, profils: "SE+SE-FA+SM", cap: 250 },
    ]
  },
  {
    id: "ist", nom: "Institut Supérieur de Technologie de Mamou", sigle: "IST", ville: "Mamou", color: "#7c3aed",
    image: "/images/mamou.png",
    desc: "Institut technique de référence en Guinée, spécialisé en génie informatique, énergétique, biomédical et ingénierie mécanique.",
    tags: ["Génie Informatique", "Énergie", "Biomédical", "Mécanique"], capacite: 350,
    filieres: [
      { nom: "Génie Énergétique", moy: 12, profils: "SE+SE-FA+SM", cap: 350 },
      { nom: "Instrumentation et Maintenance", moy: 12, profils: "SE+SE-FA+SM", cap: 350 },
      { nom: "Génie Informatique", moy: 12, profils: "SE+SE-FA+SM", cap: 350 },
      { nom: "Technologies des Équipements Biomédicaux", moy: 12, profils: "SE+SE-FA+SM", cap: 350 },
      { nom: "Conception et Fabrication Mécanique", moy: 12, profils: "SE+SE-FA+SM", cap: 350 },
      { nom: "Ingénierie en Analyses Chimiques et Contrôle de Qualité", moy: 12, profils: "SE+SE-FA+SM", cap: 350 },
      { nom: "Bio-Ingénierie et Technologie", moy: 12, profils: "SE+SE-FA+SM", cap: 350 },
    ]
  },
  {
    id: "ismgb", nom: "Institut Supérieur des Mines et Géologie de Boké", sigle: "ISMGB", ville: "Boké", color: "#92400e",
    image: "/images/ismgb.png",
    desc: "Institut spécialisé dans les mines et la géologie, formant les futurs ingénieurs de l'industrie minière guinéenne, l'une des plus riches du monde en bauxite.",
    tags: ["Mines", "Géologie", "Métallurgie", "Environnement Industriel"], capacite: 500,
    filieres: [
      { nom: "Ingénierie en Géologie", moy: 13, profils: "SE+SE-FA+SM", cap: 500 },
      { nom: "Ingénierie en Exploitation Minière", moy: 13, profils: "SE+SE-FA+SM", cap: 500 },
      { nom: "Ingénierie en Traitement Métallurgie", moy: 13, profils: "SE+SE-FA+SM", cap: 500 },
      { nom: "Ingénierie Environnement et Sécurité Industriels", moy: 13, profils: "SE+SE-FA+SM", cap: 500 },
    ]
  },
];

export const defaultUsers = [
  { id: 1, username: "admin", password: "admin123", role: "admin", nom: "Administrateur", email: "admin@orientaguinee.com" },
  { id: 2, username: "etudiant", password: "test123", role: "etudiant", nom: "Mamadou Diallo", email: "mamadou@gmail.com", serie: "SE", moyenne: 13.5 },
];
