# Mary Belle Cosmetics — Pub « Soin Vajacial » (TikTok 9:16)

Livrables (`output/`)
- `MaryBelle_Vajacial_1080x1920.mp4` — vidéo finale, 56 s, 1080×1920, 30 i/s, H.264 + AAC
- `MaryBelle_Vajacial_Couverture_TikTok.png` — miniature TikTok
- `storyboard_preview.jpg` — planche de prévisualisation
- `soundtrack.m4a` — bande-son (musique d'ambiance seule, sans voix-off)

Découpage (logique persuasive : problème → émotion → solution → preuve → résultats → déclencheur → prix → action)
| Temps | Scène | Texte à l'écran |
|---|---|---|
| 0–3,6 s | Accroche + logo | « Vous connaissez le Vajacial ? » |
| 3,6–10 s | Problèmes vécus | MESDAMES… Ça vous parle ? (au niveau du maillot) : Poils incarnés · Boutons après le rasage · Taches sombres · Peau rugueuse & irritée |
| 10–13,5 s | Émotion | « Vous méritez de vous sentir belle… partout. » — même là où personne ne regarde |
| 13,5–18 s | Solution | LA SOLUTION · Vajacial · Un soin du visage… pensé pour votre zone intime |
| 18–25 s | Preuve en images | LE SOIN EN CABINE (clip recadré) · « Pores désincrustés, peau libérée » |
| 25–31,5 s | Résultats | LES RÉSULTATS · Confiance : Peau nette & lisse · Moins de poils incarnés · Teint plus uniforme · Bien dans votre peau |
| 31,5–35,5 s | Moment idéal | Avant vos vacances · Avant un grand jour · ou simplement… pour vous |
| 35,5–44 s | **Prix** | SOIN VAJACIAL · À PARTIR DE · 25 000 F CFA |
| 44–56 s | Appel à l'action | Marque, soin, prix « À partir de », « Réservez votre moment beauté ! », Riviera Palmeraie — Abidjan, WhatsApp & Appels +225 07 88 84 52 44 |

Voix-off prévue (non intégrée) : voir `audio/lines.txt`.

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
