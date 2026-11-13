# Mary Belle Cosmetics — Publicité UGC + motion design « Soin Vajacial »

Vidéo verticale TikTok 1080 × 1920, 30 i/s, environ 60 s. Elle mêle un personnage IA qui parle (UGC) et des animations Remotion (React/TypeScript).

> Témoignage **scénarisé**, joué par un **personnage IA fictif**. La mention « Mise en scène publicitaire — personnage IA » reste à l'écran pendant toute la vidéo.

## État de la production

| Élément | État | Source |
|---|---|---|
| Voix-off (58,4 s, accent africain francophone) | ✅ | ElevenLabs v4, voix « Ropako-voice », prise 1 |
| Horodatage mot à mot | ✅ | ElevenLabs Scribe → `src/captions/words.json` |
| Musique afro-R&B instrumentale (64 s) | ✅ | ElevenLabs Music v2.5 |
| Effets sonores (pop, whoosh, scintillement, notification) | ✅ | ElevenLabs SFX v2 |
| Images d'illustration (6 plans) | ✅ (16:9 recadré en 9:16) | Seedream 5 Pro |
| Motion design, sous-titres, prix, écran WhatsApp, signature | ✅ | Remotion |
| **Personnage parlant lip-syncé** | ⏳ **en attente** | OmniHuman 1.5 (ElevenLabs) — crédits insuffisants |

Tant que `MEDIA.talkingHead` vaut `null`, les plans du personnage affichent la photo fixe avec un filigrane **« APERÇU — LIP-SYNC EN ATTENTE »**. Ce rendu **n'est pas diffusable**.

## Finaliser le lip-sync

1. Recharger les crédits ElevenLabs : il en faut environ 56 600 (≈ 10,3 $) pour OmniHuman 1.5 en 720p sur 59 s. En 1080p, le modèle refuse l'audio au-delà de 30 s.
2. Ouvrir le flow ElevenLabs « Mary Belle Cosmetics — UGC Vajacial ». Le nœud **« Personnage parlant — lip-sync (OmniHuman) »** y est déjà relié à la photo de référence et à la voix-off retenue. Lancer ce nœud.
3. Télécharger la vidéo obtenue dans `public/video/talking-head.mp4`. Elle doit couvrir **toute** la voix-off, sur la même timeline.
4. Dans `src/config/brand.ts`, remplacer `talkingHead: null` par `talkingHead: "video/talking-head.mp4"`.
5. Lancer `npm run render`, puis `npm run render:nomusic`.

Chaque plan parlé est calé automatiquement sur la timeline globale (`trimBefore`). La synchronisation lèvres / voix / sous-titres est donc conservée sans retouche.

## Commandes

```bash
npm install
# Hors-ligne / proxy : utiliser un Chromium local
export REMOTION_CHROME=/chemin/vers/chrome-headless-shell   # facultatif
npm run studio          # prévisualisation interactive
npm run render          # renders/mary-belle-vajacial.mp4
npm run render:nomusic  # renders/mary-belle-vajacial-sans-musique.mp4
npm run srt             # renders/mary-belle-vajacial.srt
npm run typecheck
```

## Modifier facilement

Tout se règle dans **`src/config/brand.ts`** :

- `BRAND.price`, `BRAND.whatsappDisplay`, `BRAND.whatsappGroups`, `BRAND.location`, `BRAND.city`, `BRAND.cta`, `BRAND.tagline`, `BRAND.disclaimer`
- `BRAND.logo` : chemin d'un logo dans `public/`, par exemple `"logo/logo.png"`. Avec `null`, un logotype typographique est affiché.
- `COLORS` : la palette (rose poudré, champagne, doré, brun profond, ivoire)
- `AUDIO_MIX` : volume de la voix, de la musique sous la voix et des effets
- `MEDIA` : les chemins des médias

Les repères de synchronisation et la durée des scènes sont dans **`src/config/timeline.ts`**. Ils sont tirés des horodatages réels de la voix-off.

> ⚠️ **Si vous changez le prix ou le numéro**, la *voix* continuera de prononcer l'ancien texte. Il faut alors régénérer la voix-off, relancer `npm run srt`, recaler `timeline.ts` et refaire le lip-sync.

## Arborescence

```
assets/      originaux : character/, audio/ (prises brutes), images/ (candidates + sélection), video/, logo/
public/      médias utilisés au rendu (audio traité, images 9:16, polices, photo)
src/config/  brand.ts (configuration) · timeline.ts (synchro)
src/scenes/  TalkingScenes · BRollScenes · EndScenes (10 scènes)
src/components/ TalkingHead · BRoll (Ken Burns) · Graphics · Icons · fonts
src/captions/ words.json · Captions (sous-titres dynamiques)
src/animations/ helpers d'animation
scripts/     build-srt.mjs
renders/     exports (MP4 non versionnés), SRT, rapport QA
```

## Droits

- **Voix, musique, effets, images** : générés avec ElevenLabs. L'usage commercial est couvert par les forfaits payants ElevenLabs ; vérifiez que votre forfait l'inclut.
- **Polices** : Playfair Display et Montserrat, sous licence SIL Open Font License (usage commercial autorisé), hébergées localement.
- **Images d'institut** : illustratives, générées par IA. Le libellé « Images d'illustration » est affiché à l'écran. Elles ne représentent pas l'établissement réel.
