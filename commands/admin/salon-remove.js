const config = require("../../config.json");
const manager = require("../../utils/salons_pub_manager");

module.exports = {
    name: "salon-remove",
    aliases: ["removepub", "salonremove"],
    run: async (message, args) => {

        if (!message.member.roles.cache.has(config.Role_Administrateur)) {
            return message.reply(`**${config.emoji_inactif} Vous n'avez pas la permission d'utiliser cette commande.**`);
        }

        const channelId = args[0]?.replace(/[<#>]/g, "");
        if (!channelId || !/^\d+$/.test(channelId)) {
            return message.reply(`**${config.emoji_inactif} Usage : \`${config.prefix}salon-remove <#salon>\`**`);
        }

        if (!manager.salons.has(channelId)) {
            return message.reply(`**${config.emoji_inactif} Le salon <#${channelId}> n'est pas dans la liste des salons pub.**`);
        }

        manager.retirer(channelId);
        message.reply(`**${config.emoji_actif} Le salon <#${channelId}> a été retiré des salons pub.**`);
    },
};
