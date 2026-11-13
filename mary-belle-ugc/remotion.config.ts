import { Config } from "@remotion/cli/config";

// Chromium local (l'environnement n'autorise pas le téléchargement auto de Remotion).
// Supprimez cette ligne si Remotion peut télécharger son navigateur sur votre machine.
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
