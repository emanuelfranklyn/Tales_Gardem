var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const Configs = data.GetConfigs()

module.exports = {
    //Base help
    Help: "Exibe uma lista com todos os comandos.",
    Usage: "comandos",
    Topic: "utilities",
    Thumbnail: "https://www.nicepng.com/png/full/264-2646301_information-technology-code-icon-vector.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        var descriptions = []
        for (var c = 0; c < Configs.TGtopics.length; c++) {
            descriptions[c] = Configs.TGtopicsNames[c]+":\n"+"> `|"+data.GetCommands(Configs.TGtopics[c]).join("| |")+"|`";
        }
        const embed = new MessageEmbed()
            .setTitle('Lista de comandos: '+Configs.TGbotName)
            .setColor(0x88FF88)
            .setThumbnail("https://www.nicepng.com/png/full/264-2646301_information-technology-code-icon-vector.png")
            .setDescription(descriptions);
        msg.channel.send(embed);
    }
}