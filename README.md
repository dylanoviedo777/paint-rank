# PaintRank

Application web gamifiée pour gérer les peintres étudiants en équipe. Les peintres cochent leurs tâches quotidiennement et débloquent automatiquement des hausses de salaire après 14 jours de streak consécutifs.

---

## Table des matières

1. [Créer un projet Firebase](#1-créer-un-projet-firebase)
2. [Configurer firebase-config.js](#2-configurer-firebase-configjs)
3. [Changer le PIN admin](#3-changer-le-pin-admin)
4. [Déploiement — Firebase Hosting](#4-déploiement--firebase-hosting)
5. [Déploiement — Vercel](#5-déploiement--vercel)
6. [Partager les liens peintres](#6-partager-les-liens-peintres)
7. [Ajouter des peintres](#7-ajouter-des-peintres)
8. [Comprendre la logique de streak](#8-comprendre-la-logique-de-streak)
9. [Note de sécurité](#9-note-de-sécurité)

---

## 1. Créer un projet Firebase

> Aucune connaissance préalable de Firebase requise. Suivez ces étapes dans l'ordre.

1. Rendez-vous sur [https://console.firebase.google.com](https://console.firebase.google.com) et connectez-vous avec un compte Google.
2. Cliquez sur **"Ajouter un projet"** (ou "Create a project").
3. Donnez un nom au projet (ex : `paintrank-2025`) et cliquez **Continuer**.
4. Désactivez Google Analytics si vous ne voulez pas le tracking, puis cliquez **Créer le projet**.
5. Une fois le projet créé, cliquez **Continuer**.

### Activer Firestore

6. Dans le menu gauche, cliquez **Build → Firestore Database**.
7. Cliquez **Créer une base de données**.
8. Choisissez **"Start in test mode"** pour commencer (vous pourrez déployer les vraies règles après).
9. Choisissez la région la plus proche (ex : `nam5` pour Amérique du Nord).
10. Cliquez **Activer**.

### Déployer les règles de sécurité

11. Dans Firestore, cliquez sur l'onglet **Règles**.
12. Remplacez le contenu par celui du fichier `firestore.rules` de ce projet.
13. Cliquez **Publier**.

---

## 2. Configurer firebase-config.js

1. Dans la console Firebase, cliquez sur l'icône **engrenage (⚙)** → **Paramètres du projet**.
2. Faites défiler jusqu'à la section **"Vos applications"**.
3. Cliquez sur l'icône **web (</>)** pour enregistrer une application web.
4. Donnez un surnom (ex : `paintrank-web`) et cliquez **Enregistrer l'application**.
5. Firebase affiche un bloc `firebaseConfig`. Copiez les valeurs.

### Option A — Valeurs directement dans paintrank.html (recommandé)

Dans `paintrank.html`, cherchez ce bloc (section `=== FIREBASE INIT ===`) :

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  ...
};
```

Remplacez chaque `"YOUR_..."` par les vraies valeurs copiées depuis Firebase.

### Option B — Fichier séparé firebase-config.js

Remplissez `firebase-config.js` avec vos valeurs, puis ajoutez dans `paintrank.html` avant la balise `</head>` :

```html
<script src="firebase-config.js"></script>
```

---

## 3. Changer le PIN admin

Dans `paintrank.html`, cherchez la section `=== CONFIG ===` :

```js
// ⚠️  Changer ce PIN avant le déploiement
const ADMIN_PIN = "1234";
```

Remplacez `"1234"` par le PIN de votre choix. Le PIN peut contenir des chiffres et des lettres.

> **Important :** Ce PIN est visible dans le code source de la page. Voir la [note de sécurité](#9-note-de-sécurité).

---

## 4. Déploiement — Firebase Hosting

### Prérequis

- [Node.js](https://nodejs.org) installé (version 18+)
- Compte Firebase actif (projet créé à l'étape 1)

### Étapes

```bash
# 1. Installer Firebase CLI globalement
npm install -g firebase-tools

# 2. Se connecter à votre compte Firebase
firebase login

# 3. Dans le dossier du projet, initialiser Firebase Hosting
firebase init hosting

# Répondre aux questions :
#   → Sélectionnez votre projet PaintRank
#   → Public directory: . (point — le dossier actuel)
#   → Configure as single-page app: No
#   → Overwrite index.html: No (ou renommez paintrank.html en index.html)

# 4. Renommer paintrank.html → index.html (Firebase Hosting sert index.html par défaut)
mv paintrank.html index.html

# 5. Déployer
firebase deploy --only hosting
```

Votre app sera disponible à l'URL affichée (ex : `https://paintrank-abc12.web.app`).

---

## 5. Déploiement — Vercel

### Prérequis

- Compte [Vercel](https://vercel.com) (gratuit)
- [Node.js](https://nodejs.org) installé

### Étapes

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Renommer le fichier principal
mv paintrank.html index.html

# 3. Dans le dossier du projet
vercel

# Répondre aux questions :
#   → Set up and deploy: Y
#   → Link to existing project: N
#   → Project name: paintrank (ou autre)
#   → In which directory is your code located: ./
#   → Override settings: N
```

Vercel déploie automatiquement et vous donne une URL (ex : `https://paintrank.vercel.app`).

Pour redéployer après modifications : `vercel --prod`

---

## 6. Partager les liens peintres

Chaque peintre a un lien personnel basé sur son nom dans Firestore.

### Format du lien

```
https://votre-app.web.app/#painter/prenom
```

### Exemples

- `https://paintrank.web.app/#painter/alex` → profil d'Alex
- `https://paintrank.web.app/#painter/marie` → profil de Marie

### Notes

- Le nom dans l'URL doit correspondre exactement au champ `name` dans Firestore (sensible à la casse — utilisez des minuscules).
- Partagez le lien via SMS ou iMessage — les peintres peuvent l'ajouter à l'écran d'accueil de leur téléphone pour un accès rapide.
- Si un peintre arrive sur `#painter` sans nom, un menu déroulant s'affiche pour qu'il sélectionne son profil.

---

## 7. Ajouter des peintres

1. Ouvrez l'app dans votre navigateur.
2. Naviguez vers `#admin`.
3. Entrez votre PIN admin.
4. Dans l'onglet **"Peintres & Équipes"**, cliquez **"+ Ajouter"**.
5. Renseignez :
   - **Nom** — prénom ou identifiant unique (ex : `alex`)
   - **Équipe** — nom de l'équipe (ex : `Équipe Rouge`)
6. Cliquez **Créer**.

Le peintre démarre au niveau `base` ($17.00/hr) et peut immédiatement commencer à cocher les tâches du Module 1.

**Maximum : 20 peintres actifs simultanément.**

---

## 8. Comprendre la logique de streak

### Définitions

| Type de jour | Condition | Effet sur le streak |
|---|---|---|
| **Streak day** | Le peintre a ouvert l'app ET coché toutes les tâches du module actif | +1 au compteur |
| **Neutral day** | Le peintre n'a ouvert aucun check-in ce jour-là (aucun document Firestore) | Ignoré — le streak ne progresse pas mais ne se brise pas |
| **Fail day** | Le peintre a ouvert l'app MAIS n'a pas coché toutes les tâches | Le streak repart à 0 |

> **Exemple :** Un peintre fait 5 streak days, oublie d'ouvrir l'app 2 jours (neutral), puis fait 9 streak days de plus → son streak est 14 → il monte de niveau automatiquement.

### Algorithme

1. L'app part d'aujourd'hui et remonte dans le temps.
2. Elle s'arrête au premier **fail day** rencontré.
3. Elle compte tous les **streak days** entre ce point de reset et aujourd'hui.
4. Les **neutral days** dans cette fenêtre sont sautés (ni comptés, ni bloquants).

### Déblocage automatique

Quand le compteur atteint exactement 14 streak days :
- Le module actif est marqué comme complété (`currentModule` avancé dans Firestore)
- Le salaire est mis à jour automatiquement (`payRate`)
- Une animation de célébration s'affiche pour tous les viewers connectés en temps réel
- L'événement est enregistré dans le journal d'activité (`action: "levelup"`)

> **Master Painter Prime** est la seule exception : il n'est **jamais déclenché automatiquement**. L'admin doit l'activer manuellement via le panneau Admin → Overrides (bouton "⬆ Forcer niveau suivant" visible seulement quand le peintre a complété le Module 3C) ou via le toggle ⭐ dans l'onglet Peintres & Équipes.

### Reversal (annulation automatique)

Si une tâche cochée est décochée (par le peintre ou par l'admin via Overrides) :
- L'algorithme de streak est recalculé depuis zéro
- Si le compteur tombe sous 14, le niveau est **automatiquement rétrogradé** (`currentModule` et `payRate` revertés)
- L'événement est enregistré dans le journal d'activité (`action: "leveldown"`)
- L'admin peut aussi forcer manuellement un level down via le bouton "⬇ Level down" dans l'onglet Overrides

> **Note technique :** La rétrogradation automatique ne recule que d'un seul module par recalcul. Si un admin décoche des tâches sur plusieurs jours passés via Overrides, la rétrogradation ne s'applique qu'un module à la fois. Pour des réajustements plus importants, utilisez le bouton "⬇ Level down" manuellement.

---

## 9. Note de sécurité

**Le PIN admin est visible dans le code source de la page.**

Ce design est intentionnel. PaintRank est une application de confiance utilisée dans un contexte privé entre un manager et ses peintres. La sécurité repose sur :

- Un PIN admin que seul le manager connaît (changeable à tout moment)
- Des peintres qui opèrent de bonne foi
- Aucune donnée sensible (pas de mots de passe, pas d'informations financières confidentielles)

Les règles Firestore empêchent la suppression du journal d'activité mais n'empêchent pas un utilisateur malveillant qui lirait le code source de modifier des données. **Ne déployez pas PaintRank dans un contexte où les données doivent être protégées de manière cryptographique.**

Si vous avez besoin d'une sécurité renforcée, il faudrait intégrer Firebase Authentication avec des rôles — ce qui dépasse la portée de ce projet.
