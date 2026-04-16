const { EmbedBuilder, ActivityType } = require('discord.js')
const client = require("../index");
const config = require("../config.json");

client.once("clientReady", () => {

    console.log(`
                               #     #                                          ####### ######
                               ##   ##   ##   #####  ####   ####  #####  #####  #       #     #
                               # # # #  #  #    #   #    # #    # #    # #    # #       #     #
                               #  #  # #    #   #   #      #    # #    # #    # #####   ######
                               #     # ######   #   #  ### #    # #####  #    # #       #   #
                               #     # #    #   #   #    # #    # #   #  #    # #       #    #
                               #     # #    #   #    ####   ####  #    # #####  #       #     #

                                                   Crée par MatgordFR!
                                                     © 2026 Matgord, Inc.
                                             Github: https://github.com/MatgordFR
                                               X : https://x.com/matgordfr

Connecté au bot (Privée).
Développé par MatgordFR
`);

    const demarrerEmbed = new EmbedBuilder()
        .setColor(config.color_principal)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `${client.user.username} vient de redémarrer`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: '👥 Utilisateurs', value: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, inline: true },
        )
        .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
    client.channels.cache.get(config.Salon_Logs_Demarrage)?.send({ embeds: [demarrerEmbed] });

    const STATUS_TYPES = [ActivityType.Watching, ActivityType.Listening, ActivityType.Competing, ActivityType.Playing];
    let statusIndex = 0;

    setInterval(() => {
        client.user.setActivity({ name: `By: MatgordFR ©`, type: STATUS_TYPES[statusIndex++ % STATUS_TYPES.length] });
    }, 20000);
});
