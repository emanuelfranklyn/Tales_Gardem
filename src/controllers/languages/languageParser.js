const path = require('path');
const defaultLang = global.TalesGardem.Discord.Configs.defaultLang;

function get(LanguageName) {
    if (!LanguageName || LanguageName === 'undefined') {return require(path.resolve(__dirname, defaultLang + '.json'));}
    try {
        return require(path.resolve(__dirname, LanguageName + '.json'));
    } catch (e) {
        return require(path.resolve(__dirname, defaultLang + '.json'));
    }
}

module.exports = get;