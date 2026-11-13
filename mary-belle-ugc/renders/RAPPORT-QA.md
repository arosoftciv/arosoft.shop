# Rapport de contrôle qualité — Mary Belle Cosmetics « Soin Vajacial »

Date : 13/11/2026 · Version : **v1 finale** (lip-sync OmniHuman 1.5, 720p)

Fichiers : `mary-belle-vajacial.mp4` · `mary-belle-vajacial-sans-musique.mp4` · `mary-belle-vajacial.srt`

## Verdict

**Diffusable**, avec une réserve : le visage dérive légèrement au fil des 59 s générées par OmniHuman (voir « Identité »). Tout le reste est conforme.

## Contrôles

| Contrôle | Résultat | Détail |
|---|---|---|
| Format TikTok 9:16 | ✅ | 1080 × 1920, 30 i/s, H.264 (CRF 18) + AAC 256 kb/s, 60,0 s |
| Hook dès la 1re seconde | ✅ | Elle parle à 0,16 s ; aucun logo d'introduction |
| Synchronisation labiale | ✅ | Décalage audio mesuré entre la vidéo OmniHuman et la voix-off : 0,00 s. Les plans parlés sont recalés sur la timeline globale |
| Gestes naturels | ✅ | Mouvements de tête, sourires, clignements, un geste de la main à 8 s ; rien d'exagéré |
| Identité constante | ⚠️ | Fidèle au début (0 à 10 s). Ensuite, le visage s'arrondit légèrement, la coiffure varie un peu et le décor change (autres portes, étagère). Les taches de rousseur, les boucles d'oreilles, le collier et la robe restent cohérents |
| Teint bronzé, imperfections, pas d'effet plastique | ✅ / ⚠️ | Teint chaud et taches de rousseur conservés ; peau un peu plus lisse que sur la photo vers la fin |
| Résolution du personnage | ⚠️ | OmniHuman en 720p (704 × 1248), agrandi en 1080 × 1920. Le 1080p est refusé au-delà de 30 s d'audio |
| Prix exact | ✅ | « 25 000 F CFA » (texte et voix) ; carte de prix placée sous le visage |
| Numéro exact | ✅ | « +225 07 88 84 52 44 » ; groupes révélés en synchro avec la voix |
| Localisation exacte | ✅ | « RIVIERA PALMERAIE — ABIDJAN » |
| Logo | ✅ | Logo fourni : scène découverte, écran WhatsApp, signature (hors visage) et carton final |
| Mention personnage IA | ✅ | Permanente, en haut, lisible |
| Images non présentées comme réelles | ✅ | Libellé « Images d'illustration » sur chaque plan illustratif |
| Absence de promesse médicale | ✅ | « Soin esthétique » ; nettoyage, exfoliation douce, hydratation ; douceur, hygiène, confort ; aucune certification ni allégation de traitement |
| Aucune nudité / geste intime | ✅ | Institut, cabine, produits, gants, esthéticienne ; illustration abstraite non anatomique |
| Bouton CTA | ✅ | Bouton visuel, non présenté comme cliquable |
| Texte de la voix-off | ✅ | Conforme au script (transcription Scribe) ; balises de jeu non prononcées |
| Coupures vocales | ✅ | Aucune ; pauses naturelles de 0,36 à 0,58 s |
| Niveau sonore | ✅ | −16,1 LUFS intégré, crête vraie −2,8 dBTP |
| Musique | ✅ | Présente sous la voix (13 %), remontée sur la fin ; absente de la version « sans musique » (fin du film : −29 dB contre −40 dB) |
| Lisibilité smartphone | ✅ | Sous-titres 66 px sur fond brun translucide ; prix à 190 px ; sous-titres masqués pendant la carte de prix |
| Zones de sécurité TikTok | ✅ | Texte hors des 360 px du bas et de la colonne d'icônes à droite |
| Accent ivoirien | ⚠️ | Voix « africaine francophone » de la bibliothèque ElevenLabs (aucune voix étiquetée ivoirienne) ; à valider à l'écoute sur place |
| Netteté des images d'illustration | ⚠️ | Rendues en 16:9 puis recadrées en 9:16 (agrandissement ≈ ×1,7) ; un peu douces |

## Améliorations possibles

1. **Identité + 1080p** : régénérer seulement les 4 plans parlés (≈ 27 s au total), chacun repartant de la photo. La dérive serait plus faible, en 1080p puisque chaque plan dure moins de 30 s. Il faut une voix par plan. Estimation à confirmer avant lancement.
2. **Images d'illustration** : les régénérer en 9:16 natif (≈ 4 900 crédits).

## Coûts engagés (ElevenLabs, crédits)

| Poste | Crédits (≈) |
|---|---|
| Voix-off (2 prises) | 2 422 |
| Musique (2 prises) | 1 920 |
| Effets sonores (16) | 267 |
| Images (24) | 19 632 |
| Lip-sync OmniHuman 1.5 (720p, 59 s) | 56 541 |
| **Total** | **≈ 80 780** |
