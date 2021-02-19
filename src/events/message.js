const path = require('path');
const LanguagerClass = require(path.resolve(__dirname, '..','languages', 'languageParser'));
const { MessageEmbed } = require('discord.js');
const { reactionI } = require('../utils');

class message {
    constructor(data) {
        // Main variables
        this.configs = data.configs;
        this.commands = data.commands;
        this.DBConnected = data.DBConnected;
        this.db = data.db;
        this.languageFolderPath = data.languageFolderPath || path.resolve(__dirname, '..', 'languages');
        this.client = data.client;

        // Properties
        this.LanguagerClient = new LanguagerClass({configs: this.configs});

        // Ambient variables
        this.languager = this.LanguagerClient.get;
        this.getAllLanguages = this.LanguagerClient.getAllLanguages;
    }

    exceptionCatcher(error, message) {
        var messageError = new MessageEmbed()
            .setTitle('Sorry, a error occured while processing your request')
            .setColor('#ff5555')
            .setDescription('Details about the error:\n```javascript\n' + error + '\n```')
            .setFooter('Sorry about that')
            .setTimestamp()
            .setThumbnail('attachment://error.gif')
            .attachFiles([path.resolve(__dirname, '..', 'assets','images','error.gif')]);
        message.channel.send(messageError);
    }

    async multiLanguageCommandFilter(message, msgWNP, uP) {

        var mathedLanguages = [];
        var correctLanguage;
        var correctLanguageName;
        var command = '';

        command = msgWNP.split(' ')[0];

        await this.getAllLanguages().forEach(async languages => {
            var searchLanguage = await this.languager(languages.slice(0,-5));

            // verify if the testing language matches with the command
            var commandName = Object.values(searchLanguage.commandsCategory).indexOf(command);
            if (commandName !== -1) {
                mathedLanguages.push(languages.slice(0, -5));
            }
        });

        if (mathedLanguages.length < 1) {return;}

        // Only 1 language matched
        if (mathedLanguages.length === 1) {
            correctLanguage = this.languager(mathedLanguages[0]);
            correctLanguageName = mathedLanguages[0];

        // Guild community language
        } else if (message.guild.preferredLocale) {
            var communityLanguage = message.guild.preferredLocale.split('-').join('');
            if (mathedLanguages.includes(communityLanguage)) {
                correctLanguage = this.languager(communityLanguage);
                correctLanguageName = communityLanguage;
            }

        // Database
        } else if (this.DBConnected) {
            this.db.SwitchTo(this.configs.DatabaseName).then(() => {
                this.db.Get('guild' + message.guild.id).then((results) => {
                    if (results.language && mathedLanguages.includes(results.language)) {
                        correctLanguage = this.languager(results.language);
                        correctLanguageName = results.language;
                    } else {
                        askUserTheCorrectLanguage(this);
                    }
                }).catch((e) => {this.exceptionCatcher(e, message);});
            }).catch((e) => {this.exceptionCatcher(e, message);});
        } else {
            askUserTheCorrectLanguage(this);  
        }

        async function askUserTheCorrectLanguage(that) {
            const ask = new reactionI({
                client: that.client,
                configs: that.configs,
            });

            var itens = [];

            mathedLanguages.forEach(mathedLanguage => {
                var language = that.languager(mathedLanguage);

                itens.push({title: language.englishName + ' - ' + language.languageName, value: mathedLanguage});
            });

            var selectedLanguage = await ask.numeralAsk('Select language', itens, message);

            correctLanguage = that.languager(selectedLanguage.value);
            correctLanguageName = selectedLanguage.value;
        }

        command = Object.keys(correctLanguage.commandsCategory)[Object.values(correctLanguage.commandsCategory).indexOf(command)];

        return {
            msgContent: msgWNP, 
            args: msgWNP.split(' '),
            command: command,
            usedPrefix: uP,
            language: correctLanguage,
            languageName: correctLanguageName,
            database: this.db,
        };
    }

    commandFilter(message) {
        if (message.author.bot && !this.configs.allowedBots.includes(message.author.id)) {return;}
        var msg = message.toString().toLowerCase();
        var usedPrefix = this.configs.prefixes.find(prefix => msg.startsWith(prefix));
        if (!usedPrefix) {return;}
        var msgWithNoPrefix = msg.slice(usedPrefix.length);
        return this.multiLanguageCommandFilter(message, msgWithNoPrefix, usedPrefix);
    }
 
    async run(message) {
        var msg = await this.commandFilter(message);
        if (!msg) {return;}

        this.commands.forEach(category => {
            category.commands.forEach((command) => {
                if (command.name === msg.command) {
                    if (command.needArguments && msg.args[1]) {
                        command.startFunction(message, msg).catch((e) => {
                            this.exceptionCatcher(e, message);
                        });
                    } else {
                        this.commands.forEach(category => {
                            category.commands.forEach((command) => {
                                if (command.name === this.configs.defaultCommand) {
                                    msg.args[1] = msg.command;
                                    command.startFunction(message, msg);
                                }
                            });
                        });
                    }
                }
            });
        });
    }
}

module.exports = message;