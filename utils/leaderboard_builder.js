const MEDAILLES = ["🥇", "🥈", "🥉"];

function buildLeaderboardDescription(pub, client) {
    return Object.entries(pub)
        .sort(([, a], [, b]) => b.pub - a.pub)
        .slice(0, 10)
        .map(([id, data], index) => {
            const user = client.users.cache.get(id);
            const prefix = MEDAILLES[index] ?? `**#${index + 1}**`;
            return `${prefix} ${user ? user.username : "Membre introuvable"} — \`${data.pub}\` pubs vérifiées`;
        })
        .join("\n") || "Aucune donnée.";
}

module.exports = { buildLeaderboardDescription };
