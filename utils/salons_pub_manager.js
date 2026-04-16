const fs = require("fs");
const path = require("path");
const PATH = path.join(__dirname, "../data/salons_pub.json");

let _data = [];
try {
    _data = JSON.parse(fs.readFileSync(PATH, "utf8"));
} catch {
    console.error("[salons_pub_manager] Impossible de lire salons_pub.json, démarrage avec liste vide.");
}
const salons = new Set(_data);

function sauvegarder() {
    fs.writeFileSync(PATH, JSON.stringify([...salons], null, 4));
}

module.exports = {
    salons,
    ajouter(id) {
        salons.add(id);
        sauvegarder();
    },
    retirer(id) {
        salons.delete(id);
        sauvegarder();
    },
};
