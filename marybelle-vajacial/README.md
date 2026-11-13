# Mary Belle Cosmetics — Pub « Soin Vajacial » (TikTok 9:16)

Livrables (`output/`)
- `MaryBelle_Vajacial_1080x1920.mp4` — vidéo finale, 36 s, 1080×1920, 30 i/s, H.264 + AAC
- `MaryBelle_Vajacial_Couverture_TikTok.png` — miniature TikTok
- `storyboard_preview.jpg` — planche de prévisualisation
- `soundtrack.m4a` — voix-off + musique mixées

Découpage
| Temps | Scène | Voix-off |
|---|---|---|
| 0–4 s | Logo + accroche | « Vous connaissez le Vajacial ? » |
| 4–9 s | Définition | « C'est un soin du visage… pensé pour votre zone intime. » |
| 9–16 s | 4 bienfaits | « Il exfolie en douceur, purifie les pores, apaise après l'épilation, et unifie le teint. » |
| 16–25 s | **Prix** : SOIN VAJACIAL / À PARTIR DE 25 000 F CFA | « Et pour vous offrir ce moment de douceur, découvrez notre soin Vajacial à partir de vingt-cinq mille francs CFA. » |
| 25–36 s | Écran final (CTA) | « Mary Belle Cosmetics, à la Riviera Palmeraie, Abidjan. Réservez votre moment beauté, sur WhatsApp ou par appel. » |

Régénérer
```
python3 make_audio.py   # bande-son (audio/vo*.wav + musique générée)
node render.js          # vidéo (capture image par image de ad.html)
node cover.js           # miniature
```
Prévisualisation live : ouvrir `ad.html?play` dans un navigateur (clic = son).

Voix-off actuelle : synthèse locale (espeak-ng + MBROLA fr4) faute de service TTS disponible.
Pour la diffusion, remplacer `audio/vo1.wav` … `vo5.wav` par un enregistrement humain (mêmes textes, voir `audio/lines.txt`)
puis relancer les deux premières commandes ; ajuster les décalages `offs` dans `make_audio.py` si les durées changent.
