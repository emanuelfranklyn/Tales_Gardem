const { MessageEmbed } = require('discord.js');
const path = require('path');

class ping {
    constructor(data) {
        this.commands = data.commands;
        this.description = 'Shows bot ping';
        this.needArgs = false;
    }

    main(params) {
        return new Promise((resolve) => {
            var LoadingMessage = new MessageEmbed()
                .setTitle(params[1].language.message.pingTitle)
                .setColor('#99FF99')
                .setDescription(params[1].language.message.pingDescription + (Date.now() - params[0].createdTimestamp) + 'ms!')
                .setThumbnail('attachment://Terminal.png')
                .attachFiles([path.resolve(__dirname, '..','..','assets','images','Terminal.png')]);
            params[0].channel.send(LoadingMessage);
            resolve();
        });
    }
}

module.exports = ping;