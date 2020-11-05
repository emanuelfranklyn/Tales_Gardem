var dt = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const DataName = "YTMusicSystemCacheData"

module.exports = {
    //Base help
    Help: "Limpa a playlist de músicas.",
    Usage: "limplist",
    Topic: "media",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        const voiceChannel = msg.member.voice.channel;
        const guild = msg.guild.id
        if (voiceChannel) {
            voiceChannel.leave()
        }
        if (!dt.GuildsCacheExistsData(guild, DataName)) {
            const embed = new MessageEmbed()
                .setTitle('Sem músicas')
                .setColor(0xfcba03)
                .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                .setDescription("A playlist de músicas terminou, adicione mais músicas e chame o comando novamente!");
            return msg.channel.send(embed)
        }
        const Data = dt.GuildsCacheGetData(guild, DataName)
        if (Data.queue && Data.queue[0]) {
            Data.queue = []
            Data.requesters = []
            Data.dates = []
            dt.GuildsCacheAddData(guild,DataName, Data)
            const embed = new MessageEmbed()
                .setTitle('Sem músicas')
                .setColor(0xfcba03)
                .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                .setDescription("A playlist de músicas foi limpa!");
            return msg.channel.send(embed)
        } else {
            const embed = new MessageEmbed()
                .setTitle('Sem músicas')
                .setColor(0xfcba03)
                .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                .setDescription("A playlist de músicas terminou, adicione mais músicas e chame o comando novamente!");
            return msg.channel.send(embed)
        }
    }
}