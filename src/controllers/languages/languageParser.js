const path = require('path');
var defaultLang;

class languageParser {
    constructor(Data) {
        defaultLang = Data.Configs.defaultLang;
    }
    get(LanguageName) {
        if (!LanguageName || LanguageName === 'undefined') {return require(path.resolve(__dirname, defaultLang + '.json'));}
        try {
            return require(path.resolve(__dirname, LanguageName + '.json'));
        } catch (e) {
            return require(path.resolve(__dirname, defaultLang + '.json'));
        }
    }
}

module.exports = languageParser;