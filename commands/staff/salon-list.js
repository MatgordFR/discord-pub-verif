const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
const manager = require("../../utils/salons_pub_manager");

module.exports = {
    name: "salon-list",
    aliases: ["listpub", "salonlist"],
    run: async (message, _args, client) => {

        if (!message.member.roles.cache.has(config.Role_Staff)) {
            return message.reply(`**${config.emoji_inactif} Vous n'avez pas la permission d'utiliser cette commande.**`);
        }

        const salons = [...manager.salons];

        const description = salons.length
            ? salons.map((id, i) => `**${i + 1}.** <#${id}> (\`${id}\`)`).join("\n")
            : "Aucun salon pub configuré.";

        const embed = new EmbedBuilder()
            .setColor(config.color_principal)
            .setAuthor({ name: `📋 ➜ Salons pub`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(description)
            .setFooter({ text: `${salons.length} salon(s) configuré(s)`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
