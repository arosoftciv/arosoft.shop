# Mary Belle Cosmetics — Pub « Soin Vajacial » (TikTok 9:16)

Livrables (`output/`)
- `MaryBelle_Vajacial_1080x1920.mp4` — vidéo finale, 68 s, 1080×1920, 30 i/s, H.264 + AAC
- `MaryBelle_Vajacial_Couverture_TikTok.png` — miniature TikTok
- `storyboard_preview.jpg` — planche de prévisualisation
- `soundtrack.m4a` — bande-son (voix-off + musique mixées)

Découpage (hook → problème causé par le rasoir → émotion → solution → différence avec l'épilation → preuve → résultats → prix → action)
| Temps | Scène | Texte à l'écran |
|---|---|---|
| 0–6,6 s | **Hook** | MESDAMES… (rasoir barré) STOP au rasoir ! · sur votre maillot · RESTEZ JUSQU'À LA FIN ↓ |
| 6,6–15,9 s | Méfaits du rasoir | LE RASOIR… coupe le poil à ras · … et il repousse sous la peau : Poils incarnés · Boutons & irritations · Taches sombres · Peau rugueuse |
| 15,9–19,5 s | Émotion | Vous méritez de vous sentir belle… partout. |
| 19,5–25,1 s | Solution | LA SOLUTION · Vajacial · Un soin du visage… pensé pour votre zone intime |
| 25,1–36,5 s | **Vajacial ≠ épilation** | L'ÉPILATION enlève le poil · LE VAJACIAL soigne la peau · Adieu le rasoir |
| 36,5–42,5 s | Preuve en images | LE SOIN EN CABINE (clip recadré) · Pores désincrustés, peau libérée |
| 42,5–49,1 s | Résultats | Peau nette & lisse · Moins de poils incarnés · Teint plus uniforme · Bien dans votre peau |
| 49,1–57,1 s | Prix | SOIN VAJACIAL · À PARTIR DE · 25 000 F CFA |
| 57,1–68 s | Appel à l'action | Réservez votre moment beauté ! · Riviera Palmeraie — Abidjan · WhatsApp & Appels +225 07 88 84 52 44 |

Voix-off : voix féminine « Louise – Warm & Authentic French Voice » (ElevenLabs, modèle eleven_v4).
Prises : `audio/voixoff_elevenlabs_louise.mp3` + `audio/voixoff_elevenlabs_louise_v2_hook_rasoir.mp3` (hook, rasoir, épilation) ; découpée en 9 phrases `audio/vo01.wav` … `vo09.wav`
(texte dans `audio/lines.txt`), chacune calée au début de sa scène (`offs` dans `make_audio.py`).
Logo miniature permanent en haut à droite (masqué sur l'intro et l'écran final, où le grand logo est déjà présent).

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
