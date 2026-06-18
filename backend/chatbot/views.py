import json
import re
# pyrefly: ignore [missing-import]
from django.conf import settings
# pyrefly: ignore [missing-import]
from django.db.models import Count
# pyrefly: ignore [missing-import]
from rest_framework.decorators import api_view, permission_classes, parser_classes
# pyrefly: ignore [missing-import]
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
# pyrefly: ignore [missing-import]
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
# pyrefly: ignore [missing-import]
from rest_framework.response import Response
# pyrefly: ignore [missing-import]
from rest_framework import status
from .models import Conversation, Message, Universite, Filiere, FAQEntry, CalendrierEvent, MessageFeedback
from .serializers import (UniversiteSerializer, FiliereSerializer,
                           FAQSerializer, CalendrierEventSerializer, MessageFeedbackSerializer)
from .knowledge_base import get_system_prompt

try:
    from huggingface_hub import InferenceClient
    _hf_client = True  # On garde juste un flag, la clé sera lue à chaque appel
    HF_OK = True
except ImportError:
    HF_OK = True  # On utilise requests directement, pas besoin du package
    _hf_client = True


# ─────────────────────────────────────────────
#  UNIVERSITÉS
# ─────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def universites(request):
    if request.method == 'GET':
        data = Universite.objects.prefetch_related('filieres').all()
        return Response(UniversiteSerializer(data, many=True).data)
    # POST — admin uniquement
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    s = UniversiteSerializer(data=request.data)
    if s.is_valid():
        s.save()
        return Response(s.data, status=201)
    return Response(s.errors, status=400)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def universite_detail(request, pk):
    try:
        u = Universite.objects.prefetch_related('filieres').get(pk=pk)
    except Universite.DoesNotExist:
        return Response({'detail': 'Non trouvé'}, status=404)

    if request.method == 'GET':
        return Response(UniversiteSerializer(u).data)

    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    if request.method == 'DELETE':
        u.delete()
        return Response(status=204)
    s = UniversiteSerializer(u, data=request.data, partial=True)
    if s.is_valid():
        s.save()
        return Response(s.data)
    return Response(s.errors, status=400)


# ─────────────────────────────────────────────
#  FILIÈRES
# ─────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def filieres(request):
    if request.method == 'GET':
        qs = Filiere.objects.select_related('universite').all()
        return Response(FiliereSerializer(qs, many=True).data)
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    s = FiliereSerializer(data=request.data)
    if s.is_valid():
        s.save()
        return Response(s.data, status=201)
    return Response(s.errors, status=400)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def filiere_detail(request, pk):
    try:
        f = Filiere.objects.select_related('universite').get(pk=pk)
    except Filiere.DoesNotExist:
        return Response({'detail': 'Non trouvé'}, status=404)
    if request.method == 'GET':
        return Response(FiliereSerializer(f).data)
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    if request.method == 'DELETE':
        f.delete()
        return Response(status=204)
    s = FiliereSerializer(f, data=request.data, partial=True)
    if s.is_valid():
        s.save()
        return Response(s.data)
    return Response(s.errors, status=400)


# ─────────────────────────────────────────────
#  FAQ
# ─────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def faq(request):
    if request.method == 'GET':
        return Response(FAQSerializer(FAQEntry.objects.all(), many=True).data)
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    s = FAQSerializer(data=request.data)
    if s.is_valid():
        s.save()
        return Response(s.data, status=201)
    return Response(s.errors, status=400)


@api_view(['PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def faq_detail(request, pk):
    try:
        entry = FAQEntry.objects.get(pk=pk)
    except FAQEntry.DoesNotExist:
        return Response({'detail': 'Non trouvé'}, status=404)
    if not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    if request.method == 'DELETE':
        entry.delete()
        return Response(status=204)
    s = FAQSerializer(entry, data=request.data, partial=True)
    if s.is_valid():
        s.save()
        return Response(s.data)
    return Response(s.errors, status=400)


# ─────────────────────────────────────────────
#  CALENDRIER
# ─────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def calendrier(request):
    if request.method == 'GET':
        return Response(CalendrierEventSerializer(CalendrierEvent.objects.order_by('date_debut'), many=True).data)
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    s = CalendrierEventSerializer(data=request.data)
    if s.is_valid():
        s.save()
        return Response(s.data, status=201)
    return Response(s.errors, status=400)


@api_view(['PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def calendrier_detail(request, pk):
    try:
        ev = CalendrierEvent.objects.get(pk=pk)
    except CalendrierEvent.DoesNotExist:
        return Response({'detail': 'Non trouvé'}, status=404)
    if not request.user.is_staff:
        return Response({'detail': 'Accès refusé'}, status=403)
    if request.method == 'DELETE':
        ev.delete()
        return Response(status=204)
    s = CalendrierEventSerializer(ev, data=request.data, partial=True)
    if s.is_valid():
        s.save()
        return Response(s.data)
    return Response(s.errors, status=400)


# ─────────────────────────────────────────────
#  STATS ADMIN
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats(request):
    from accounts.models import Etudiant
    # pyrefly: ignore [missing-import]
    from django.utils import timezone
    from datetime import timedelta

    if not request.user.is_staff:
        # Simple stats for regular users
        return Response({
            'nb_universites': Universite.objects.count(),
            'nb_filieres': Filiere.objects.count(),
            'total_places': Universite.objects.aggregate(total=Count('id'))['total'],
        })

    tu = Etudiant.objects.count()
    tc = Conversation.objects.count()
    tm = Message.objects.count()
    today = timezone.now()
    mpj = []
    for i in range(6, -1, -1):
        j = today - timedelta(days=i)
        mpj.append({'date': j.strftime('%d/%m'), 'count': Message.objects.filter(created_at__date=j.date()).count()})

    recent_users = list(Etudiant.objects.order_by('-date_inscription')[:8].values(
        'id', 'first_name', 'last_name', 'username', 'serie_bac', 'moyenne_bac', 'date_inscription'))
    recent_convs = list(Conversation.objects.select_related('etudiant').order_by('-updated_at')[:10].values(
        'id', 'titre', 'etudiant__first_name', 'etudiant__last_name', 'updated_at'))

    # Statistiques par filière (nombre d'étudiants éligibles par profil)
    filieres = Filiere.objects.select_related('universite').all()
    filiere_stats = []
    for f in filieres:
        # Nombre d'étudiants dont le profil correspond à cette filière
        from accounts.models import Etudiant as Etu
        nb_eligible = 0
        for etu in Etu.objects.exclude(serie_bac='').exclude(moyenne_bac=None):
            s = etu.serie_bac.upper() if etu.serie_bac else ''
            m = float(etu.moyenne_bac) if etu.moyenne_bac else 0
            profils = f.profils_acceptes.upper() if f.profils_acceptes else ''
            if (s in profils or 'TOUS' in profils) and f.moyenne_requise <= m:
                nb_eligible += 1
        filiere_stats.append({
            'id': f.pk,
            'nom': f.nom,
            'universite': f.universite.sigle,
            'universite_nom': f.universite.nom,
            'profils_acceptes': f.profils_acceptes,
            'moyenne_requise': float(f.moyenne_requise),
            'debouches': f.debouches,
            'nb_etudiants_eligibles': nb_eligible,
        })
    filiere_stats.sort(key=lambda x: x['nb_etudiants_eligibles'], reverse=True)

    # Derniers conseils chatbot (messages assistants)
    derniers_conseils = list(Message.objects.filter(role='assistant').select_related(
        'conversation__etudiant').order_by('-created_at')[:20].values(
        'id', 'contenu', 'created_at',
        'conversation__etudiant__first_name',
        'conversation__etudiant__last_name',
        'conversation__etudiant__serie_bac',
        'conversation__titre'
    ))

    # BAC series distribution
    from django.db.models import Count as DjCount
    bac_stats = list(Etudiant.objects.exclude(serie_bac='').values('serie_bac').annotate(count=DjCount('id')).order_by('-count'))

    return Response({
        'total_users': tu, 'total_convs': tc, 'total_msgs': tm,
        'nb_universites': Universite.objects.count(),
        'nb_filieres': Filiere.objects.count(),
        'msgs_par_jour': mpj,
        'recent_users': recent_users,
        'recent_convs': recent_convs,
        'filiere_stats': filiere_stats,
        'derniers_conseils': derniers_conseils,
        'bac_stats': bac_stats,
    })



# admin_dashboard supprimé (B8) — utiliser directement /api/stats/


# ─────────────────────────────────────────────
#  CONVERSATIONS & MESSAGES
# ─────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def conversations(request):
    if request.method == 'GET':
        convs = Conversation.objects.filter(etudiant=request.user).order_by('-updated_at')[:20]
        return Response([{'id': c.pk, 'titre': c.titre, 'updated_at': c.updated_at} for c in convs])
    conv = Conversation.objects.create(etudiant=request.user, titre='Nouvelle conversation')
    return Response({'id': conv.pk, 'titre': conv.titre}, status=201)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def conversation_detail(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk, etudiant=request.user)
    except Conversation.DoesNotExist:
        return Response({'detail': 'Non trouvé'}, status=404)
    if request.method == 'DELETE':
        conv.delete()
        return Response(status=204)
    msgs = [{'role': m.role, 'contenu': m.contenu, 'created_at': m.created_at} for m in conv.messages.all()]
    return Response({'id': conv.pk, 'titre': conv.titre, 'messages': msgs})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def envoyer_message(request):
    fichier_contenu = ''
    fichier = request.FILES.get('fichier')
    if fichier:
        try:
            texte = fichier.read().decode('utf-8', errors='ignore')
            fichier_contenu = f"\n\n[Fichier importé : {fichier.name}]\n{texte[:3000]}"
        except Exception:
            fichier_contenu = f"\n\n[Fichier : {fichier.name}]"

    contenu = request.data.get('message', '').strip()
    if not contenu and not fichier_contenu:
        return Response({'error': 'Message requis'}, status=400)
    if not contenu:
        contenu = "Analyse ce fichier et conseille-moi sur mon orientation."

    message_complet = contenu + fichier_contenu
    conv_id = request.data.get('conversation_id')

    if conv_id:
        try:
            conv = Conversation.objects.get(pk=conv_id, etudiant=request.user)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation introuvable'}, status=404)
    else:
        conv = Conversation.objects.create(
            etudiant=request.user,
            titre=contenu[:60] + ('…' if len(contenu) > 60 else '')
        )

    Message.objects.create(conversation=conv, role='user', contenu=message_complet)
    historique = [{'role': m.role, 'content': m.contenu} for m in conv.messages.all()]
    reponse = _call_llm(historique, request.user)
    Message.objects.create(conversation=conv, role='assistant', contenu=reponse)
    conv.save()

    return Response({
        'response': reponse,
        'conversation_id': conv.pk,
        'conversation_titre': conv.titre,
    })


# ─────────────────────────────────────────────
#  FEEDBACK
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def message_feedback(request, message_id):
    try:
        msg = Message.objects.get(pk=message_id, conversation__etudiant=request.user)
    except Message.DoesNotExist:
        return Response({'detail': 'Message non trouvé'}, status=404)
    fb, _ = MessageFeedback.objects.update_or_create(
        message=msg,
        defaults={'est_positif': request.data.get('est_positif', True),
                  'commentaire': request.data.get('commentaire', '')}
    )
    return Response(MessageFeedbackSerializer(fb).data)


# ─────────────────────────────────────────────
#  MOTEUR IA
# ─────────────────────────────────────────────

def _call_llm(messages, user=None):
    from .rag_engine import rag_engine

    # 1. Récupération du contexte via RAG
    last_msg = messages[-1]['content'] if messages else ""
    rag_context = rag_engine.search(last_msg, top_k=3)
    
    # 2. Séparation de la logique métier (JSON strict des filières autorisées)
    valid_options = ""
    if user and user.serie_bac and user.moyenne_bac:
        filieres_legales = _get_filieres_db(serie=user.serie_bac, moy=user.moyenne_bac)
        valid_options = json.dumps([{"filiere": f.nom, "universite": f.universite.nom} for f in filieres_legales], ensure_ascii=False)
        
    system_prompt = get_system_prompt(user)
    
    if rag_context:
        system_prompt += "\n\nCONTEXTE RAG (Informations officielles des universités):\n" + "\n".join(rag_context)
    if valid_options:
        system_prompt += f"\n\nCONTRAINTES STRICTES (Logique Métier):\nVoici la liste exacte des filières autorisées pour cet étudiant au format JSON : {valid_options}.\nTu dois IMPÉRATIVEMENT te limiter à ces filières si tu fais des recommandations, car elles respectent les critères du Ministère."

    api_key = getattr(settings, 'HUGGINGFACE_API_KEY', '')
    if api_key:
        try:
            import requests as _requests
            # Utilise l'API text-generation gratuite (aucun provider nécessaire)
            HF_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1"
            HF_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
            
            # Formater les messages en prompt style Mistral/Mixtral
            prompt = f"<s>[INST] {system_prompt} \n\n"
            for msg in messages:
                if msg['role'] == 'user':
                    prompt += f"{msg['content']} [/INST]"
                elif msg['role'] == 'assistant':
                    prompt += f" {msg['content']} </s><s>[INST] "
            
            headers = {"Authorization": f"Bearer {api_key}"}
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 600,
                    "temperature": 0.7,
                    "return_full_text": False,
                    "stop": ["</s>", "[INST]"]
                }
            }
            response = _requests.post(HF_URL, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and result:
                    return result[0].get('generated_text', '').strip()
            else:
                print(f"Hugging Face API Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Hugging Face Error: {e}")
    return _fallback(messages, user)


def _get_filieres_db(serie=None, moy=None):
    """Récupère les filières depuis la DB selon profil."""
    qs = Filiere.objects.select_related('universite').all()
    if moy is not None:
        qs = qs.filter(moyenne_requise__lte=moy)
    results = []
    for f in qs:
        if serie:
            profils = f.profils_acceptes.upper()
            s = serie.upper()
            if s not in profils and 'TOUS' not in profils:
                continue
                
            nom_filiere = f.nom.lower()
            mots_litteraires = ['droit', 'politique', 'lettres', 'histoire', 'sociologie', 'philosophie', 'langue', 'géographie', 'documentation', 'journalisme']
            mots_info = ['informatique', 'ntic', 'logiciel', 'miage', 'développement']
            mots_techniques = ['génie', 'ingénierie', 'mathématiques', 'physique', 'chimie', 'btp', 'architecture', 'télécommunications', 'mécanique', 'électrique', 'énergie', 'solaire', 'hydrologie', 'mines', 'métallurgie']
            
            # Exclusions SM
            if s == 'SM' or s == 'SM-FA':
                if any(m in nom_filiere for m in mots_litteraires):
                    continue
            
            # Exclusions SE
            elif s == 'SE' or s == 'SE-FA':
                if any(m in nom_filiere for m in mots_litteraires + mots_info):
                    continue
                    
            # Exclusions SS
            elif s == 'SS' or s == 'SS-FA':
                if any(m in nom_filiere for m in mots_info + mots_techniques):
                    continue

        results.append(f)
    return results


def _recommander_db(serie, moy, prenom):
    """Retourne les recommandations depuis la DB."""
    filieres = _get_filieres_db(serie=serie, moy=moy)
    if not filieres:
        return f"Désolé {prenom} 😔, avec **{moy}/20** en Bac {serie}, tes options directes sont limitées.\n\nAs-tu pensé à te renseigner directement auprès des universités pour des dérogations ?"

    par_uni = {}
    for f in filieres:
        sigle = f.universite.sigle
        if sigle not in par_uni:
            par_uni[sigle] = {'nom': f.universite.nom, 'ville': f.universite.ville, 'filieres': []}
        par_uni[sigle]['filieres'].append(f)

    return f"Bonne nouvelle {prenom} ! 🎉\n\nTu as accès à **{len(filieres)} filières** réparties dans **{len(par_uni)} universités**.\n\nQuel domaine t'intéresse le plus ? (ex: Médecine, Informatique, Gestion...)"


def _fallback(messages, user=None):
    """Moteur de réponse local — utilise la DB si disponible, sinon fallback texte."""
    prenom = user.first_name if user else 'étudiant'
    serie = user.serie_bac if user and user.serie_bac else None
    moy = user.moyenne_bac if user and user.moyenne_bac else None

    q = messages[-1]['content'].strip() if messages else ''
    q_low = q.lower()
    nb_messages = len(messages)
    historique_bot = [m['content'] for m in messages if m['role'] == 'assistant']
    deja_demande_bac = any('type de bac' in m.lower() or 'série de bac' in m.lower() for m in historique_bot)
    deja_demande_moy = any('moyenne' in m.lower() for m in historique_bot)

    saluts = ['salut', 'bonjour', 'bonsoir', 'hello', 'hi', 'hey', 'coucou', 'salam', 'yo', 'bjr', 'bsr']
    est_salut = any(q_low == s or q_low.startswith(s + ' ') or q_low.startswith(s + '!') for s in saluts)
    
    mercis = ['merci', 'ok', "d'accord", 'daccord', 'super', 'génial', 'compris', 'dac', 'thanks']
    est_merci = any(q_low == m or (q_low.startswith(m) and len(q_low.split()) <= 3) for m in mercis)

    # Extraction du contexte depuis l'historique complet
    series_map = {'se-fa': 'SE-FA', 'sefa': 'SE-FA', 'ss-fa': 'SS-FA', 'ssfa': 'SS-FA',
                  'se': 'SE', 'sm': 'SM', 'ss': 'SS'}
    
    serie_actuelle = None
    for mot, val in series_map.items():
        if mot in q_low:
            serie_actuelle = val
            break
            
    moy_actuelle = None
    for n in re.findall(r'\b(\d{1,2}(?:[.,]\d{1,2})?)\b', q):
        val = float(n.replace(',', '.'))
        if 0 <= val <= 20:
            moy_actuelle = val
            break

    if not serie:
        for m in messages:
            if m['role'] == 'user':
                for mot, val in series_map.items():
                    if mot in m['content'].lower():
                        serie = val
                        break
            if serie: break

    if not moy:
        for m in messages:
            if m['role'] == 'user':
                for n in re.findall(r'\b(\d{1,2}(?:[.,]\d{1,2})?)\b', m['content']):
                    val = float(n.replace(',', '.'))
                    if 0 <= val <= 20:
                        moy = val
                        break
            if moy: break

    if est_merci:
        return "🏁 **Conclusion :** De rien ! N'hésite pas si tu as d'autres questions sur ton orientation, une université ou un métier spécifique. Je suis là pour t'aider ! 😊"


    if est_salut or nb_messages <= 1:
        if serie and moy:
            return f"👋 **Salut {prenom} !** Bienvenue sur OrientaGN.\n\n✅ **Vérification :** J'ai bien noté ton profil : **Bac {serie}** avec **{moy}/20**.\n\n🤔 **Demande :** Dans quel domaine souhaites-tu poursuivre tes études ? 🎓"
        elif serie:
            return f"👋 **Salut {prenom} !** Bienvenue sur OrientaGN.\n\n✅ **Vérification :** Super pour le **Bac {serie}** !\n\n🤔 **Demande :** Quelle est ta **moyenne** (sur 20) pour qu'on affine tout ça ?"
        else:
            return f"👋 **Salut {prenom} !** Bienvenue sur OrientaGN.\n\nℹ️ **Information :** Je suis là pour t'aider à trouver ta voie universitaire.\n\n🤔 **Demande :** Pour commencer, quelle est ta **série de bac** ? (SE, SM, SS...)"

    if serie_actuelle and not moy:
        return f"✅ **Vérification :** Top ! Bac **{serie}** enregistré.\n\n🤔 **Demande :** Quelle est ta **moyenne** sur 20 ?"
    if moy_actuelle and not serie:
        return f"✅ **Vérification :** Moyenne de **{moy}/20** bien notée.\n\n🤔 **Demande :** Quelle était ta **série de bac** ?"
    if (serie_actuelle or moy_actuelle) and serie and moy:
        return f"✅ **Vérification :** Super {prenom} ! Profil complet : **Bac {serie}**, **{moy}/20**.\n\n🤔 **Demande :** Qu'est-ce qui t'intéresse ? (Médecine, Tech, Droit, Mines...)"

    mots_cles = {
        'informati': 'Informatique', 'ntic': 'NTIC', 'logiciel': 'Logiciel', 'programmation': 'Informatique', 'dev': 'Informatique', 'web': 'Informatique', 'cyber': 'Informatique', 'ordi': 'Informatique',
        'admin': 'Informatique', 'système': 'Informatique', 'reseau': 'Informatique', 'réseau': 'Informatique',
        'chemin de fer': 'Ferroviaire', 'ferroviaire': 'Ferroviaire', 'train': 'Ferroviaire',
        'médecin': 'Médecine', 'pharmacie': 'Pharmacie', 'santé': 'Médecine', 'médical': 'Médecine', 'docteur': 'Médecine', 'infirmi': 'Médecine', 'hôpital': 'Médecine', 'clinique': 'Médecine',
        'mines': 'Minière', 'géologie': 'Géologie', 'minier': 'Minière', 'terre': 'Géologie', 'environnement': 'Environnement', 'eau': 'Hydrologie',
        'génie': 'Génie', 'polytechnique': 'Génie', 'ingénieur': 'Génie',
        'gestion': 'Gestion', 'économi': 'Économie', 'banque': 'Banque', 'finance': 'Finance', 'commerce': 'Gestion', 'business': 'Gestion', 'marketing': 'Gestion', 'vente': 'Gestion', 'comptabilité': 'Gestion',
        'biologie': 'Biologie', 'chimie': 'Chimie', 'physique': 'Physique', 'math': 'Mathématiques',
        'lettres': 'Lettres', 'histoire': 'Histoire', 'droit': 'Droit', 'langue': 'Langue', 'anglais': 'Anglaise', 'arabe': 'Arabe', 'sociologie': 'Sociologie', 'philosophie': 'Philosophie',
        'bâtiment': 'Civil', 'construction': 'Civil', 'btp': 'Civil', 'architecture': 'Civil',
        'énergie': 'Énergétique', 'solaire': 'Photovoltaïque', 'électricité': 'Électrique'
    }
    
    # 1. Détection de mots clés (filières)
    terme_filiere = None
    for mot, terme in mots_cles.items():
        if mot in q_low:
            terme_filiere = terme
            break

    # Recherche dynamique dans la base de données si aucun mot clé direct n'est trouvé
    mot_db_trouve = None
    if not terme_filiere:
        from django.db.models import Q
        mots_ignores = {'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'pour', 'avec', 'sans', 'dans', 'sur', 'sous', 'vers', 'être', 'avoir', 'faire', 'devenir', 'vouloir', 'pouvoir', 'comment', 'quel', 'quelle', 'quels', 'quelles', 'quoi', 'qui', 'que', 'quand', 'où', 'est-ce', 'le', 'la', 'les', 'un', 'une', 'des', 'mon', 'ton', 'son', 'ma', 'ta', 'sa', 'mes', 'tes', 'ses', 'ce', 'cet', 'cette', 'ces', 'au', 'aux', 'du', 'des', 'est', 'sont'}
        mots_importants = [w.strip(',.?!"\':()') for w in q_low.split() if len(w.strip(',.?!"\':()')) > 3 and w.strip(',.?!"\':()') not in mots_ignores]
        
        for mot in mots_importants:
            if Filiere.objects.filter(Q(nom__icontains=mot) | Q(debouches__icontains=mot)).exists():
                mot_db_trouve = mot
                break
                
    # 2. Détection de l'université
    unis = Universite.objects.all()
    u_cible = None
    q_words = q_low.replace("l'", "l' ").replace("d'", "d' ").split()
    for u in unis:
        sigle_low = u.sigle.lower()
        if sigle_low in q_words or u.ville.lower() in q_words or f"l'{sigle_low}" in q_low or f"d'{sigle_low}" in q_low:
            u_cible = u
            break
            
    # 3. Traitement croisé (Uni + Filière, ou l'un des deux)
    if u_cible or terme_filiere or mot_db_trouve:
        from django.db.models import Q
        qs = Filiere.objects.select_related('universite').all()
        
        if u_cible:
            qs = qs.filter(universite=u_cible)
        if terme_filiere:
            qs = qs.filter(nom__icontains=terme_filiere)
        elif mot_db_trouve:
            qs = qs.filter(Q(nom__icontains=mot_db_trouve) | Q(debouches__icontains=mot_db_trouve))
            terme_filiere = mot_db_trouve # Pour l'affichage
            
        if serie and moy:
            qs = [f for f in qs if (serie.upper() in f.profils_acceptes.upper() or 'TOUS' in f.profils_acceptes.upper()) and f.moyenne_requise <= moy]
        else:
            qs = list(qs)
            
        if not qs:
            if u_cible and terme_filiere:
                return f"⚠️ **Information :** La filière liée à « {terme_filiere} » n'est pas disponible ou accessible à {u_cible.sigle} avec ton profil.\n\n💡 **Suggestion :** Essaie un autre domaine ou une autre université !"
            elif u_cible:
                return f"⚠️ **Information :** Aucune filière accessible à {u_cible.sigle} ({u_cible.ville}) avec ton profil.\n\n💡 **Suggestion :** Veux-tu explorer d'autres universités ?"
            else:
                return f"⚠️ **Information :** Aucune filière liée à « {terme_filiere} » trouvée pour ton profil.\n\n💡 **Suggestion :** Pourrais-tu utiliser d'autres mots-clés (ex: informatique, santé, mines) ?"
                
        lines = []
        if u_cible and terme_filiere:
            lines.append(f"🎓 **Filières liées à « {terme_filiere} » à {u_cible.sigle} ({u_cible.ville})**\n")
        elif u_cible:
            lines.append(f"🏫 **{u_cible.nom} ({u_cible.sigle}) — {u_cible.ville}**")
            if u_cible.description:
                lines.append(f"{u_cible.description}\n")
            lines.append(f"Voici les filières pour toi :\n")
        else:
            lines.append(f"**Filières liées à « {terme_filiere} » :**\n")
            
        for f in qs[:5]:
            if not u_cible:
                lines.append(f"• **{f.nom}** — {f.universite.sigle} ({f.universite.ville})")
            else:
                lines.append(f"• **{f.nom}**")
            lines.append(f"  Conditions : Bac {f.profils_acceptes} | Moy ≥ {f.moyenne_requise}/20")
            if f.debouches:
                lines.append(f"  Opportunités & Débouchés : {f.debouches}")
            if f.conditions_admission:
                lines.append(f"  Admission : {f.conditions_admission}")
            lines.append("")
            
        if len(qs) > 5:
            lines.append(f"📌 ...et **{len(qs) - 5} autre(s) filière(s)** correspondante(s).")
            lines.append("*(Consulte l'onglet **Filières** dans le menu pour voir la liste complète !)*")
            
        return '\n'.join(lines)

    # FAQ depuis la DB
    if any(w in q_low for w in ['frais', 'logement', 'bourse', 'inscription', 'documents', 'dossier']):
        try:
            faqs = FAQEntry.objects.filter(question__icontains=q_low[:30])[:3]
            if faqs.exists():
                return "\n\n".join([f"**{f.question}**\n{f.reponse}" for f in faqs])
        except Exception:
            pass

    # Calendrier depuis la DB
    if any(w in q_low for w in ['calendrier', 'date', 'rentrée', 'examen', 'parcoursup', 'inscription']):
        try:
            events = CalendrierEvent.objects.order_by('date_debut')[:5]
            if events.exists():
                lines = ["📅 **Calendrier académique :**\n"]
                for ev in events:
                    lines.append(f"• **{ev.titre}** — {ev.date_debut.strftime('%d/%m/%Y')}")
                    if ev.description:
                        lines.append(f"  {ev.description}")
                return '\n'.join(lines)
        except Exception:
            pass

    # Liste universités
    if any(w in q_low for w in ['université', 'établissement', 'liste', 'toutes']):
        try:
            unis = Universite.objects.all()
            if unis.exists():
                lines = ["Voici les universités disponibles :\n"]
                for u in unis:
                    lines.append(f"🏫 **{u.sigle}** — {u.nom} ({u.ville})")
                    lines.append(f"   {u.filieres.count()} filières | {u.capacite} places")
                return '\n'.join(lines) + "\n\nSur laquelle voulez-vous plus d'infos ?"
        except Exception:
            pass

    if 'filière' in q_low or 'option' in q_low:
        if serie and moy:
            return _recommander_db(serie, moy, prenom)

    if not serie and not deja_demande_bac:
        return (f"Pour t'orienter au mieux {prenom}, quelle est ta **série de bac** ?\n"
                f"(SE, SM, SS, SE-FA, SS-FA)")
    if serie and not moy and not deja_demande_moy:
        return f"Tu as un **Bac {serie}**. ✅\nQuelle est ta **moyenne au baccalauréat** (sur 20) ?"

    return (f"Je suis **OrientaBot** 🎓 — conseiller d'orientation pour les universités guinéennes.\n\n"
            f"Pose-moi une question ou dis-moi ta **série de bac** et ta **moyenne** !")


@api_view(['POST'])
@permission_classes([AllowAny])
def chat_anonyme(request):
    contenu = request.data.get('message', '').strip()
    if not contenu:
        return Response({'error': 'Message requis'}, status=400)
    historique = request.data.get('historique', [])
    messages = [{'role': m['role'], 'content': m.get('text', m.get('content', ''))} for m in historique]
    messages.append({'role': 'user', 'content': contenu})
    reponse = _call_llm(messages)
    return Response({'response': reponse})
