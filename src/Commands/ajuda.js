var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const Configs = require('../../Configs');

module.exports = {
    //Base help
    Help: "Mostra como usar e para que serve um comando especifico.",
    Usage: "ajuda <comando>.",
    Topic: "utilities",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
    NeedArguments: true,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        GetCommand = data.GetCommandThumbnail(args[1])
        try {
            var GetAboutCommand = require('./'+args[1]);
        } catch(E) {}
        if (GetAboutCommand) {
            var result = await GetCommand;
            const embed = new MessageEmbed()
                .setTitle('ajuda sobre o comando: '+args[1])
                .setColor(0xFF0000)
                .setThumbnail(result)
                .setDescription('Sobre: `'+GetAboutCommand.Help+"`\n"+"Como usar: `"+Configs.Prefix+GetAboutCommand.Usage+'`');
            msg.channel.send(embed);
        } else {
            const embed = new MessageEmbed()
                .setTitle('Comando inexistente: '+args[1])
                .setColor(0xFF0000)
                .setThumbnail('https://static-vectorplace-com.ams3.digitaloceanspaces.com/uploads/works/72680/preview_72680.jpg')
                .setDescription('Comando inexistente ;(');
            msg.channel.send(embed);
        }
    }
}