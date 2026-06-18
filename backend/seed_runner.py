"""
Script de seed : insère toutes les universités et filières en base de données.
Lancer avec : python manage.py shell < chatbot/seed.py
OU : python seed_runner.py (depuis le dossier backend)
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from chatbot.models import Universite, Filiere, FAQEntry, CalendrierEvent

print("🌱 Début du seeding...")

# ─── Suppression des données existantes (idempotent) ───
Filiere.objects.all().delete()
Universite.objects.all().delete()
FAQEntry.objects.all().delete()
CalendrierEvent.objects.all().delete()

# ─── UNIVERSITÉS ───────────────────────────────────────

DATA = [
  {
    "nom": "Université Gamal Abdel Nasser de Conakry", "sigle": "UGANC",
    "ville": "Conakry", "capacite": 2075, "color": "#1a56db",
    "description": "La première et plus grande université publique de Guinée, spécialisée en sciences exactes, médecine et technologies. Fondée en 1962.",
    "filieres": [
      {"nom":"Biologie","moy":10,"profils":"SE,SE-FA","cap":225,"duree":"3 ans","debouches":"Biologiste, technicien laboratoire, agent santé publique"},
      {"nom":"Chimie","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Chimiste, contrôle qualité, enseignant"},
      {"nom":"Biochimie","moy":10,"profils":"SE,SE-FA","cap":225,"duree":"3 ans","debouches":"Technicien labo médical, chercheur"},
      {"nom":"Mathématiques","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Enseignant, statisticien, data scientist"},
      {"nom":"Physique","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Enseignant-chercheur, ingénieur physique"},
      {"nom":"NTIC","moy":13,"profils":"SE,SE-FA,SM","cap":100,"duree":"3 ans","debouches":"Admin réseau, développeur web/mobile, cybersécurité"},
      {"nom":"Développement Logiciel et Sécurité Informatique","moy":13,"profils":"SE,SE-FA,SM","cap":100,"duree":"3 ans","debouches":"Dev fullstack, ingénieur cybersécurité, architecte logiciel"},
      {"nom":"Ingénierie Ferroviaire","moy":13,"profils":"SE,SE-FA,SM","cap":100,"duree":"5 ans","debouches":"Ingénieur WCRG, SMB Winning, Simandou - emploi quasi-garanti"},
      {"nom":"Communication et Signalisation Ferroviaire","moy":13,"profils":"SE,SE-FA,SM","cap":100,"duree":"5 ans","debouches":"Technicien signalisation, ingénieur ferroviaire"},
      {"nom":"Transport Ferroviaire","moy":13,"profils":"SE,SE-FA,SM","cap":100,"duree":"5 ans","debouches":"Manager transport, chef d'exploitation ferroviaire"},
      {"nom":"Matériels Roulants Ferroviaires","moy":13,"profils":"SE,SE-FA,SM","cap":100,"duree":"5 ans","debouches":"Technicien maintenance matériel, ingénieur rolling stock"},
      {"nom":"Génie Civil","moy":14,"profils":"SE,SE-FA,SM","cap":50,"duree":"5 ans","debouches":"Ingénieur BTP, conducteur travaux, Simandou"},
      {"nom":"Génie Électrique","moy":14,"profils":"SE,SE-FA,SM","cap":50,"duree":"5 ans","debouches":"Ingénieur EDG, énergies renouvelables"},
      {"nom":"Génie Mécanique","moy":14,"profils":"SE,SE-FA,SM","cap":50,"duree":"5 ans","debouches":"Ingénieur industriel, secteur minier"},
      {"nom":"Génie Chimique","moy":14,"profils":"SE,SE-FA,SM","cap":50,"duree":"5 ans","debouches":"Ingénieur procédés, industrie minière"},
      {"nom":"Génie Informatique","moy":14,"profils":"SE,SE-FA,SM","cap":50,"duree":"5 ans","debouches":"Architecte cloud, ingénieur IA"},
      {"nom":"Génie Industriel et Maintenance","moy":14,"profils":"SE,SE-FA,SM","cap":50,"duree":"5 ans","debouches":"Responsable production, maintenance industrielle"},
      {"nom":"Télécommunications","moy":14,"profils":"SE,SE-FA,SM","cap":50,"duree":"5 ans","debouches":"Ingénieur télécom (Orange, MTN, Cellcom)"},
      {"nom":"Médecine","moy":12,"profils":"SE,SE-FA,SM","cap":60,"duree":"7 ans","debouches":"Médecin CHU, hôpitaux régionaux, ONG (MSF, IRC)","conditions":"CONCOURS D'ENTRÉE OBLIGATOIRE + MENTION au BAC"},
      {"nom":"Pharmacie","moy":12,"profils":"SE,SE-FA,SM","cap":60,"duree":"6 ans","debouches":"Pharmacien officine/hospitalier, inspecteur médicaments","conditions":"CONCOURS D'ENTRÉE OBLIGATOIRE + MENTION au BAC"},
      {"nom":"Odontostomatologie","moy":12,"profils":"SE,SE-FA,SM","cap":40,"duree":"6 ans","debouches":"Chirurgien-dentiste, orthodontiste","conditions":"CONCOURS D'ENTRÉE OBLIGATOIRE + MENTION au BAC"},
    ]
  },
  {
    "nom": "Université Général Lansana Conté de Sonfonia", "sigle": "UGLCS",
    "ville": "Conakry", "capacite": 2975, "color": "#7c3aed",
    "description": "Grand pôle d'excellence pour les sciences humaines, sociales, juridiques et économiques.",
    "filieres": [
      {"nom":"Droit","moy":13,"profils":"SS,SS-FA","cap":400,"duree":"3 ans","debouches":"Avocat, magistrat, notaire, juriste d'entreprise"},
      {"nom":"Sciences Politiques","moy":12,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Diplomate, politologue, fonctionnaire"},
      {"nom":"Banque, Finance et Assurance","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Banquier, analyste financier, actuaire"},
      {"nom":"Gestion","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Manager, comptable, DRH, consultant"},
      {"nom":"Économie","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Économiste, analyste, conseiller économique"},
      {"nom":"Histoire","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Enseignant, chercheur, archiviste"},
      {"nom":"Géographie","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Géographe, cartographe, aménagement du territoire"},
      {"nom":"Sociologie","moy":11,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Sociologue, assistant social, chargé de projets ONG"},
      {"nom":"Philosophie","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Enseignant, chercheur, éditeur"},
      {"nom":"Lettres Modernes","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Enseignant, journaliste, traducteur"},
      {"nom":"Langue Arabe","moy":10,"profils":"SS-FA,SE-FA","cap":300,"duree":"3 ans","debouches":"Traducteur, interprète, enseignant"},
      {"nom":"Langue Anglaise","moy":10,"profils":"SS","cap":200,"duree":"3 ans","debouches":"Interprète, professeur, guide"},
    ]
  },
  {
    "nom": "Université de Labé", "sigle": "UL",
    "ville": "Labé", "capacite": 2975, "color": "#059669",
    "description": "Université régionale dynamique du Fouta Djalon, offrant des formations diversifiées.",
    "filieres": [
      {"nom":"MIAGE","moy":12,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Analyste SI, gestionnaire ERP, chef projet informatique"},
      {"nom":"Informatique","moy":12,"profils":"SE,SE-FA,SM","cap":75,"duree":"3 ans","debouches":"Développeur, administrateur réseau"},
      {"nom":"Énergie Photovoltaïque","moy":12,"profils":"SE,SE-FA,SM","cap":200,"duree":"3 ans","debouches":"Technicien solaire, ingénieur énergie renouvelable"},
      {"nom":"Économie Statistique","moy":12,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Statisticien, économiste, analyste données"},
      {"nom":"Biologie","moy":10,"profils":"SE,SE-FA","cap":225,"duree":"3 ans","debouches":"Technicien laboratoire, biologiste"},
      {"nom":"Mathématiques","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Enseignant, statisticien"},
      {"nom":"Gestion","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Manager, comptable"},
      {"nom":"Économie","moy":10,"profils":"SE,SE-FA,SM","cap":200,"duree":"3 ans","debouches":"Économiste, conseiller"},
      {"nom":"Sociologie","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Assistant social, chargé de projets"},
      {"nom":"Langue Arabe","moy":10,"profils":"SS-FA,SE-FA","cap":300,"duree":"3 ans","debouches":"Traducteur, enseignant"},
      {"nom":"Administration Publique","moy":10,"profils":"SE,SE-FA,SM","cap":200,"duree":"3 ans","debouches":"Fonctionnaire, gestionnaire public"},
    ]
  },
  {
    "nom": "Université Julius Nyerere de Kankan", "sigle": "UJNK",
    "ville": "Kankan", "capacite": 2950, "color": "#dc2626",
    "description": "Université publique de la Haute Guinée, formant des cadres en lettres, sciences humaines et sciences exactes.",
    "filieres": [
      {"nom":"Gestion et Conservation de Patrimoines Documentaires","moy":10,"profils":"SS,SS-FA","cap":100,"duree":"3 ans","debouches":"Archiviste, bibliothécaire, documentaliste"},
      {"nom":"Documentation et Métiers du Livre","moy":10,"profils":"SS,SS-FA","cap":100,"duree":"3 ans","debouches":"Bibliothécaire, éditeur"},
      {"nom":"Histoire","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Enseignant, chercheur"},
      {"nom":"Lettres Modernes","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Enseignant, journaliste"},
      {"nom":"Géographie","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Géographe, cartographe"},
      {"nom":"Sociologie","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Assistant social, chargé de projets ONG"},
      {"nom":"Philosophie","moy":10,"profils":"SS,SS-FA","cap":150,"duree":"3 ans","debouches":"Enseignant, chercheur"},
      {"nom":"Langue Anglaise","moy":10,"profils":"SS","cap":150,"duree":"3 ans","debouches":"Professeur, interprète"},
      {"nom":"Langue Arabe","moy":10,"profils":"SE-FA,SS-FA","cap":250,"duree":"3 ans","debouches":"Traducteur, enseignant"},
      {"nom":"Gestion","moy":10,"profils":"SE,SE-FA,SM","cap":150,"duree":"3 ans","debouches":"Manager, comptable"},
      {"nom":"Biologie","moy":10,"profils":"SE,SE-FA","cap":150,"duree":"3 ans","debouches":"Biologiste, technicien labo"},
      {"nom":"Chimie","moy":10,"profils":"SE,SE-FA,SM","cap":150,"duree":"3 ans","debouches":"Chimiste, technicien"},
      {"nom":"Mathématiques","moy":10,"profils":"SE,SE-FA,SM","cap":150,"duree":"3 ans","debouches":"Enseignant, statisticien"},
      {"nom":"Physique","moy":10,"profils":"SE,SE-FA,SM","cap":150,"duree":"3 ans","debouches":"Enseignant-chercheur"},
    ]
  },
  {
    "nom": "Université de N'Zérékoré", "sigle": "UZ",
    "ville": "N'Zérékoré", "capacite": 2550, "color": "#d97706",
    "description": "Université de la région forestière, spécialisée en gestion des ressources naturelles, environnement et hydrologie.",
    "filieres": [
      {"nom":"Gestion des Ressources Naturelles","moy":11,"profils":"SE,SE-FA,SM","cap":200,"duree":"3 ans","debouches":"Gestionnaire ressources, agent eaux et forêts, consultant ONG"},
      {"nom":"Hydrologie","moy":11,"profils":"SE,SE-FA,SM","cap":200,"duree":"3 ans","debouches":"Hydrologue, ingénieur eaux, expert eau UNICEF"},
      {"nom":"Météorologie","moy":11,"profils":"SE,SE-FA,SM","cap":200,"duree":"3 ans","debouches":"Météorologue, climatologue"},
      {"nom":"Génie de l'Environnement","moy":11,"profils":"SE,SE-FA,SM","cap":200,"duree":"3 ans","debouches":"Ingénieur environnement, évaluateur impact EIE"},
      {"nom":"Géographie","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Géographe, cartographe"},
      {"nom":"Sociologie","moy":10,"profils":"SS,SS-FA","cap":200,"duree":"3 ans","debouches":"Assistant social, chargé de projets"},
      {"nom":"Langue Anglaise","moy":10,"profils":"SS","cap":200,"duree":"3 ans","debouches":"Professeur, interprète"},
      {"nom":"Biologie","moy":10,"profils":"SE,SE-FA","cap":250,"duree":"3 ans","debouches":"Biologiste, technicien labo"},
      {"nom":"Mathématiques","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Enseignant, statisticien"},
      {"nom":"Physique","moy":10,"profils":"SE,SE-FA,SM","cap":225,"duree":"3 ans","debouches":"Enseignant-chercheur"},
    ]
  },
  {
    "nom": "Université de Kindia", "sigle": "UK",
    "ville": "Kindia", "capacite": 3450, "color": "#0891b2",
    "description": "Université régionale proposant une large offre en lettres, sciences humaines, gestion et sciences exactes.",
    "filieres": [
      {"nom":"Lettres Modernes","moy":10,"profils":"SS,SS-FA","cap":250,"duree":"3 ans","debouches":"Enseignant, journaliste, traducteur"},
      {"nom":"Géographie","moy":10,"profils":"SS,SS-FA","cap":250,"duree":"3 ans","debouches":"Géographe, cartographe"},
      {"nom":"Langue Anglaise","moy":10,"profils":"SS","cap":250,"duree":"3 ans","debouches":"Professeur, interprète, guide"},
      {"nom":"Sciences du Langage","moy":10,"profils":"SS,SS-FA","cap":250,"duree":"3 ans","debouches":"Linguiste, traducteur, éditeur"},
      {"nom":"Histoire","moy":10,"profils":"SS,SS-FA","cap":250,"duree":"3 ans","debouches":"Enseignant, chercheur, archiviste"},
      {"nom":"Sociologie","moy":10,"profils":"SS,SS-FA","cap":250,"duree":"3 ans","debouches":"Assistant social, ONG"},
      {"nom":"Philosophie","moy":10,"profils":"SS,SS-FA","cap":250,"duree":"3 ans","debouches":"Enseignant, chercheur"},
      {"nom":"Gestion","moy":10,"profils":"SE,SE-FA,SM","cap":250,"duree":"3 ans","debouches":"Manager, comptable"},
      {"nom":"Économie","moy":10,"profils":"SE,SE-FA,SM","cap":250,"duree":"3 ans","debouches":"Économiste, analyste"},
      {"nom":"Banque, Finance et Assurance","moy":10,"profils":"SE,SE-FA,SM","cap":250,"duree":"3 ans","debouches":"Banquier, analyste financier"},
      {"nom":"Biologie","moy":10,"profils":"SE,SE-FA","cap":200,"duree":"3 ans","debouches":"Biologiste, technicien labo"},
      {"nom":"Chimie","moy":10,"profils":"SE,SE-FA,SM","cap":250,"duree":"3 ans","debouches":"Chimiste, technicien"},
      {"nom":"Mathématiques","moy":10,"profils":"SE,SE-FA,SM","cap":250,"duree":"3 ans","debouches":"Enseignant, statisticien"},
      {"nom":"Physique","moy":10,"profils":"SE,SE-FA,SM","cap":250,"duree":"3 ans","debouches":"Enseignant-chercheur"},
    ]
  },
  {
    "nom": "Institut Supérieur de Technologie de Mamou", "sigle": "IST",
    "ville": "Mamou", "capacite": 350, "color": "#7c3aed",
    "description": "Institut technique spécialisé en génie informatique, énergétique, biomédical et ingénierie mécanique.",
    "filieres": [
      {"nom":"Génie Énergétique","moy":12,"profils":"SE,SE-FA,SM","cap":350,"duree":"3 ans","debouches":"Technicien énergie, ingénieur"},
      {"nom":"Instrumentation et Maintenance","moy":12,"profils":"SE,SE-FA,SM","cap":350,"duree":"3 ans","debouches":"Technicien maintenance"},
      {"nom":"Génie Informatique","moy":12,"profils":"SE,SE-FA,SM","cap":350,"duree":"3 ans","debouches":"Développeur, admin système"},
      {"nom":"Technologies des Équipements Biomédicaux","moy":12,"profils":"SE,SE-FA,SM","cap":350,"duree":"3 ans","debouches":"Technicien biomédical, hôpitaux"},
      {"nom":"Conception et Fabrication Mécanique","moy":12,"profils":"SE,SE-FA,SM","cap":350,"duree":"3 ans","debouches":"Ingénieur mécanique, industrie"},
      {"nom":"Ingénierie en Analyses Chimiques et Contrôle de Qualité","moy":12,"profils":"SE,SE-FA,SM","cap":350,"duree":"3 ans","debouches":"Chimiste contrôle qualité, labo"},
      {"nom":"Bio-Ingénierie et Technologie","moy":12,"profils":"SE,SE-FA,SM","cap":350,"duree":"3 ans","debouches":"Biotechnicien, chercheur"},
    ]
  },
  {
    "nom": "Institut Supérieur des Mines et Géologie de Boké", "sigle": "ISMGB",
    "ville": "Boké", "capacite": 500, "color": "#92400e",
    "description": "Institut spécialisé dans les mines et la géologie, pour la future ingénierie de l'industrie minière guinéenne.",
    "filieres": [
      {"nom":"Ingénierie en Géologie","moy":13,"profils":"SE,SE-FA,SM","cap":500,"duree":"5 ans","debouches":"Géologue de terrain, consultant ressources naturelles"},
      {"nom":"Ingénierie en Exploitation Minière","moy":13,"profils":"SE,SE-FA,SM","cap":500,"duree":"5 ans","debouches":"Ingénieur minier (SMB, CBG, COBAD, Rio Tinto)"},
      {"nom":"Ingénierie en Traitement Métallurgie","moy":13,"profils":"SE,SE-FA,SM","cap":500,"duree":"5 ans","debouches":"Ingénieur métallurgiste, procédés miniers"},
      {"nom":"Ingénierie Environnement et Sécurité Industriels","moy":13,"profils":"SE,SE-FA,SM","cap":500,"duree":"5 ans","debouches":"Ingénieur HSE, consultant environnement"},
    ]
  },
]

for item in DATA:
    u = Universite.objects.create(
        nom=item['nom'], sigle=item['sigle'], ville=item['ville'],
        capacite=item['capacite'], color=item['color'], description=item['description']
    )
    for f in item['filieres']:
        Filiere.objects.create(
            universite=u, nom=f['nom'], moyenne_requise=f['moy'],
            profils_acceptes=f['profils'], capacite=f.get('cap', 0),
            duree=f.get('duree', '3 ans'), debouches=f.get('debouches', ''),
            conditions_admission=f.get('conditions', '')
        )
    print(f"  ✅ {u.sigle} ({u.filieres.count()} filières)")

# ─── FAQ ────────────────────────────────────────────────
print("\n📋 Insertion FAQ...")
faqs = [
    {"q":"Quels documents faut-il pour s'inscrire sur ParcourSup ?","r":"Vous devez fournir : 1) Relevé de notes du BAC certifié, 2) Attestation de BAC, 3) Acte de naissance, 4) Photo d'identité récente, 5) Numéro PV du BAC. Certaines filières demandent également un test de niveau ou un concours.","cat":"admission"},
    {"q":"Quelles sont les dates d'ouverture de ParcourSup Guinée ?","r":"Les inscriptions sur ParcourSup Guinée ouvrent généralement courant août (mi-août à fin septembre). Consultez le site officiel www.parcoursupguinee.org pour les dates exactes de la session en cours.","cat":"admission"},
    {"q":"Combien coûtent les frais de scolarité dans les universités publiques ?","r":"Les frais varient selon l'université. En général : Inscription administrative (20 000 - 50 000 GNF), Frais de bibliothèque et examens (10 000 - 30 000 GNF). Les montants précis sont communiqués au moment de l'inscription.","cat":"bourse"},
    {"q":"Est-ce qu'il y a des bourses disponibles pour les étudiants ?","r":"Oui, il existe des bourses nationales accordées selon les résultats académiques et les ressources familiales, ainsi que des bourses internationales (Chine, Maroc, Russie, Turquie). L'ICF-UGANC propose notamment des bourses de Master/Doctorat en Chine.","cat":"bourse"},
    {"q":"Y a-t-il des logements universitaires (cités) disponibles ?","r":"Oui, certaines universités disposent de résidences universitaires à tarif réduit (UGANC notamment). Les places sont limitées et attribuées sur critères sociaux. Il est conseillé de postuler rapidement au début de l'année académique.","cat":"logement"},
    {"q":"La FSTS (Médecine) nécessite-t-elle un concours ?","r":"Oui, absolument. L'accès à la FSTS (Médecine, Pharmacie, Odontostomatologie) est soumis à un concours d'entrée obligatoire ET à une mention au BAC. La moyenne minimale est de 12/20. Il y a environ 200 places au total, ce qui en fait l'une des filières les plus sélectives.","cat":"admission"},
    {"q":"Puis-je intégrer l'UGLCS avec un BAC SE ?","r":"L'UGLCS (Sciences humaines et droit) est principalement orientée vers les bacheliers SS et SS-FA. Cependant, les filières d'Économie, Gestion et Banque-Finance-Assurance sont accessibles aux bacheliers SE, SE-FA et SM avec une moyenne de 10/20.","cat":"admission"},
]
for f in faqs:
    FAQEntry.objects.create(question=f['q'], reponse=f['r'], categorie=f['cat'])
print(f"  ✅ {len(faqs)} FAQs insérées")

# ─── CALENDRIER ─────────────────────────────────────────
print("\n📅 Insertion Calendrier...")
from datetime import date
events = [
    {"titre":"Ouverture ParcourSup 2025","debut":date(2025, 8, 18),"fin":date(2025, 9, 30),"desc":"Période d'inscription en ligne sur www.parcoursupguinee.org"},
    {"titre":"Rentrée Académique 2025-2026","debut":date(2025, 10, 1),"fin":None,"desc":"Rentrée officielle dans toutes les universités publiques"},
    {"titre":"Session 1 — Examens du 1er semestre","debut":date(2026, 1, 15),"fin":date(2026, 2, 15),"desc":"Examens de fin de 1er semestre"},
    {"titre":"Résultats BAC 2026","debut":date(2026, 7, 15),"fin":None,"desc":"Publication des résultats du Baccalauréat national"},
    {"titre":"Ouverture ParcourSup 2026","debut":date(2026, 8, 17),"fin":date(2026, 9, 30),"desc":"Début des inscriptions pour la rentrée 2026-2027"},
]
for ev in events:
    CalendrierEvent.objects.create(titre=ev['titre'], date_debut=ev['debut'], date_fin=ev.get('fin'), description=ev['desc'])
print(f"  ✅ {len(events)} événements insérés")

print("\n🎉 Seeding terminé avec succès !")
