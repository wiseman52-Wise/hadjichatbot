import re
from collections import Counter
from chatbot.models import Filiere

# Mots vides simples pour le français
STOPWORDS = set([
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd', 'l', 'à', 'au', 'aux',
    'et', 'ou', 'est', 'sont', 'pour', 'en', 'dans', 'sur', 'avec', 'sans', 'par'
])

def tokenize(text):
    text = str(text).lower()
    words = re.findall(r'\b[a-zàâçéèêëîïôûùüÿñæœ]+\b', text)
    return [w for w in words if w not in STOPWORDS and len(w) > 2]

class LocalRAG:
    """Moteur RAG (Retrieval-Augmented Generation) ultra-léger basé sur l'overlap (Jaccard)."""
    
    def __init__(self):
        self.documents = []
        self._build_index()

    def _build_index(self):
        filieres = Filiere.objects.select_related('universite').all()
        for f in filieres:
            # On construit le "document" textuel de la filière
            text = f"{f.nom} {f.debouches} {f.universite.nom} {f.universite.description}"
            tokens = set(tokenize(text))
            self.documents.append({
                'id': f.id,
                'filiere': f,
                'tokens': tokens,
                'text_complet': f"Université: {f.universite.nom} | Filière: {f.nom} | Débouchés: {f.debouches}"
            })
            
        # Indexation du fichier scrappe UGANC
        import json
        import os
        from django.conf import settings
        
        scraped_files = [
            ('scraped_uganc_filieres.json', 'par_faculte'),
            ('all_universities_enriched.json', 'par_filiere'),
        ]
        
        for filename, mode in scraped_files:
            try:
                json_path = os.path.join(settings.BASE_DIR, 'data_mining', filename)
                if not os.path.exists(json_path):
                    continue
                with open(json_path, 'r', encoding='utf-8') as fp:
                    data = json.load(fp)
                    
                for item in data:
                    if mode == 'par_filiere' and 'filieres' in item:
                        # Indexe chaque filière individuellement pour une meilleure précision
                        for fil in item.get('filieres', []):
                            text = (
                                f"{item.get('sigle', '')} {item.get('universite', '')} "
                                f"{item.get('faculte', '')} {fil.get('nom', '')} "
                                f"{fil.get('debouches', '')} {fil.get('programme_resume', '')}"
                            )
                            tokens = set(tokenize(text))
                            detail = (
                                f"[SITE OFFICIEL {item.get('sigle','?')} - {item.get('faculte','?')}]\n"
                                f"Filière : {fil.get('nom','?')}\n"
                                f"Durée : {fil.get('duree','?')} | Bac requis : {', '.join(item.get('bac_requis', []))} | Moyenne min : {fil.get('moyenne_min', item.get('moyenne_min', '?'))}/20\n"
                                f"Débouchés : {fil.get('debouches','?')}\n"
                                f"Programme : {fil.get('programme_resume','?')}\n"
                                f"{('Note : ' + fil.get('note_speciale','')) if fil.get('note_speciale') else ''}"
                            )
                            self.documents.append({
                                'id': f"enriched_{item.get('sigle','')}_{fil.get('nom','')}",
                                'filiere': None,
                                'tokens': tokens,
                                'text_complet': detail
                            })
                    else:
                        # Mode par_faculte (ancien scraping UGANC)
                        text = f"{item.get('universite','')} {item.get('faculte','')} {item.get('description_detaillee','')}"
                        tokens = set(tokenize(text))
                        self.documents.append({
                            'id': f"scraped_{item.get('faculte','')}",
                            'filiere': None,
                            'tokens': tokens,
                            'text_complet': f"[SITE OFFICIEL {item.get('universite','?')} - {item.get('faculte','?')}] : {item.get('description_detaillee','')[:1500]}"
                        })
            except Exception as e:
                print(f"Erreur RAG JSON {filename}:", e)

    def search(self, query, top_k=3):
        if not self.documents:
            self._build_index()
            
        q_tokens = set(tokenize(query))
        if not q_tokens:
            return []

        scored = []
        for doc in self.documents:
            # Intersection simple
            overlap = len(q_tokens.intersection(doc['tokens']))
            if overlap > 0:
                scored.append((overlap, doc))
        
        # Tri par score décroissant
        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc['text_complet'] for score, doc in scored[:top_k]]

# Singleton global
rag_engine = LocalRAG()
