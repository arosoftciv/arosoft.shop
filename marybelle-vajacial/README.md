# Mary Belle Cosmetics — Pub « Soin Vajacial » (TikTok 9:16)

Livrables (`output/`)
- `MaryBelle_Vajacial_1080x1920.mp4` — vidéo finale, 44 s, 1080×1920, 30 i/s, H.264 + AAC
- `MaryBelle_Vajacial_Couverture_TikTok.png` — miniature TikTok
- `storyboard_preview.jpg` — planche de prévisualisation
- `soundtrack.m4a` — bande-son (musique d'ambiance seule, sans voix-off)

Découpage
| Temps | Scène | Voix-off prévue (non intégrée) |
|---|---|---|
| 0–4 s | Logo + accroche | « Vous connaissez le Vajacial ? » |
| 4–9 s | Définition | « C'est un soin du visage… pensé pour votre zone intime. » |
| 9–17 s | Images du soin (clip fourni, recadré : sans légende, sans filigrane, sans écran de fin) | — |
| 17–24 s | 4 bienfaits | « Il exfolie en douceur, purifie les pores, apaise après l'épilation, et unifie le teint. » |
| 24–33 s | **Prix** : SOIN VAJACIAL / À PARTIR DE 25 000 F CFA | « Et pour vous offrir ce moment de douceur, découvrez notre soin Vajacial à partir de vingt-cinq mille francs CFA. » |
| 33–44 s | Écran final (CTA) | « Mary Belle Cosmetics, à la Riviera Palmeraie, Abidjan. Réservez votre moment beauté, sur WhatsApp ou par appel. » |

Images du soin : `assets/clip/` = extrait 1,5 s → 9,5 s du clip fourni, recadré (x 110–576, y 165–685 sur 576×854)
pour exclure la légende et les deux positions du filigrane, sans flou ni retouche.

Régénérer
```
python3 make_audio.py   # bande-son (musique générée)
node render.js          # vidéo (capture image par image de ad.html)
node cover.js           # miniature
```
Prévisualisation live : ouvrir `ad.html?play` dans un navigateur (clic = son).

Voix-off : **désactivée pour l'instant** (`USE_VO=False` dans `make_audio.py`). La vidéo est rythmée par la musique seule.
Le texte prévu reste dans `audio/lines.txt`. Pour l'ajouter plus tard : déposer `audio/vo1.wav` … `vo5.wav`
(enregistrement humain), passer `USE_VO=True`, relancer `python3 make_audio.py` puis `node render.js`.
