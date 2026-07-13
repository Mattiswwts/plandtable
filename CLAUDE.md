# plandtable.fr — Plan de table de mariage à placement automatique

## Contexte produit

Outil web qui PLACE automatiquement les invités d'un mariage selon des contraintes, là où tous les concurrents (Mariages.net, Canva, apps gratuites) ne proposent que du glisser-déposer manuel. C'est LE différenciateur : l'algorithme de placement sous contraintes.

Parcours utilisateur cible :
1. L'utilisateur colle ou saisit sa liste d'invités
2. Il crée ses tables (rondes ou rectangulaires, capacité variable)
3. Il déclare ses contraintes en langage simple ("X et Y ensemble", "A et B séparés", "près de la table d'honneur", "équilibrer les tables")
4. L'algo propose un placement en un clic
5. Il ajuste au glisser-déposer si besoin
6. Il exporte en PDF (plan par table + liste alphabétique)

Utilisable SANS créer de compte. Tout tourne côté navigateur. C'est une arme contre les gros sites qui forcent l'inscription.

## Modèle économique (verrouillé, ne pas rediscuter)

- Gratuit et complet jusqu'à 30 invités (démo honnête)
- Au-delà de 30 invités : l'algo place et le plan s'affiche, mais modifications, régénérations, mises à jour et exports PDF nécessitent le déblocage à 19€ one-shot (Stripe Payment Link)
- On vend "le compagnon jusqu'au jour J", pas un PDF figé
- Le paywall n'a pas besoin d'être inviolable, juste plus pratique que la triche

## Stack technique (verrouillée)

- React + Vite, JavaScript (pas de TypeScript pour aller vite, sauf si déjà en place)
- Aucun backend : tout côté navigateur
- Sauvegarde : localStorage (auto-save à chaque modification)
- Hébergement : Vercel, déploiement auto à chaque push sur main
- Paiement : Stripe Payment Link (pas d'API Stripe complexe)
- Export PDF : jsPDF ou react-to-print, au choix selon simplicité
- Canvas des tables : SVG (pas de lib canvas lourde)
- Pas de lib d'état externe (Redux etc.) : useState/useReducer + Context suffisent

## Modèle de données

Un seul objet `project` sérialisé en localStorage :

```js
{
  version: 1,
  name: "Mariage Julie & Thomas",
  guests: [
    { id, name, tags: [] }        // tags libres : "famille mariée", "enfant", etc.
  ],
  tables: [
    { id, label, shape: "round" | "rect", capacity, x, y }
  ],
  constraints: [
    // guestIds peut contenir plusieurs invités pour une contrainte de groupe
    // (ex : tous les invités tagués "Famille"), auquel cas label décrit le groupe.
    { id, type: "together" | "apart" | "nearTable" | "farFromTable", guestIds: [], tableId: null, label: null }
  ],
  placement: {
    // guestId -> { tableId, seatIndex }
  },
  unlocked: false                  // passé à true après paiement
}
```

## Architecture des composants

- `App` : racine de routage (`react-router-dom`) — header/footer du site partagés, `<Routes>` vers toutes les pages
- `PlannerApp` : l'outil de planification lui-même (ex-contenu de `App`), état global du projet, auto-save localStorage — intégré directement sous le hero de `HomePage`, pas de page séparée
- `GuestPanel` : ajout manuel + zone de collage d'une liste brute (une ligne = un invité, tolérant numérotation/tirets/puces ; la virgule n'est plus un séparateur de noms, cf. Notes) + tagging des invités (Famille/Amis/Collègues/Enfants)
- `TablePanel` : création/édition des tables (forme, capacité, label)
- `TableCanvas` : rendu SVG des tables avec sièges, invités placés affichés autour, sélection puis placement au toucher (voir Notes sur le "glisser-déposer")
- `ConstraintBuilder` : construction de contraintes par phrases cliquables ; peut cibler un invité seul ou un groupe entier par tag pour "près/loin d'une table"
- `SolveButton` : lance l'algo, affiche le nombre de contraintes satisfaites/violées
- `ExportPanel` : boutons d'export PDF, verrouillés si `guests.length > 30 && !unlocked`
- `Paywall` : modale de déblocage avec le lien Stripe
- `SiteHeader` / `SiteFooter` : navigation du site, communs à toutes les pages
- Pages (`src/pages/`) : `HomePage`, 3 pages SEO, `PricingPage` (`/tarifs`), `PaymentSuccessPage` (`/deblocage-reussi`, cible de la redirection Stripe), `MentionsLegales`, `CGV`, `Confidentialite`

## Algorithme de placement (cœur du produit)

Recuit simulé (simulated annealing), suffisant pour 200 invités max :

1. Placement initial aléatoire respectant les capacités
2. Fonction de coût : somme des pénalités
   - "together" : +10 si tables différentes, +4 si même table mais pas côte à côte (la contrainte porte sur l'adjacence des sièges, pas juste sur le fait de partager une table — sinon deux invités "ensemble" peuvent se retrouver aux deux bouts opposés d'une même table)
   - "apart" : +10 uniquement si les deux invités sont assis côte à côte (même table mais non adjacents = pas de pénalité)
   - "nearTable"/"farFromTable" : proportionnelle à la distance réelle entre la table de l'invité et la table ciblée (calculée sur la disposition du plan), pas un simple binaire "cette table ou pas" — sinon être à la table juste à côté de la table d'honneur est aussi pénalisé que d'être à l'autre bout de la salle
   - déséquilibre des tables : +1 par écart au remplissage moyen
3. Mutations à chaque itération (au hasard parmi) : échanger deux invités entre deux tables, échanger deux sièges au sein d'une même table (change qui est adjacent à qui), ou déplacer un invité vers une table avec de la place. Accepter si le coût baisse, accepter parfois si le coût monte (température décroissante)
4. Quelques milliers d'itérations = instantané dans le navigateur
5. Afficher à l'utilisateur les contraintes non satisfaites s'il en reste (avec les noms concernés)

Géométrie des tables et sièges centralisée dans `src/utils/tableGeometry.js` (adjacence des sièges, empreinte d'une table) et `src/utils/tableLayout.js` (positionnement des tables sans chevauchement) — réutilisés à la fois par `TableCanvas` (affichage) et `solver.js` (calcul des contraintes de proximité), pour que le coût optimisé corresponde toujours à ce que l'utilisateur voit à l'écran.

## Règles de développement

- Chaque jour de dev produit quelque chose de VISIBLE et testable dans le navigateur
- Pas de feature non listée ici avant la mise en ligne. Aucune.
- Pas de sur-ingénierie : pas de tests unitaires exhaustifs à ce stade, pas d'abstractions prématurées
- Mobile-first sérieux : les futurs mariés bossent beaucoup sur téléphone
- Textes de l'interface en français
- Design sobre et rassurant, thème mariage léger (pas de rose criard) : blanc cassé, typographie élégante (Playfair Display pour les titres, Inter pour le texte courant, via Google Fonts), accent doré + vert sauge
- Commits fréquents avec messages courts

## Roadmap

- [x] J0 : domaine plandtable.fr acheté (OVH), repo GitHub, déploiement Vercel
- [x] J1 : modèle de données + GuestPanel (saisie + collage de liste) + TablePanel
- [x] J2-3 : algorithme de placement sous contraintes + ConstraintBuilder
- [x] J4 : TableCanvas SVG avec glisser-déposer d'ajustement
- [x] J5 : exports PDF (plan par table + liste alphabétique) + auto-save localStorage
- [x] J6 : paywall Stripe Payment Link + flag unlocked
- [x] J7-8 : page d'accueil avec démo jouable sans inscription + 3-4 pages SEO ("plan de table mariage", "comment placer les invités mariage", "logiciel plan de table gratuit")
- [x] J9 : branchement du domaine plandtable.fr sur Vercel (déjà fait, vérifié), robots.txt/sitemap.xml/canonical prêts pour Search Console, vérification mobile complète en production
- [ ] J10 : contenus de lancement (vidéos TikTok/Pinterest format "6 embrouilles familiales placées en 10 secondes", post honnête sur un forum mariage)

## Statut actuel

J1 à J8 implémentés et testés dans le navigateur (Playwright, desktop + mobile) : modèle de données, GuestPanel (+ tagging), TablePanel, ConstraintBuilder (invité seul ou groupe par tag), algo de placement (recuit simulé), TableCanvas SVG, ExportPanel (PDF), Paywall, routage complet (`react-router-dom`) avec page d'accueil, 3 pages SEO, page tarifs, page de confirmation de paiement, et pages légales.

**⚠️ Bloquant avant mise en ligne — mentions légales à compléter :** `src/pages/MentionsLegales.jsx` et `src/pages/CGV.jsx` contiennent des `<span className="placeholder">[...]</span>` pour la raison sociale, le statut juridique, le SIRET et l'adresse — impossible à deviner, à remplir avec vos vraies informations avant tout paiement réel. Ne pas déployer en prod tant que ce n'est pas fait (obligation légale pour une activité facturée en France).

Stripe : le vrai Payment Link est configuré dans `src/config.js`. Reste à faire côté dashboard Stripe : régler l'URL de redirection post-paiement sur `https://plandtable.fr/deblocage-reussi` (la page `PaymentSuccessPage` débloque le projet local à l'arrivée sur cette route).

`vercel.json` ajouté avec une règle de rewrite (`/(.*) → /index.html`), nécessaire pour que les routes fonctionnent en accès direct sur Vercel (SPA côté client, pas de SSR) — à vérifier une fois le domaine branché (J9).

Refonte visuelle effectuée sur retour direct ("le site est moche") : polices Playfair Display (titres, en italique sur les gros titres) + Inter (texte), palette réchauffée et éclaircie, cartes avec liseré doré→sauge en haut, boutons avec ombre/relief, un motif botanique SVG maison en décor du hero (`BotanicalSprig`, masqué sous 900px). Cohérent sur tout le site (outil + pages marketing + pages légales).

**Bug de design corrigé** : `color-scheme: light dark` + un bloc `@media (prefers-color-scheme: dark)` faisaient basculer tout le site vers un thème quasi-noir sur les navigateurs/OS en thème sombre, sans que l'utilisateur s'en rende compte — c'était très probablement la cause du retour "le site est sombre". Le site force maintenant `color-scheme: light` et n'a plus qu'un seul thème (le thème clair voulu), quel que soit le réglage système du visiteur.

Pas d'images photo dans le design : je n'ai pas accès à de vraies photos et je ne dois pas inventer d'URLs d'images externes (risque de lien mort/non libre de droits). Si des photos sont ajoutées un jour, les héberger dans `public/` (fichiers fournis par l'utilisateur), jamais via une URL externe devinée.

Note d'implémentation sur `TableCanvas` : le placement d'un invité sur un siège est en tap-to-place (sélectionner un invité puis toucher un siège) plutôt qu'en drag-and-drop natif HTML5, pour un comportement fiable au toucher sur mobile. En revanche, les **tables elles-mêmes** sont déplaçables par un vrai glisser (pointer events, `svg.getScreenCTM()` pour la conversion écran→coordonnées SVG) — leur position (`table.x`/`table.y`) est persistée dans le projet. À la création, une nouvelle table est placée automatiquement à un endroit libre (`findFreeTablePosition` dans `tableLayout.js`) sans chevaucher les tables existantes, mais rien n'empêche l'utilisateur de les faire chevaucher ensuite s'il le fait exprès (pas de contrainte dure, cohérent avec l'esprit "pas besoin d'être inviolable" du reste du produit).

Note sur les contraintes "ensemble"/"séparés" : elles portent sur l'adjacence réelle des sièges (pas juste le fait de partager une table), et "près/loin d'une table" est pondéré par la distance réelle entre tables sur le plan (position réelle `table.x`/`table.y`, donc cohérent avec les positions déplacées à la main).

`TableCanvas` affiche le nom complet de chaque invité (plus des initiales), positionné radialement à l'extérieur de son siège via `seatLabelPosition` (jamais vers la table, donc jamais de chevauchement) — voir `src/utils/tableGeometry.js`. Le viewBox du plan est recalculé à partir de l'étendue réelle des labels (`estimateTextWidth`, approximation par nombre de caractères, pas de mesure DOM) pour ne jamais couper un nom long. L'espacement automatique entre tables (`NAME_LABEL_SPACE` dans `tableGeometry.js`, `GAP` dans `tableLayout.js`) est calé large (~23 caractères) car une table ne connaît pas encore les invités qui y seront assis au moment où elle est positionnée — en cas de noms très longs sur des tables voisines, l'utilisateur peut toujours les écarter à la main (glisser-déposer des tables).

Décision produit actée avec l'utilisateur : pas de configuration de la salle par IA conversationnelle (nécessiterait un backend/clé API et un coût variable par utilisation, en contradiction avec le "aucun backend" verrouillé) — remplacé par le tagging manuel des invités + contraintes de groupe, qui couvre le même besoin ("table famille", "table amis") sans ces inconvénients.

**Incident résolu (J9)** : aucun commit n'avait jamais été poussé au-delà du tout premier commit `init` (template Vite vide) — tout le travail J1-J8 n'existait qu'en local. Vercel déployait donc en continu la version vide d'origine, d'où un 404 après redirection Stripe vers `/deblocage-reussi`. Poussé sur `main` (commit `830b6c5`) ; **toujours vérifier `git status`/`git log` avant de considérer une session "terminée"**, un travail non poussé ne sert à rien en production.

J9 : le domaine plandtable.fr était déjà branché sur Vercel (fait avant cette session, hors de mon contrôle). Vérifié que `http(s)://plandtable.fr` et `http://www.plandtable.fr` redirigent proprement vers `https://www.plandtable.fr` (200, pas de boucle). Ajouté `public/robots.txt` et `public/sitemap.xml` — **attention** : sans fichier réel, le rewrite SPA de `vercel.json` les interceptait et servait du HTML à leur place (bug corrigé). `usePageMeta` gère maintenant aussi une balise `<link rel="canonical">` par page et un `<meta name="robots">` (utilisé pour passer `PaymentSuccessPage` en `noindex` : page transactionnelle, pas de contenu à indexer). `index.html` a aussi une meta description et un canonical statiques par défaut (fallback avant exécution du JS).

**Bug mobile trouvé en testant sur le vrai site avec un profil iPhone (`devices['iPhone 13']` de Playwright, pas juste un viewport 390px manuel)** : `.inline-form` (GuestPanel, TablePanel) n'avait pas `flex-wrap: wrap`, et le bouton "Ajouter une table" (`white-space: nowrap`) ne pouvait pas rétrécir sous sa largeur de texte — ça poussait toute la ligne hors du viewport et créait un scroll horizontal sur la page entière. Un simple screenshot ne le montrait pas franchement ; c'est la mesure programmatique (`scrollWidth > clientWidth`) qui l'a révélé. Corrigé.

Search Console : je ne peux pas faire la vérification moi-même (nécessite le compte Google de l'utilisateur). Le terrain est prêt côté code (sitemap, robots.txt, canonical) ; il reste à l'utilisateur d'aller sur https://search.google.com/search-console, ajouter la propriété `https://www.plandtable.fr`, vérifier (méthode DNS TXT chez OVH la plus simple, ou balise HTML), puis soumettre `https://www.plandtable.fr/sitemap.xml`.

Prochaine étape : J10 (contenus de lancement), une fois les mentions légales complétées et Search Console vérifié côté utilisateur.
