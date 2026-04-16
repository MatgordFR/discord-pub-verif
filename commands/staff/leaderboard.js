const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");
const fs = require("fs");
const path = require("path");
const { buildLeaderboardDescription } = require("../../utils/leaderboard_builder");

const PUB_PATH = path.join(__dirname, "../../data/top_verif_pub.json");

module.exports = {
    name: "leaderboard",
    aliases: ['lb', 'topverif', 'veriftop'],
    run: async (message, _args, client) => {

        if (!message.member.roles.cache.has(config.Role_Staff)) {
            return message.reply(`**${config.emoji_inactif} Vous n'avez pas la permission d'utiliser cette commande.**`);
        }

        let pub;
        try {
            pub = JSON.parse(fs.readFileSync(PUB_PATH, "utf8"));
        } catch {
            return message.reply(`**${config.emoji_inactif} Impossible de lire les données du leaderboard.**`);
        }

        const description = buildLeaderboardDescription(pub, client);

        const leaderboardPubEmbed = new EmbedBuilder()
            .setColor(config.color_principal)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor({ name: `🧸 ➜ Top Vérification Pub`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(description)
            .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.reply({ embeds: [leaderboardPubEmbed] });
    },
};
