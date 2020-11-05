var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')

module.exports = {
    //Base help
    Help: "Retorna o ping atual do bot",
    Usage: "ping",
    Topic: "utilities",
    Thumbnail: "https://icons-for-free.com/iconfiles/png/512/Record-1320568044528108890.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        const embed = new MessageEmbed()
            .setTitle("Pong! 🏓")
            .setColor(0xFFFFFF)
            .setThumbnail("https://img.icons8.com/cotton/2x/ping-pong--v2.png")
            .setDescription("O ping atual do Tales Gardem é\n"+Client.ws.ping+"ms")
        msg.channel.send(embed)
    }
}