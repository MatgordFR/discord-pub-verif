const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const fs = require("fs")
const path = require("path")

//|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Chargement & validation config |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

let config;
try {
    config = require("./config.json");
} catch {
    console.error("[CONFIG] config.json introuvable ou illisible.");
    console.error("[CONFIG] Copie config.example.json vers config.json et remplis-le.");
    process.exit(1);
}

const requis = ["token", "serverID", "Salon_Verif_Pub"];
const manquants = requis.filter(k => !config[k] || String(config[k]).trim() === "");
if (config.token === "TON_TOKEN_ICI") manquants.push("token (c'est encore la valeur d'exemple)");
if (manquants.length) {
    console.error(`[CONFIG] config.json invalide — clés manquantes ou vides : ${manquants.join(", ")}.`);
    console.error("[CONFIG] Copie config.example.json vers config.json et remplis-le.");
    process.exit(1);
}

// Normalise les couleurs d'embed : accepte "RRGGBB" ou "#RRGGBB", sinon blurple Discord par défaut.
for (const k of ["color_principal", "color_sanction", "color_automessage"]) {
    const v = String(config[k] ?? "").trim();
    config[k] = /^#?[0-9a-fA-F]{6}$/.test(v) ? "#" + v.replace(/^#/, "") : "#5865F2";
}

const client = new Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message],
})

module.exports = client;

client.cooldowns = new Collection();
client.commands = new Collection();

//|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Commandes Handler |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

for (const folder of fs.readdirSync(path.join(__dirname, "commands"))) {
    const folderPath = path.join(__dirname, "commands", folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith(".js"))) {
        const command = require(path.join(folderPath, file));
        client.commands.set(command.name, command);
    }
}

//|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Event Handler |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

const eventFiles = fs.readdirSync(path.join(__dirname, "events")).filter(f => f.endsWith(".js"));
for (const file of eventFiles) {
    require(path.join(__dirname, "events", file));
}

//|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Anti Crash |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

client.on("error", (error) => {
    console.error(`[ERREUR CLIENT] ${error}`);
});

process.on("unhandledRejection", (error) => {
    if (error.code === 10062) return;
    console.error(`[ERREUR] ${error}`);
});

client.login(config.token);