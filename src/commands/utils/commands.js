const { MessageEmbed } = require('discord.js');
const path = require('path');

class commands {
    constructor(data) {
        this.commands = data.commands;
        this.description = 'Shows a list with all avaliable commands';
        this.needArgs = false;
    }

    main(params) {
        return new Promise((resolve) => {
            var description = '```css\n';
            this.commands.forEach((category) => {
                if (category.commands.length > 0) {
                    description += '\n' + params[1].language.categorys[category.name] + ':\n';
                    description += '> ';
                }
                category.commands.forEach((command) => {
                    description += '|' + command.name + '| ';
                });
            });
            description += '\n```';
            var LoadingMessage = new MessageEmbed()
                .setTitle(params[1].language.message.commandsEmbedTitle)
                .setColor('#99FF99')
                .setDescription(description)
                .setThumbnail('attachment://Terminal.png')
                .attachFiles([path.resolve(__dirname, '..','..','assets','images','Terminal.png')]);
            params[0].channel.send(LoadingMessage);
            resolve();
        });
    }
}

module.exports = commands;