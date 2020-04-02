var data = require('../Controllers/GetData')
const { RichEmbed } = require('discord.js')

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
        if (GetCommand !== false) {
            var result = await GetCommand;
        } else {
            var result = await data.searchImage(args[1]);
        }
        const embed = new RichEmbed()
            .setTitle('ajuda sobre o comando: '+args[1])
            .setColor(0xFF0000)
            .setThumbnail(result)
            .setDescription('Sobre: '+"\n"+"Como usar: ");
        msg.channel.send(embed);
    }
}