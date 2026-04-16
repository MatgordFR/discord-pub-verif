const { EmbedBuilder } = require('discord.js');
const client = require("../index");
const config = require("../config.json");
const pub = require("../data/top_verif_pub.json");
const fs = require("fs");
const path = require("path");

const PUB_PATH = path.join(__dirname, "../data/top_verif_pub.json");

const RAISONS_REFUS = {
    "refus_tos":    "Non-respect des TOS Discord.",
    "refus_desc":   "Publicité sans description.",
    "refus_salon":  "Publicité dans le mauvais salon.",
    "refus_aucune": "Aucune raison.",
};

const BOUTONS_IDS = new Set(["valider", ...Object.keys(RAISONS_REFUS)]);

function sauvegarderPub() {
    fs.writeFile(PUB_PATH, JSON.stringify(pub), err => {
        if (err) console.error(err);
    });
}

function incrementerPub(userId) {
    pub[userId] ??= { pub: 0 };
    pub[userId].pub++;
    sauvegarderPub();
}

//|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Interaction Handler |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.channelId !== config.Salon_Verif_Pub) return;
    if (!BOUTONS_IDS.has(interaction.customId)) return;

    await interaction.deferUpdate();

    const embed = interaction.message.embeds[0];
    const staff = interaction.user;
    const customId = interaction.customId;

    // Métadonnées stockées dans le footer : "authorId:msgId"
    const [authorId, msgId] = (embed?.footer?.text ?? "").split(":");
    const safeContent = interaction.message.content ?? "";
    const channelId   = embed?.fields[0]?.value.match(/<#(\d+)>/)?.[1];
    const authorTag   = embed?.fields[1]?.value ?? "";

    await interaction.message.delete().catch(() => {});

    if (customId === "valider") {
        const logEmbed = new EmbedBuilder()
            .setColor(config.color_principal)
            .setAuthor({ name: `✅ Publicité validée`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(safeContent)
            .addFields(
                { name: `📍 Channel`,     value: `<#${channelId}>`,             inline: true },
                { name: `👤 Auteur`,      value: authorTag,                     inline: true },
                { name: `✅ Vérifié par`, value: staff.username,                inline: true },
                { name: `🔎 ID message`,  value: `\`${msgId ?? "inconnu"}\``,   inline: true },
            )
            .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        client.channels.cache.get(config.Salon_Logs_Verif_valide)?.send({ embeds: [logEmbed] });

    } else {
        const raison = RAISONS_REFUS[customId];

        const logEmbed = new EmbedBuilder()
            .setColor(config.color_sanction)
            .setAuthor({ name: `❌ Publicité refusée`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(safeContent)
            .addFields(
                { name: `📍 Channel`,      value: `<#${channelId}>`,            inline: true },
                { name: `👤 Auteur`,       value: authorTag,                    inline: true },
                { name: `🚫 Supprimé par`, value: staff.username,               inline: true },
                { name: `📋 Raison`,       value: `\`${raison}\``,              inline: true },
                { name: `🔎 ID message`,   value: `\`${msgId ?? "inconnu"}\``,  inline: true },
            )
            .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        client.channels.cache.get(config.Salon_Logs_Verif_refuser)?.send({ embeds: [logEmbed] });

        if (customId !== "refus_aucune") {
            const sanctionEmbed = new EmbedBuilder()
                .setColor(config.color_sanction)
                .setTitle(`${config.emoji_warning} ➜ Sanction Publicité`)
                .setDescription(`**Vous venez d'être averti pour : \`${raison}\`\nSalon concerné : <#${channelId}>.\n\nAverti par : ${staff}**`)
                .setFooter({ text: `By: MatgordFR ©`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
            client.channels.cache.get(config.Salon_Sanction)?.send({ content: `|| <@${authorId}> ||`, embeds: [sanctionEmbed] });
        }
    }

    incrementerPub(staff.id);
});
