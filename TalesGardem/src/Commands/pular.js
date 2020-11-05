var dt = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const DataName = "YTMusicSystemCacheData"

module.exports = {
    //Base help
    Help: "Pula a música que está tocando agora.",
    Usage: "pular",
    Topic: "media",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        const voiceChannel = msg.member.voice.channel;
        const guild = msg.guild.id
        const voiceConnection2 = Client.voice.connections.find(val => val.channel.guild.id == msg.guild.id);
        const Data = dt.GuildsCacheGetData(guild, DataName)
        if (Data.queue && Data.queue[0]) {
            if (voiceConnection2) {
                try {
                    voiceConnection2.dispatcher.end();
                } catch (e) {
                    voiceChannel.leave()
                    Data.queue.shift()
                    Data.requesters.shift()
                    Data.dates.shift()
                    dt.GuildsCacheAddData(guild, DataName, Data)
                    let play = require('./play')
                    play.Main(msg, args)    
                }
            } else {
                Data.queue.shift()
                Data.requesters.shift()
                Data.dates.shift()
                dt.GuildsCacheAddData(guild, DataName, Data)
            }
	    const embed = new MessageEmbed()
                .setTitle('Pulado')
                .setColor(0xfcba03)
                .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                .setDescription("A playlist de músicas pulou 1 musica!");
            return msg.channel.send(embed)
        } else {
            const embed = new MessageEmbed()
                .setTitle('Sem musicas')
                .setColor(0xfcba03)
                .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                .setDescription("A playlist de músicas terminou, adicione mais músicas e chame o comando novamente!");
            return msg.channel.send(embed)
        }
    }
}