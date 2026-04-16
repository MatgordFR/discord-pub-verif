const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
const fs = require("fs");
const path = require("path");
const { buildLeaderboardDescription } = require("../../utils/leaderboard_builder");

const PUB_PATH = path.join(__dirname, "../../data/top_verif_pub.json");

module.exports = {
    name: "leaderboard-restore",
    aliases: ['lr', 'restore'],
    run: async (message, _args, client) => {

        if (!message.member.roles.cache.has(config.Role_Administrateur)) {
            return message.reply(`**${config.emoji_inactif} Vous n'avez pas la permission d'utiliser cette commande.**`);
        }

        let pub;
        try {
            pub = JSON.parse(fs.readFileSync(PUB_PATH, "utf8"));
        } catch {
            return message.reply(`**${config.emoji_inactif} Impossible de lire les données du leaderboard.**`);
        }

        const description = buildLeaderboardDescription(pub, client);

        const archiveEmbed = new EmbedBuilder()
            .setColor(config.color_principal)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor({ name: `🧸 ➜ Archive Leaderboard`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(description)
            .setFooter({ text: `Réinitialisé par ${message.author.username} • By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        const channel = client.channels.cache.get(config.Salon_leaderboard)
            ?? await client.channels.fetch(config.Salon_leaderboard).catch(() => null);
        await channel?.send({ embeds: [archiveEmbed] });

        fs.writeFileSync(PUB_PATH, JSON.stringify({}));

        await message.reply(`**${config.emoji_actif} Le leaderboard a été archivé et sera vide dans quelques secondes, attendez que le bot redémarre.**`);

        process.exit();
    },
};
