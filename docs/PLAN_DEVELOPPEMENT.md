# AroSoft — Plan de développement

> **Statut : PROPOSITION — en attente de validation. Aucune implémentation ne démarre avant accord.**
> Version 0.2 — 12/11/2026 — Intègre l'extension « WhatsApp, cybersécurité et Chariow ».
> Référence technique : [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md).

## 1. Principes de livraison

- La sécurité n'est pas une phase finale : les contrôles (CI de sécurité, autorisation, journalisation masquée) sont posés **en phase 1** et s'appliquent à tout le code qui suit.
- Chaque phase se termine par une **porte de validation** : démonstration + critères d'acceptation vérifiés + accord explicite avant la phase suivante.
- Rien n'est mis en production sans la suite de tests de sécurité bloquante au vert.
- Aucune hypothèse non vérifiée sur Chariow : les points listés en §6.2 de l'architecture sont vérifiés (tests réels ou réponse du support) avant d'en dépendre.

## 2. Phases

Les durées sont des **estimations indicatives** pour une personne à temps plein, à recalibrer après validation de la pile technique.

### Phase 0 — Validation et cadrage (≈ 2 à 3 jours)

| Livrable | Détail |
|---|---|
| Décisions validées | Réponses aux questions du §4 (pile, hébergement, Academy, remboursements…). |
| Vérifications Chariow | Création d'une clé API de test à scopes minimaux ; vérification de `custom_metadata` dans `GET /v1/sales/{id}` ; question au support : événement/statut de remboursement, environnement de test (`api.staging.chariow.com`), personnalisation visuelle du checkout, payload d'un pack. |
| Modèle de menaces | Atelier sur le flux de paiement et l'accès aux contenus, validant la §6.9. |

**Porte 0** : architecture et plan validés.

### Phase 1 — Socle sécurisé (≈ 2 semaines)

| Livrable | Détail |
|---|---|
| Dépôt et CI | Structure du projet, lint, tests, protection de branche ; CI de sécurité : SAST (Semgrep), dépendances (OSV/npm audit), secrets (gitleaks), images (Trivy). |
| Environnements | Préproduction et production séparées, secrets en gestionnaire, CDN/WAF, origine non exposée, base et stockage privés. |
| En-têtes & CSP | CSP à nonce en `Report-Only` puis appliquée, HSTS et autres en-têtes. |
| Journalisation | Logger structuré avec masquage central + test « aucune donnée sensible dans les logs » ; journal d'audit append-only. |
| Sauvegardes | Sauvegarde chiffrée + premier test de restauration automatisé. |
| Documentation | `docs/security/asvs-checklist.md`, `docs/security/incident-response.md`, politique de mises à jour. |

**Porte 1** : CI de sécurité bloquante active, restauration testée avec succès.

### Phase 2 — Authentification, autorisation, administration (≈ 2 semaines)

| Livrable | Détail |
|---|---|
| Comptes | Inscription, vérification d'e-mail, connexion, réinitialisation, Argon2id, contrôle des mots de passe compromis. |
| Sessions | Cookies `__Host-`, `HttpOnly`, `Secure`, `SameSite`, rotation, révocation, CSRF. |
| MFA admin | TOTP + WebAuthn, codes de secours, réauthentification pour actions sensibles. |
| Autorisation | RBAC + contrôle de propriété, RLS en défense en profondeur. |
| Limitation de débit | Connexion, MFA, réinitialisation, inscription, API sensibles. |
| Tests | Matrice d'autorisation automatisée (rôle × route), tests IDOR, CSRF, sessions. |

**Porte 2** : un utilisateur non autorisé ne peut accéder à aucune route privée (tests verts).

### Phase 3 — Paramètres généraux et support WhatsApp (≈ 3 à 4 jours)

| Livrable | Détail |
|---|---|
| Paramètres généraux | Table `site_settings` + historique, écran d'administration, cache invalidé à la modification. |
| Bouton WhatsApp | Composant Shop + Academy, lien `wa.me` encodé, position, affichage mobile/ordinateur, pages masquées, accessibilité. |
| Messages contextuels | Modèles à variables en liste blanche, surcharge par produit. |
| Tests | Unitaires (encodage, validation du numéro, variables interdites), intégration (changement sans redéploiement), E2E Android/desktop, recette sur appareil Android réel. |

**Porte 3** : critères « bouton fonctionnel Android/ordinateur » et « changement sans redéploiement » validés.

### Phase 4 — Stockage privé et contenus Academy (≈ 1 semaine)

| Livrable | Détail |
|---|---|
| Stockage | Bucket privé, URL signées courtes délivrées après contrôle du droit. |
| Uploads admin | Liste blanche + octets magiques, taille max, antivirus, re-encodage d'images, noms aléatoires. |
| Droits | Table `entitlements` avec contraintes d'unicité ; lecture des contenus conditionnée au droit actif. |
| Tests | Accès sans droit, URL expirée/forgée, uploads malveillants. |

**Porte 4** : aucun contenu privé accessible sans droit valide.

### Phase 5 — Intégration Chariow : achat temps réel (≈ 2 semaines)

| Livrable | Détail |
|---|---|
| Client API | Client Chariow typé (Zod), timeouts, reprises, respect de `Retry-After`, budget de débit, clés séparées par usage. |
| Checkout | `POST /api/checkout` → `POST /v1/checkout` (avec `custom_metadata.order_ref`, `redirect_url`, `customer_ip`) ; gestion `payment` / `completed` / `already_purchased` ; enregistrement immédiat de `chariow_sale_id`. Lien boutique Chariow pour les types non pris en charge par l'API. |
| Récepteur Pulses | HMAC sur corps brut, temps constant, persistance + mise en file transactionnelle, réponse < 1 s. |
| File & workers | pg-boss, états (`received` → `granted`/`rejected`/`needs_review`/`retry`/`dead_letter`), backoff. |
| Vérification | Contrôles complets via `GET /v1/sales/{id}` (§6.5) avant toute attribution. |
| Attribution | Idempotente, un droit par produit, rattachement utilisateur ou e-mail vérifié. |
| Page de retour | Statut « vérification en cours », vérification active après 60 s. |
| Tests | Suite complète de fraude au paiement (§6.9), concurrence, Pulses réels de test et rejeu depuis l'onglet *Deliveries*. |

**Porte 5** : une notification falsifiée n'active rien ; une commande confirmée ne crée qu'un droit par produit.

### Phase 6 — Synchronisation, rapprochement, remboursements, import (≈ 1,5 semaine)

| Livrable | Détail |
|---|---|
| Catalogue | Synchronisation horaire + manuelle, miroir `chariow_products`, détection des changements. |
| Correspondances | Écran de mapping Chariow → Academy (packs inclus), journalisé, MFA. |
| Rapprochement | Tâches 5 min / 15 min / quotidienne (§6.10), santé des Pulses. |
| Remboursements | Détection `is_access_revoked`, révocation, action admin manuelle. |
| Import historique | Simulation, exécution par lots idempotente, rapport, suppression de la clé d'import. |
| Tests | Test de résilience : backend coupé pendant une vente → vente récupérée. |

**Porte 6** : une interruption du backend ne provoque la perte d'aucune vente (démontré).

### Phase 7 — Supervision et alertes (≈ 4 à 5 jours)

| Livrable | Détail |
|---|---|
| Tableau de supervision | Pulses, file, sync_runs, écarts, quota API, actions de reprise (§6.14). |
| Alertes | Toutes les alertes de la §8.2 de l'architecture, avec canal de notification à définir. |

### Phase 8 — Recette de sécurité et mise en production (≈ 1 semaine)

| Livrable | Détail |
|---|---|
| Tests | DAST (OWASP ZAP) en préproduction, revue de la checklist ASVS, revue manuelle du code sensible (paiement, autorisation). |
| Exploitation | Test de restauration complet, exercice de réponse à incident, runbooks. |
| Bascule | Configuration du Pulse de production (Chariow : Automations → Pulses), rotation des clés de test, CSP appliquée, surveillance renforcée 72 h. |

**Porte 8 (production)** : tous les critères de validation (§3) vérifiés et tests de sécurité bloquants au vert.

## 3. Critères de validation et phase de preuve

| Critère | Phase |
|---|---|
| Le bouton WhatsApp fonctionne sur Android et ordinateur | 3 |
| Le changement du numéro est effectif sans redéploiement | 3 |
| Un utilisateur non autorisé ne peut accéder à aucun contenu privé | 2, 4 |
| Une notification Chariow falsifiée ne permet pas d'activer un produit | 5 |
| Une commande confirmée n'attribue qu'un seul droit d'accès par produit | 5 |
| Une interruption du backend ne provoque pas la perte définitive d'une vente | 6 |
| Les sauvegardes permettent une restauration contrôlée | 1, 8 |
| Les tests de sécurité bloquants sont réussis avant production | 1 → 8 |

## 4. Décisions attendues avant implémentation

1. **Cahier des charges initial** : il n'est pas dans le dépôt. Faut-il le fournir pour aligner ce document sur les fonctionnalités de base (catalogue, pages, contenus Academy) ?
2. **Pile technique** : valider TypeScript / Next.js / PostgreSQL / pg-boss (architecture §3), ou imposer une autre pile.
3. **Hébergement** et CDN/WAF (ex. Cloudflare + hébergeur Node + PostgreSQL managé + stockage S3).
4. **AroSoft Academy** : plateforme à construire dans ce projet, ou outil existant ? Les cours Chariow (type *course*) sont-ils utilisés, ou Academy héberge-t-elle seule les contenus ?
5. **Mode d'achat** : checkout via l'API (`POST /v1/checkout`, recommandé : lien commande ↔ vente fiable, retour vers AroSoft) **ou** simple redirection vers la boutique `arosoft.mychariow.com` ? L'API impose de collecter le **téléphone** de l'acheteur.
6. **Remboursements** : Chariow ne documente pas d'événement de remboursement. Accepter une détection par rapprochement (délai ≤ 24 h) + révocation manuelle immédiate par un admin ?
7. **Achats historiques** : 92 clients existent sur Chariow. Importer tous les achats ? Envoyer un e-mail d'invitation aux clients importés ?
8. **Objectifs de reprise** : RPO 15 min / RTO 4 h conviennent-ils ?
9. **Canal d'alertes** : e-mail, WhatsApp, Slack, Telegram ?
