const { MessageEmbed } = require('discord.js');
const path = require('path');
const fs = require('fs');
const LanguagerClass = require(path.resolve(__dirname, '..', '..','languages', 'languageParser'));

class help {
    constructor(data) {
        this.commands = data.commands;
        this.configs = data.configs;
        this.description = 'Shows info about a command and how to use it';
        this.usage = 'help [CommandName]';
        this.needArgs = true;
        this.languageFolderPath = data.languageFolderPath || path.resolve(__dirname, '..', '..', 'languages');

        // Properties
        this.LanguagerClient = new LanguagerClass({configs: this.configs});

        // Ambient variables
        this.languager = this.LanguagerClient.get;
    }
    main(param) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            var description = '```css\n';
            var commandData;
            var foundedCommand = false;

            await fs.readdirSync(this.languageFolderPath).forEach(async languages => {
                if (languages.endsWith('.json')) {
                    var searchLanguage = await this.languager(languages.slice(0,-5));

                    // verify if the testing language matches with the command
                    var commandName = Object.values(searchLanguage.commandsCategory).indexOf(param[1].args[1]);
                    if (commandName !== -1) {
                        this.commands.forEach(category => {
                            category.commands.forEach(command => {
                                if (command.name === Object.keys(searchLanguage.commandsCategory)[commandName]) {
                                    commandData = command;
                                    foundedCommand = true;
                                }
                            });
                        });
                    }
                }
            });
            if (!foundedCommand) {
                var LoadingMessage = new MessageEmbed()
                    .setTitle(param[1].language.errors.notFounded + ' ' + param[1].args[0] + '!')
                    .setColor('#FF5555')
                    .setDescription(param[1].language.errors.notFounded + '.')
                    .setThumbnail('attachment://error.gif')
                    .attachFiles([path.resolve(__dirname, '..','..','assets','images','error.gif')]);
                param[0].channel.send(LoadingMessage);
                resolve();
                return;
            }
            description += param[1].language.message.helpDesc + ': ' + commandData.description + '\n';
            description += param[1].language.message.helpUsage + ': [' + this.configs.prefixes + ']' + commandData.usage;
            description += '```';
            LoadingMessage = new MessageEmbed()
                .setTitle(param[1].language.message.helpAboutCommand + param[1].args[0] + ':')
                .setColor('#9999FF')
                .setDescription(description)
                .setThumbnail('attachment://Terminal.png')
                .attachFiles([path.resolve(__dirname, '..','..','assets','images','Terminal.png')]);
            param[0].channel.send(LoadingMessage);
            resolve();
        });
    }
}

module.exports = help;