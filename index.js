const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const config = require("./config.json")
const fs = require("fs")
const path = require("path")

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