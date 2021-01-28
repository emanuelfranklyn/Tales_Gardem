const { MessageEmbed } = require('discord.js');
const path = require('path');
var Configs;
var Commands;

class help {
    constructor(Data) {
        Commands = Data.Commands;
        Configs = Data.Configs;
        this.Desc = 'Shows info about a command and how to use it';
        this.Usage = 'help [CommandName]';
        this.NeedArguments = true;
    }
    Main(Msg, language, args) {
        return new Promise((resolve) => {
            var description = '```css\n';
            var CommandData;
            var FoundedCommand = false;
            Commands.forEach((Category) => {
                Category.commands.forEach((Command) => {
                    if (Command.name === args[0] || language.Commands[Command.name] === args[0]) {
                        CommandData = Command;
                        FoundedCommand = true;
                    }
                });
            });
            if (!FoundedCommand) {
                var LoadingMessage = new MessageEmbed()
                    .setTitle(language.Errors.NotFounded + ' ' + args[0] + '!')
                    .setColor('#FF5555')
                    .setDescription(language.Errors.NotFounded + '.')
                    .setThumbnail('attachment://error.gif')
                    .attachFiles([path.resolve(__dirname, '..','..','assets','images','error.gif')]);
                Msg.channel.send(LoadingMessage);
                resolve();
                return;
            }
            description += language.Message.HelpDesc + ': ' + CommandData.Desc + '\n';
            description += language.Message.HelpUsage + ': [' + Configs.Prefixes + ']' + CommandData.Usage;
            description += '```';
            LoadingMessage = new MessageEmbed()
                .setTitle(language.Message.HelpAboutCommand + args[0] + ':')
                .setColor('#9999FF')
                .setDescription(description)
                .setThumbnail('attachment://Terminal.png')
                .attachFiles([path.resolve(__dirname, '..','..','assets','images','Terminal.png')]);
            Msg.channel.send(LoadingMessage);
            resolve();
        });
    }
}

module.exports = help;