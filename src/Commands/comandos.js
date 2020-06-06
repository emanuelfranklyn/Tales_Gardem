var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const Configs = require('../../Configs')

module.exports = {
    //Base help
    Help: "Exibe uma lista com todos os comandos.",
    Usage: "comandos",
    Topic: "utilities",
    Thumbnail: "https://www.nicepng.com/png/full/264-2646301_information-technology-code-icon-vector.png",
    NeedArguments: false,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        var descriptions = []
        for (var c = 0; c < Configs.topics.length; c++) {
            descriptions[c] = Configs.topicsNames[c]+":\n"+">     `"+data.GetCommands(Configs.topics[c])+"`";
        }
        const embed = new MessageEmbed()
            .setTitle('Lista de comandos: '+Configs.botName)
            .setColor(0x19AA19)
            .setThumbnail("https://www.nicepng.com/png/full/264-2646301_information-technology-code-icon-vector.png")
            .setDescription(descriptions);
        msg.channel.send(embed);
    }
}