const path = require('path');
const fs = require('fs');
var defaultLang;

class languageParser {
    constructor(data) {
        defaultLang = data.configs.defaultLang;
    }
    get(LanguageName) {
        if (!LanguageName || LanguageName === 'undefined') {return require(path.resolve(__dirname, defaultLang + '.json'));}
        try {
            return require(path.resolve(__dirname, LanguageName + '.json'));
        } catch (e) {
            return require(path.resolve(__dirname, defaultLang + '.json'));
        }
    }
    getAllLanguages() {
        return fs.readdirSync(path.resolve(__dirname)).filter(Language => Language.endsWith('.json'));
    }
}

module.exports = languageParser;