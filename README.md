<div align="center">

# 📢 discord-pub-verif

**Un bot Discord qui met chaque publicité postée en file de validation staff — avec logs, sanctions automatiques et leaderboard des vérificateurs.**

![Licence ISC](https://img.shields.io/badge/Licence-ISC-blue?style=flat-square)
![Node.js ≥18](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?style=flat-square&logo=node.js&logoColor=white)
![discord.js v14](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white)
![Vérification de pubs](https://img.shields.io/badge/Vérification-Publicités-7700ff?style=flat-square)
[![by MatgordFR](https://img.shields.io/badge/by-MatgordFR-121011?style=flat-square&logo=github&logoColor=white)](https://github.com/MatgordFR)

</div>

---

## ✨ En deux mots

- 🔎 **Vérification automatique** : chaque pub postée dans un salon surveillé génère un embed de contrôle dans un salon staff privé, avec des boutons **Valider** / **Refuser**.
- 🧾 **Logs séparés** : validations et refus sont journalisés dans des salons dédiés, et un refus motivé déclenche un avertissement dans le salon sanction.
- 🏆 **Leaderboard** : le bot compte les vérifications par membre du staff et affiche un top 10 ; il peut être archivé et réinitialisé.
- 🗂️ **Salons dynamiques** : ajout / retrait des salons pub surveillés à chaud, sans redémarrer le bot.
- 🛡️ **Config validée au démarrage** : le bot refuse de se lancer si `config.json` est incomplet, avec un message d'erreur clair.

---

## 📑 Sommaire

- [🧩 Prérequis](#-prérequis)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [▶️ Lancement](#️-lancement)
- [⌨️ Commandes & vérification](#️-commandes--vérification)
- [🛠️ Dépannage](#️-dépannage)
- [🗂️ Structure](#️-structure)
- [📄 Licence](#-licence)

---

## 🧩 Prérequis

- **[Node.js 18+](https://nodejs.org/)** (`node -v` pour vérifier).
- Un **bot Discord** créé sur le [Discord Developer Portal](https://discord.com/developers/applications).
- Les **Privileged Gateway Intents** activés dans le portail :
  - ✅ **Server Members Intent**
  - ✅ **Message Content Intent** (indispensable : le bot lit le contenu des pubs)
- Les commandes sont à **préfixe** (`.` par défaut) : **aucun enregistrement de slash commands n'est nécessaire**.

---

## 📦 Installation

```bash
git clone https://github.com/MatgordFR/discord-pub-verif.git
cd discord-pub-verif
npm install
cp config.example.json config.json
```

Puis ouvre `config.json` et remplis-le (voir [Configuration](#-configuration)).

---

## 🔧 Configuration

Toutes les valeurs se règlent dans `config.json`.

> ⚠️ **Ne partage jamais ton `token`.** `config.json` est déjà listé dans `.gitignore`.

| Clé | Description |
|---|---|
| `token` | Token de ton bot Discord. |
| `prefix` | Préfixe des commandes (ex. `.`). |
| `cooldown` | Délai (en secondes) entre deux utilisations d'une commande. |
| `serverID` | ID du serveur où le bot vérifie les pubs. |
| `Role_Administrateur` | ID du rôle autorisé pour les commandes admin. |
| `Role_Staff` | ID du rôle autorisé pour les commandes staff. |
| `Salon_Verif_Pub` | Salon staff privé où arrivent les embeds de vérification. |
| `Salon_Sanction` | Salon où sont postés les avertissements. |
| `Salon_leaderboard` | Salon où sont archivés les leaderboards. |
| `Salon_Logs_Verif_valide` | Salon de logs des pubs validées. |
| `Salon_Logs_Verif_refuser` | Salon de logs des pubs refusées. |
| `Salon_Logs_Demarrage` | Salon de logs au démarrage du bot. |
| `Salon_commande_bot` | Salon de logs des commandes utilisées. |
| `color_principal` / `color_sanction` / `color_automessage` | Couleurs d'embed, format `#RRGGBB`. |
| `emoji_automsg`, `emoji_bot`, `emoji_warning`, `emoji_actif`, `emoji_inactif` | Emojis d'habillage des messages. |

> 🧪 **Validation au démarrage** — au lancement, le bot vérifie que `config.json` existe et que les clés essentielles (`token`, `serverID`, `Salon_Verif_Pub`) sont présentes et non vides, et que `token` n'est plus la valeur d'exemple. Sinon il affiche un message `[CONFIG] …` et s'arrête.

---

## ▶️ Lancement

```bash
npm start
```

> 💡 Équivalent : `node index.js`.

Au démarrage, le bot se connecte à Discord, poste un embed de démarrage dans le salon de logs, active un statut rotatif, puis écoute les salons pub configurés.

---

## ⌨️ Commandes & vérification

### 🔎 Comment marche la vérification

```
Un membre poste une pub dans un salon surveillé
        │
        ▼
Le bot envoie un embed dans le salon de vérification (staff privé),
avec le contenu de la pub + boutons d'action
        │
   ┌────┴─────┐
   │          │
✅ Valider    ❌ Refuser (4 motifs)
   │          │
   ▼          ▼
Log validé   Log refusé + avertissement dans le salon sanction
             (sauf motif « Aucune raison »)
```

Chaque action incrémente le compteur du membre du staff dans le leaderboard. Un rappel des règles (auto-message) est reposté dans le salon pub après chaque publicité.

**Motifs de refus disponibles :** Non-respect des TOS Discord · Publicité sans description · Publicité dans le mauvais salon · Aucune raison. Seuls les refus **avec** un motif précis (≠ « Aucune raison ») déclenchent un avertissement dans le salon sanction.

### 👮 Commandes staff (rôle `Role_Staff`)

| Commande | Alias | Description |
|---|---|---|
| `.leaderboard` | `lb`, `topverif`, `veriftop` | Affiche le top 10 des vérificateurs pub. |
| `.salon-list` | `listpub`, `salonlist` | Liste les salons pub configurés. |
| `.help` | `aide` | Affiche l'aide adaptée au rôle. |

### 🔐 Commandes administrateur (rôle `Role_Administrateur`)

| Commande | Alias | Description |
|---|---|---|
| `.salon-add <#salon>` | `addpub`, `salonadd` | Ajoute un salon à la surveillance pub. |
| `.salon-remove <#salon>` | `removepub`, `salonremove` | Retire un salon de la surveillance pub. |
| `.leaderboard-restore` | `lr`, `restore` | Archive le leaderboard puis le remet à zéro (redémarre le bot). |

---

## 🛠️ Dépannage

| Symptôme | Piste |
|---|---|
| `[CONFIG] config.json invalide …` au démarrage | Une clé essentielle manque ou est vide, ou `token` est encore la valeur d'exemple. Complète `config.json`. |
| `[CONFIG] config.json introuvable …` | Copie `config.example.json` vers `config.json`. |
| Le bot ne démarre pas / erreur d'auth | Vérifie que le `token` est valide et à jour. |
| `Cannot find module` | Relance `npm install`. |
| Le bot ne détecte pas les pubs | Vérifie le **Message Content Intent** et que le salon est bien ajouté via `.salon-add`. |
| Les embeds de vérification n'arrivent pas | Vérifie l'ID `Salon_Verif_Pub` et les permissions du bot dans ce salon. |
| Les commandes ne répondent pas | Vérifie le `prefix` et les rôles `Role_Staff` / `Role_Administrateur`. |
| Les boutons ne répondent plus | Redémarre le bot (les interactions ont une durée de vie limitée côté Discord). |

---

## 🗂️ Structure

```
discord-pub-verif/
├─ index.js                  ← Point d'entrée : validation config, handlers, login
├─ config.example.json       ← Modèle de configuration (à copier en config.json)
├─ package.json              ← Dépendances et scripts
├─ LICENSE                   ← Licence ISC
├─ commands/
│  ├─ admin/
│  │  ├─ salon-add.js            ← Ajoute un salon pub
│  │  ├─ salon-remove.js         ← Retire un salon pub
│  │  └─ leaderboard-restore.js  ← Archive et réinitialise le leaderboard
│  └─ staff/
│     ├─ leaderboard.js          ← Top des vérificateurs
│     ├─ salon-list.js           ← Liste les salons pub
│     └─ help.js                 ← Aide selon le rôle
├─ events/
│  ├─ ready.js               ← Bannière de démarrage + statut rotatif
│  ├─ messageCreate.js       ← Détection des pubs + gestion des commandes
│  └─ interactionCreate.js   ← Traitement des boutons de vérification
├─ utils/
│  ├─ salons_pub_manager.js  ← État en mémoire + persistance des salons pub
│  └─ leaderboard_builder.js ← Formatage du leaderboard
├─ data/
│  ├─ salons_pub.json        ← Salons pub actifs
│  └─ top_verif_pub.json     ← Données du leaderboard
└─ image/
   └─ automsg.jpg            ← Image de l'auto-message
```

---

## 📄 Licence

Distribué sous licence **ISC** © 2026 MatgordFR — voir [LICENSE](LICENSE).

---

<div align="center">

Fait avec ❤️ par **MatgordFR** · [@matgordfr](https://x.com/matgordfr)

[GitHub](https://github.com/MatgordFR) · [X](https://x.com/matgordfr)

</div>
