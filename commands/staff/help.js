const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

const COMMANDES_STAFF = [
    { nom: "leaderboard", aliases: "lb, topverif, veriftop", desc: "Affiche le top des vérifications pub." },
    { nom: "salon-list",  aliases: "listpub, salonlist",     desc: "Liste les salons pub configurés."      },
    { nom: "help",        aliases: "aide",                   desc: "Affiche ce message d'aide."            },
];

const COMMANDES_ADMIN = [
    { nom: "salon-add",          aliases: "addpub, salonadd",   desc: "Ajoute un salon à la liste pub."      },
    { nom: "salon-remove",       aliases: "removepub, salonremove", desc: "Retire un salon de la liste pub." },
    { nom: "leaderboard-restore", aliases: "lr, restore",        desc: "Réinitialise le leaderboard."        },
];

module.exports = {
    name: "help",
    aliases: ["aide"],
    run: async (message, _args, client) => {

        const isAdmin = message.member.roles.cache.has(config.Role_Administrateur);
        const isStaff = message.member.roles.cache.has(config.Role_Staff);

        if (!isStaff && !isAdmin) {
            return message.reply(`**${config.emoji_inactif} Vous n'avez pas la permission d'utiliser cette commande.**`);
        }

        const formatLigne = ({ nom, aliases, desc }) =>
            `**\`${config.prefix}${nom}\`** *(${aliases})*\n${desc}`;

        const embed = new EmbedBuilder()
            .setColor(config.color_principal)
            .setAuthor({ name: `${config.emoji_bot} ➜ Aide`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👮 Staff", value: COMMANDES_STAFF.map(formatLigne).join("\n\n") },
            );

        if (isAdmin) {
            embed.addFields(
                { name: "🔐 Administrateur", value: COMMANDES_ADMIN.map(formatLigne).join("\n\n") },
            );
        }

        embed
            .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
