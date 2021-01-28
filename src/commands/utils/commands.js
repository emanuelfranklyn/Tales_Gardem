const { MessageEmbed } = require('discord.js');
const path = require('path');
var Commands;

class commands {
    constructor(Data) {
        Commands = Data.Commands;
        this.Desc = 'Shows a list with all avaliable commands';
        this.NeedArguments = false;
    }

    Main(Msg, language) {
        return new Promise((resolve) => {
            var description = '```css\n';
            Commands.forEach((Category) => {
                description += '\n' + language.Categorys[Category.name] + ':\n';
                if (Category.commands.length > 0) {
                    description += '> ';
                }
                Category.commands.forEach((Command) => {
                    description += '|' + Command.name + '| ';
                });
            });
            description += '\n```';
            var LoadingMessage = new MessageEmbed()
                .setTitle(language.Message.CommandsEmbedTitle)
                .setColor('#99FF99')
                .setDescription(description)
                .setThumbnail('attachment://Terminal.png')
                .attachFiles([path.resolve(__dirname, '..','..','assets','images','Terminal.png')]);
            Msg.channel.send(LoadingMessage);
            resolve();
        });
    }
}

module.exports = commands;