const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const client = require("../index");
const config = require("../config.json");
const { salons: SALONS_PUB } = require("../utils/salons_pub_manager");
const fs = require("fs");
const path = require("path");

const AUTOMSG_PATH  = path.join(__dirname, "../image/automsg.jpg");
const AUTOMSG_FILES = fs.existsSync(AUTOMSG_PATH) ? [AUTOMSG_PATH] : [];

const BOUTONS_REFUS = {
    "refus_tos":    { label: "Non-respect TOS",  style: ButtonStyle.Danger    },
    "refus_desc":   { label: "Sans description",  style: ButtonStyle.Danger    },
    "refus_salon":  { label: "Mauvais salon",     style: ButtonStyle.Danger    },
    "refus_aucune": { label: "Aucune raison",     style: ButtonStyle.Secondary },
};

let MENTION_REGEX = null; // Initialisé au premier message (client.user disponible)

const ROW_BOUTONS = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("valider").setLabel("✅ Valider").setStyle(ButtonStyle.Success),
    ...Object.entries(BOUTONS_REFUS).map(([id, { label, style }]) =>
        new ButtonBuilder().setCustomId(id).setLabel(`❌ ${label}`).setStyle(style)
    )
);

//|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Message Handler |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

client.on("messageCreate", async (message) => {

    if (message.author.bot || !message.guild) return;
    if (!message.channel.permissionsFor(client.user.id)?.has(["SendMessages", "ViewChannel"])) return;

    //|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Commandes Handler |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

    MENTION_REGEX ??= new RegExp(`^<@!?${client.user.id}>`);

    if (MENTION_REGEX.test(message.content)) {
        return message.reply(`**${config.emoji_bot} Je ne dispose d'aucune commande. Je suis simplement un système de vérification pub.**`);
    }

    if (message.content.startsWith(config.prefix)) {
        const args = message.content.trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const cmdKey = commandName.slice(config.prefix.length);
        const command = client.commands.get(cmdKey) || client.commands.find(cmd => cmd.aliases?.includes(cmdKey));

        if (command) {
            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Map());
            }

            const timeNow = Date.now();
            const tStamps = client.cooldowns.get(command.name);
            const cdAmount = (command.cooldown || config.cooldown) * 1000;

            if (tStamps.has(message.author.id)) {
                const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;
                if (timeNow < cdExpirationTime) {
                    const timeLeft = ((cdExpirationTime - timeNow) / 1000).toFixed(0);
                    return message.reply(`**${config.emoji_inactif} Veuillez attendre \`${timeLeft}\` seconde(s) avant de ré-utiliser la commande.**`);
                }
            }
            tStamps.set(message.author.id, timeNow);
            setTimeout(() => tStamps.delete(message.author.id), cdAmount);

            const logsEmbed = new EmbedBuilder()
                .setColor(config.color_principal)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setAuthor({ name: 'LOGS COMMANDES', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**Membre :** ${message.author.username}\n**ID :** ${message.author.id}\n\n**Commande :** \`${commandName}\``)
                .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
            client.channels.cache.get(config.Salon_commande_bot)?.send({ embeds: [logsEmbed] });

            command.run(message, args, client).catch(err => {
                console.error(`[COMMANDE ${command.name}]`, err);
                message.reply(`**${config.emoji_inactif} Une erreur est survenue lors de l'exécution de la commande.**`).catch(() => {});
            });
        }
    }

    //|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Vérification Pub |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

    if (message.guild.id !== config.serverID) return;
    if (!SALONS_PUB.has(message.channel.id)) return;

    const safeContent = message.content.replace(/@(everyone|here)/gi, (_, m) => m);
    if (!safeContent) return;

    const verifEmbed = new EmbedBuilder()
        .setColor(config.color_principal)
        .setAuthor({ name: `📢 Nouvelle publicité à vérifier`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: `📍 Channel`, value: `<#${message.channel.id}>`, inline: true },
            { name: `👤 Auteur`,  value: message.author.username,    inline: true },
        )
        .setFooter({ text: `${message.author.id}:${message.id}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    await client.channels.cache.get(config.Salon_Verif_Pub)?.send({
        content: safeContent,
        embeds: [verifEmbed],
        components: [ROW_BOUTONS],
    });

    const messages = await message.channel.messages.fetch({ limit: 50 });
    const ancienMsg = messages.find(m => m.author.id === client.user.id);
    if (ancienMsg) await ancienMsg.delete().catch(() => {});

    const autoMsgEmbed = new EmbedBuilder()
        .setColor(config.color_automessage)
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(
            `${config.emoji_automsg} Votre publicité doit respecter les **TOS de Discord**.\n` +
            `${config.emoji_automsg} Ce salon est soumis à un **slowmode**.\n`
        )
        .setImage("attachment://automsg.jpg")
        .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    await message.channel.send({ embeds: [autoMsgEmbed], files: AUTOMSG_FILES });
});
