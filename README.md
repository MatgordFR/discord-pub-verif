<div align="center">

# 📢 OrpheaPub

### 🔎 Un bot Discord de vérification et modération des publicités

<div align="center">
    <a href="https://discord.com/users/689890476811354242">
        <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white"/>
    </a>
    <a href="https://x.com/matgordfr">
        <img src="https://img.shields.io/badge/X-%23000000.svg?style=for-the-badge&logo=X&logoColor=white"/>
    </a>
    <a href="https://github.com/MatgordFR">
        <img src="https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/>
    </a>
</div>

</div>

---

## 🌟 Présentation

**OrpheaPub** est un bot Discord conçu pour automatiser la vérification des publicités postées dans des salons dédiés. Chaque message posté dans un salon pub configuré génère un embed de vérification avec des boutons d'action pour le staff. Le bot gère également un leaderboard des vérificateurs les plus actifs.

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🔎 **Vérification pub** | Crée automatiquement un embed de vérification avec boutons pour chaque pub postée |
| ✅ **Validation / ❌ Refus** | Le staff valide ou refuse chaque pub avec un motif précis |
| 📋 **Logs détaillés** | Enregistre chaque action (validation, refus) dans des salons de logs dédiés |
| ⚠️ **Sanction automatique** | Envoie un avertissement dans le salon sanction lors d'un refus motivé |
| 🏆 **Leaderboard** | Classe les membres du staff par nombre de pubs vérifiées |
| 🗂️ **Gestion des salons** | Ajoute ou retire des salons pub dynamiquement sans redémarrer le bot |
| 🔄 **Réinitialisation** | Archive et réinitialise le leaderboard en une commande |
| 📩 **Auto-message** | Poste automatiquement un rappel des règles après chaque pub |
| 📊 **Statut rotatif** | Affiche une activité Discord qui change toutes les 20 secondes |

---

## 🗂️ Structure du projet

```
📁 OrpheaPub/
├── 📄 index.js                  ← Point d'entrée, chargement des commandes et events
├── 🔧 config.json               ← Token, IDs Discord, couleurs et emojis
├── 📦 package.json              ← Dépendances et scripts
├── 📖 README.md                 ← Ce fichier
│
├── 📁 commands/
│   ├── 📁 admin/
│   │   ├── 🔐 salon-add.js          ← Ajoute un salon à la liste pub
│   │   ├── 🔐 salon-remove.js       ← Retire un salon de la liste pub
│   │   └── 🔐 leaderboard-restore.js ← Archive et réinitialise le leaderboard
│   └── 📁 staff/
│       ├── 👮 leaderboard.js        ← Affiche le top des vérificateurs
│       ├── 👮 salon-list.js         ← Liste les salons pub configurés
│       └── 👮 help.js               ← Affiche l'aide selon le rôle
│
├── 📁 events/
│   ├── ✅ ready.js              ← Bannière de démarrage + statut rotatif
│   ├── 💬 messageCreate.js      ← Détection des pubs + système de commandes
│   └── 🖱️ interactionCreate.js  ← Traitement des boutons de vérification
│
├── 📁 utils/
│   ├── 🗃️ salons_pub_manager.js  ← Gestion en mémoire + persistance des salons pub
│   └── 🏆 leaderboard_builder.js ← Utilitaire de formatage du leaderboard
│
├── 📁 data/
│   ├── 📄 salons_pub.json        ← Liste des salons pub actifs
│   └── 📄 top_verif_pub.json     ← Données du leaderboard
│
└── 📁 image/
    └── 🖼️ automsg.jpg            ← Image de l'auto-message
```

---

## 📦 Installation

### 1️⃣ Prérequis

Avant de commencer, assure-toi d'avoir :

- ✅ [Node.js v18+](https://nodejs.org/) installé
- ✅ Un bot Discord créé sur le [Discord Developer Portal](https://discord.com/developers/applications)
- ✅ Les **Privileged Gateway Intents** activés : `Server Members Intent` et `Message Content Intent`

> 💡 **Vérifier Node.js** — ouvre un terminal et tape :
> ```bash
> node -v
> ```

---

### 2️⃣ Cloner le projet

```bash
git clone https://github.com/MatgordFR/OrpheaPub.git
cd OrpheaPub
```

---

### 3️⃣ Installer les dépendances

```bash
npm install
```

| Package | Rôle |
|---|---|
| `discord.js` | Librairie principale pour interagir avec l'API Discord |

---

## 🔧 Configuration

Modifie le fichier `config.json` avec tes propres valeurs :

```json
{
    "token": "TON_TOKEN_ICI",
    "prefix": ".",
    "cooldown": 3,

    "serverID": "ID_DU_SERVEUR",

    "Role_Administrateur": "ID_DU_ROLE_ADMIN",
    "Role_Staff":          "ID_DU_ROLE_STAFF",

    "Salon_Verif_Pub":          "ID_SALON_VERIFICATION",
    "Salon_Sanction":           "ID_SALON_SANCTION",
    "Salon_leaderboard":        "ID_SALON_LEADERBOARD",
    "Salon_Logs_Verif_valide":  "ID_SALON_LOGS_VALIDATIONS",
    "Salon_Logs_Verif_refuser": "ID_SALON_LOGS_REFUS",
    "Salon_Logs_Demarrage":     "ID_SALON_LOGS_DEMARRAGE",
    "Salon_commande_bot":       "ID_SALON_LOGS_COMMANDES",

    "color_principal":   "7700ff",
    "color_sanction":    "ff0004",
    "color_automessage": "7700ff",

    "emoji_automsg": "📢",
    "emoji_bot":     "🐺",
    "emoji_warning": "⚠️",
    "emoji_actif":   "✅",
    "emoji_inactif": "❌"
}
```

> ⚠️ **Ne partage jamais ton `token` publiquement !** Ajoute `config.json` dans ton `.gitignore`.

| Clé | Description |
|---|---|
| `token` | Token de ton bot Discord |
| `prefix` | Préfixe des commandes (ex: `.`) |
| `cooldown` | Délai en secondes entre deux utilisations d'une commande |
| `serverID` | ID du serveur Discord où le bot est actif |
| `Role_Administrateur` | ID du rôle pouvant utiliser les commandes admin |
| `Role_Staff` | ID du rôle pouvant utiliser les commandes staff |
| `Salon_Verif_Pub` | Salon privé où les embeds de vérification sont envoyés |
| `Salon_Sanction` | Salon où les avertissements sont postés |
| `Salon_leaderboard` | Salon où les archives de leaderboard sont postées |
| `Salon_Logs_Verif_valide` | Salon de logs pour les pubs validées |
| `Salon_Logs_Verif_refuser` | Salon de logs pour les pubs refusées |
| `Salon_Logs_Demarrage` | Salon de logs au démarrage du bot |
| `Salon_commande_bot` | Salon de logs pour les commandes utilisées |

---

## ▶️ Lancer le bot

```bash
npm start
```

Le bot va :
1. 🔗 Se connecter à Discord
2. 📩 Envoyer un embed de démarrage dans le salon de logs
3. 🎭 Activer le statut rotatif
4. 👂 Écouter les messages dans les salons pub configurés

---

## 🛠️ Commandes

> Le préfixe par défaut est `.`

### 👮 Staff

| Commande | Aliases | Description |
|---|---|---|
| `.leaderboard` | `lb`, `topverif`, `veriftop` | Affiche le top 10 des vérificateurs pub |
| `.salon-list` | `listpub`, `salonlist` | Liste tous les salons pub configurés |
| `.help` | `aide` | Affiche la liste des commandes disponibles |

### 🔐 Administrateur

| Commande | Aliases | Description |
|---|---|---|
| `.salon-add <#salon>` | `addpub`, `salonadd` | Ajoute un salon à la liste de surveillance pub |
| `.salon-remove <#salon>` | `removepub`, `salonremove` | Retire un salon de la liste de surveillance pub |
| `.leaderboard-restore` | `lr`, `restore` | Archive le leaderboard actuel et le remet à zéro |

---

## 🔎 Fonctionnement de la vérification

```
Membre poste une pub dans un salon configuré
        │
        ▼
OrpheaPub envoie un embed dans #vérif-pub (privé staff)
avec le contenu de la pub + boutons d'action
        │
   ┌────┴────┐
   │         │
✅ Valider   ❌ Refuser (4 motifs)
   │         │
   ▼         ▼
Log validé  Log refusé + avertissement si motif précis
```

### Motifs de refus disponibles

| Bouton | Motif |
|---|---|
| ❌ Non respect TOS | Non-respect des TOS Discord |
| ❌ Sans description | Publicité sans description |
| ❌ Mauvais salon | Publicité dans le mauvais salon |
| ❌ Aucune raison | Aucune raison |

> 💡 Seuls les refus avec un motif précis (≠ "Aucune raison") déclenchent un avertissement dans le salon sanction.

---

## ⚠️ Dépannage

| Problème | Solution |
|---|---|
| Le bot ne démarre pas | Vérifie que ton `token` est valide dans `config.json` |
| Les commandes ne répondent pas | Vérifie que le préfixe dans `config.json` correspond à celui que tu utilises |
| `Cannot find module` | Relance `npm install` |
| Le bot ne détecte pas les messages | Vérifie que `Message Content Intent` est activé dans le Developer Portal |
| Les embeds de vérification n'arrivent pas | Vérifie l'ID de `Salon_Verif_Pub` et les permissions du bot dans ce salon |
| Les boutons ne répondent plus | Redémarre le bot (les interactions ont une durée de vie limitée côté Discord) |
| Leaderboard vide après `.leaderboard-restore` | Normal — le bot redémarre pour recharger les données |

---

<div align="center">

Fait avec ❤️ By: MatgordFR © 2026

</div>
