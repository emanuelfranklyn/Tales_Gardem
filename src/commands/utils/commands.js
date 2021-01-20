const { MessageEmbed } = require('discord.js');
const path = require('path');
var Commands;

function loader() {
    // const Client = global.TalesGardem.Discord.Client;
    Commands = global.TalesGardem.Discord.Commands;
}

module.exports = {
    Desc: 'Shows a list with all avaliable commands',
    NeedArguments: false,
    Main: (Msg, language) => {
        return new Promise((resolve) => {
            loader();
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
};