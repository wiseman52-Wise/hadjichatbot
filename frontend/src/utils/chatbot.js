// Logique du chatbot local — fallback si API indisponible
import { UNIVERSITIES } from '../data/universities';

export let botState = { step: 'greeting', serie: null, moyenne: null };

export function resetBotState() {
  botState = { step: 'greeting', serie: null, moyenne: null };
}

export function extractMoyenne(text) {
  const m = text.match(/(\d{1,2}([.,]\d{1,2})?)/);
  if (m) {
    const val = parseFloat(m[1].replace(',', '.'));
    if (val >= 0 && val <= 20) return val;
  }
  return null;
}

export function extractSerie(text) {
  const t = text.toUpperCase();
  if (t.includes('SE-FA') || t.includes('SEFA')) return 'SE-FA';
  if (t.includes('SS-FA') || t.includes('SSFA')) return 'SS-FA';
  if (/\bSE\b/.test(t)) return 'SE';
  if (/\bSS\b/.test(t)) return 'SS';
  if (/\bSM\b/.test(t)) return 'SM';
  return null;
}

export function getFilieresForProfile(serie, moy) {
  const results = [];
  UNIVERSITIES.forEach(u => {
    u.filieres.forEach(f => {
      if (moy < f.moy) return;
      const profils = f.profils.toUpperCase();
      const serieUp = serie.toUpperCase();
      const serieMatch = profils.includes(serieUp) || profils.includes('SE+SE-FA+SM') ||
        (serieUp === 'SE' && profils.includes('SE')) ||
        (serieUp === 'SS' && (profils.includes('SS') || profils.includes('SS+SS-FA'))) ||
        (serieUp === 'SM' && profils.includes('SM'));
      if (serieMatch) {
        results.push({ ...f, uni: u.nom, sigle: u.sigle, ville: u.ville, color: u.color });
      }
    });
  });
  return results;
}

export function formatFilieresReponse(serie, moy) {
  const filieres = getFilieresForProfile(serie, moy);
  if (filieres.length === 0) {
    return `Avec une moyenne de **${moy}/20** en série **${serie}**, les possibilités sont limitées. Je vous conseille de :\n\n• Envisager un **rattrapage** pour améliorer votre moyenne\n• Consulter les **instituts de formation professionnelle**\n• Contacter directement les universités pour des dérogations\n\nNe perdez pas espoir ! Voulez-vous plus de conseils ?`;
  }
  const parUni = {};
  filieres.forEach(f => {
    if (!parUni[f.sigle]) parUni[f.sigle] = { nom: f.uni, ville: f.ville, filieres: [] };
    parUni[f.sigle].filieres.push(f);
  });
  let rep = `Voici les filières disponibles pour votre profil (**Série ${serie}**, **${moy}/20**) :\n\n`;
  Object.entries(parUni).forEach(([sigle, data]) => {
    rep += `🏫 **${sigle}** — ${data.ville}\n`;
    data.filieres.slice(0, 4).forEach(f => {
      rep += `  • ${f.nom} (moyenne requise : ${f.moy}/20)\n`;
    });
    if (data.filieres.length > 4) rep += `  • ...et ${data.filieres.length - 4} autre(s) filière(s)\n`;
    rep += '\n';
  });
  rep += `📌 **${filieres.length} filière(s)** vous sont accessibles dans **${Object.keys(parUni).length} établissement(s)**.\n\n`;
  rep += `Voulez-vous que je vous détaille une université ou une filière en particulier ? Ou souhaitez-vous des conseils selon un domaine (informatique, médecine, droit, mines...) ?`;
  return rep;
}

export function getBotResponse(userText) {
  const text = userText.toLowerCase().trim();
  const serie = extractSerie(userText);
  const moy = extractMoyenne(userText);

  if (/^(salut|bonjour|bonsoir|hello|hi|salam|bjr|bj)/.test(text)) {
    return `Bonjour ! 😊 Bienvenue sur OrientaGuinée.\n\nJe suis OrientaBot, votre conseiller académique IA. Pour vous proposer les meilleures filières, j'ai besoin de connaître :\n\n1. Votre **série** de BAC (SE, SS, SM, SE-FA, SS-FA)\n2. Votre **moyenne** au baccalauréat\n\nPouvez-vous me donner ces informations ?`;
  }
  if (/\b(oui|yes|je suis bachelier|je suis bachelière|je suis bacheli)\b/.test(text) && botState.step === 'greeting') {
    botState.step = 'ask_serie';
    return `Félicitations pour votre BAC ! 🎓\n\nPour vous orienter correctement, quelle est votre **série** ?\n\n• **SE** — Sciences Exactes\n• **SS** — Sciences Sociales\n• **SM** — Sciences Mathématiques\n• **SE-FA** — Sciences Exactes Franco-Arabe\n• **SS-FA** — Sciences Sociales Franco-Arabe`;
  }
  if (/\b(non|pas encore|pas bachelier|pas de bac)\b/.test(text)) {
    return `Pas de problème ! 😊 Je peux quand même vous aider à vous préparer pour votre orientation.\n\nVoulez-vous que je vous présente les différentes universités et filières disponibles en Guinée pour que vous puissiez vous projeter ?`;
  }
  if (/\b(merci|thank|bravo|super|parfait|excellent|très bien)\b/.test(text)) {
    return `Avec plaisir ! 😊 C'est mon rôle de vous aider.\n\nAvez-vous d'autres questions sur les universités ou filières guinéennes ? Je suis là pour vous !`;
  }
  if (/\b(informatiqu|ntic|logiciel|développement|programmation|code)\b/.test(text)) {
    let rep = `🖥️ Pour l'**Informatique et les Technologies**, voici les meilleures options en Guinée :\n\n`;
    rep += `🏫 **UGANC** (Conakry)\n  • NTIC — moyenne 13/20\n  • Développement Logiciel & Sécurité Informatique — 13/20\n  • Génie Informatique — 14/20\n\n`;
    rep += `🏫 **IST Mamou**\n  • Génie Informatique — 12/20\n\n`;
    rep += `🏫 **UL Labé**\n  • Informatique — 12/20\n  • MIAGE — 12/20\n\n`;
    if (botState.moyenne >= 14) rep += `Avec votre moyenne de **${botState.moyenne}/20**, vous pouvez viser le Génie Informatique à l'UGANC ! 🎯`;
    else if (botState.moyenne >= 13) rep += `Avec votre moyenne de **${botState.moyenne}/20**, l'UGANC NTIC ou Développement Logiciel vous sont accessibles ! 🎯`;
    else if (botState.moyenne >= 12) rep += `Avec votre moyenne de **${botState.moyenne}/20**, l'IST Mamou ou UL Labé sont parfaits pour vous ! 🎯`;
    else rep += `Indiquez-moi votre série et moyenne pour des conseils précis.`;
    return rep;
  }
  if (/\b(médecin|medecin|santé|sante|pharmacie|biologie|biochimi)\b/.test(text)) {
    let rep = `⚕️ Pour les **Sciences de la Santé**, voici les options :\n\n`;
    rep += `🏫 **UGANC** (Conakry) — Référence nationale\n  • Biologie — 10/20 (SE+SE-FA)\n  • Biochimie — 10/20 (SE+SE-FA)\n  • Chimie — 10/20\n\n`;
    rep += `🏫 **UZ N'Zérékoré, UK Kindia, UJNK Kankan**\n  • Biologie — 10/20\n  • Chimie — 10/20\n\n`;
    rep += `💡 La médecine proprement dite (FMPOS) nécessite une très bonne moyenne en SE. Avez-vous déjà votre résultat de BAC ?`;
    return rep;
  }
  if (/\b(droit|juridique|justice|avocat|notaire|magistrat)\b/.test(text)) {
    let rep = `⚖️ Pour le **Droit et les Sciences Juridiques** :\n\n`;
    rep += `🏫 **UGLCS** (Conakry) — La référence pour le droit\n  • Droit — **13/20** requis (SS+SS-FA)\n  • Sciences Politiques — 12/20\n\n`;
    rep += `💡 Le Droit à l'UGLCS est l'une des filières les plus sélectives (13/20). Votre série SS ou SS-FA est idéale.\n\n`;
    if (botState.moyenne) {
      if (botState.moyenne >= 13) rep += `✅ Avec **${botState.moyenne}/20**, vous pouvez postuler en Droit à l'UGLCS !`;
      else rep += `Avec **${botState.moyenne}/20**, visez d'abord Sciences Politiques (12/20) ou d'autres filières en attendant.`;
    } else rep += `Quelle est votre moyenne pour que je confirme votre éligibilité ?`;
    return rep;
  }
  if (/\b(mine|géologi|geologi|bauxite|métallurg|boké|boke)\b/.test(text)) {
    let rep = `⛏️ Pour les **Mines et la Géologie** :\n\n`;
    rep += `🏫 **ISMGB** — Institut Supérieur des Mines et Géologie de Boké\n`;
    rep += `  • Ingénierie en Géologie — 13/20\n  • Ingénierie en Exploitation Minière — 13/20\n`;
    rep += `  • Ingénierie en Traitement Métallurgie — 13/20\n  • Ingénierie Environnement & Sécurité Industriels — 13/20\n\n`;
    rep += `💡 La Guinée est l'un des pays les plus riches en bauxite au monde. Ce secteur offre d'excellents débouchés professionnels !\n\n`;
    rep += botState.moyenne >= 13 ? `✅ Votre moyenne vous permet d'y postuler !` : `La moyenne requise est de **13/20** en série SE+SE-FA+SM.`;
    return rep;
  }
  if (/\b(gestion|économi|economi|commerce|banque|finance|compta)\b/.test(text)) {
    let rep = `💼 Pour la **Gestion et l'Économie** :\n\n`;
    rep += `🏫 **UGLCS** (Conakry) — Gestion, Économie, Banque/Finance (10/20)\n`;
    rep += `🏫 **UL Labé** — Gestion, Économie, Économie Statistique (10-12/20)\n`;
    rep += `🏫 **UJNK Kankan** — Gestion, Économie (10/20)\n`;
    rep += `🏫 **UK Kindia** — Gestion, Économie, Banque/Finance (10/20)\n\n`;
    rep += `Ces filières sont accessibles dès **10/20** pour les séries SE, SS et SM.\n\nQuelle est votre série de BAC ?`;
    return rep;
  }
  if (/\b(energie|énergie|solaire|photovoltaïque|photovoltai|électricité|electricite)\b/.test(text)) {
    let rep = `⚡ Pour l'**Énergie** :\n\n`;
    rep += `🏫 **UL Labé** — Énergie Photovoltaïque — **12/20**\n`;
    rep += `🏫 **IST Mamou** — Génie Énergétique — **12/20**\n\n`;
    rep += `La Guinée investit dans les énergies renouvelables, excellent secteur d'avenir ! 🌞\n\n`;
    rep += botState.moyenne ? (botState.moyenne >= 12 ? `✅ Vous êtes éligible avec **${botState.moyenne}/20** !` : `La moyenne requise est 12/20.`) : `Quelle est votre moyenne ?`;
    return rep;
  }
  if (serie && moy !== null) {
    botState.serie = serie; botState.moyenne = moy; botState.step = 'profil_complet';
    return formatFilieresReponse(serie, moy);
  }
  if (serie && !botState.serie) {
    botState.serie = serie; botState.step = 'ask_moyenne';
    return `Parfait, vous êtes en série **${serie}** ! 👍\n\nMaintenant, quelle est votre **moyenne** au baccalauréat ? (Par exemple : 12, 13.5, 10/20...)`;
  }
  if (moy !== null && !botState.moyenne) {
    botState.moyenne = moy;
    if (botState.serie) { botState.step = 'profil_complet'; return formatFilieresReponse(botState.serie, moy); }
    else { botState.step = 'ask_serie'; return `Bien, vous avez une moyenne de **${moy}/20**. 📊\n\nQuelle est votre **série** de BAC ?\n\n• **SE** — Sciences Exactes\n• **SS** — Sciences Sociales\n• **SM** — Sciences Mathématiques\n• **SE-FA** — Sciences Exactes Franco-Arabe\n• **SS-FA** — Sciences Sociales Franco-Arabe`; }
  }
  if (moy !== null && botState.serie) { botState.moyenne = moy; return formatFilieresReponse(botState.serie, moy); }
  if (/\buganc\b/.test(text)) { const u = UNIVERSITIES.find(x=>x.id==='uganc'); return `🏫 **${u.nom} (${u.sigle})**\n\n${u.desc}\n\n**${u.filieres.length} filières** disponibles — Moyenne requise : 10 à 14/20\n📍 ${u.ville} | 👥 ${u.capacite.toLocaleString()} places`; }
  if (/\buglcs\b|lansana conté|sonfonia/.test(text)) { const u = UNIVERSITIES.find(x=>x.id==='uglcs'); return `🏫 **${u.nom} (${u.sigle})**\n\n${u.desc}\n\n**${u.filieres.length} filières** — Moyenne : 10 à 13/20\n📍 ${u.ville} | 👥 ${u.capacite.toLocaleString()} places`; }
  if (/\bist\b|mamou/.test(text)) { const u = UNIVERSITIES.find(x=>x.id==='ist'); return `🏫 **${u.nom} (${u.sigle})**\n\n${u.desc}\n\n**${u.filieres.length} filières techniques** — Moyenne : 12/20\n📍 ${u.ville}`; }
  if (/\bismgb\b|boke|boké/.test(text)) { const u = UNIVERSITIES.find(x=>x.id==='ismgb'); return `🏫 **${u.nom} (${u.sigle})**\n\n${u.desc}\n\n**${u.filieres.length} filières** — Moyenne : 13/20\n📍 ${u.ville}`; }
  if (/\b(université|etablissement|institution|liste)\b/.test(text)) {
    let rep = `Voici tous les établissements publics guinéens sur ParcourSup 2025 :\n\n`;
    UNIVERSITIES.forEach(u => { rep += `🏫 **${u.sigle}** — ${u.nom}\n  📍 ${u.ville} | ${u.filieres.length} filières | ${u.capacite.toLocaleString()} places\n\n`; });
    return rep + `Voulez-vous en savoir plus sur un établissement en particulier ?`;
  }
  if (/\bparcoursup\b|inscription|postuler|candidature/.test(text)) {
    return `📋 **ParcourSup Guinée — Session 2025**\n\n• 🌐 Site officiel : **www.parcoursupguinee.org**\n• 📅 Ouverture des inscriptions : **18 août 2025**\n• 📧 Contact : mesrs@mesrs.gov.gn\n\n💡 Préparez à l'avance vos relevés de notes, votre attestation de BAC et une photo d'identité.\n\nAvez-vous d'autres questions ?`;
  }
  if (botState.serie && botState.moyenne) {
    return `Avec votre profil (**Série ${botState.serie}**, **${botState.moyenne}/20**), vous avez déjà un bon nombre d'options.\n\nPuis-je vous aider à :\n• Choisir selon un **domaine** (informatique, droit, mines, médecine...) ?\n• En savoir plus sur une **université** précise ?\n\nPosez votre question !`;
  }
  return `Je suis là pour vous aider dans votre orientation ! 😊\n\nVous pouvez me demander :\n• **"Quelles filières pour ma moyenne ?"**\n• **"Parle-moi de l'UGANC"**\n• **"Je veux étudier l'informatique"**\n• **"Comment s'inscrire sur ParcourSup ?"**\n\nQu'est-ce qui vous intéresse ?`;
}
