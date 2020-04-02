const ytdl = require("ytdl-core")
const { RichEmbed } = require('discord.js')
const dt = require("../Controllers/GetData")
const path = require("path")
const fs = require("fs")
const DataName = "YTMusicSystemCacheData"

module.exports = {
    //Base help
    Help: "Inicia a reprodução da fila de músicas",
    Usage: "play",
    Topic: "media",
    Thumbnail: "https://img.icons8.com/bubbles/2x/play.png",
    NeedArguments: false,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) {
            const embed = new RichEmbed()
                .setTitle('Nenhum canal de voz')
                .setColor(0xFF0000)
                .setThumbnail("https://i.ya-webdesign.com/images/no-sound-png-14.png")
                .setDescription("Você tem que estar em um canal de voz para usar esse comando.");
            return msg.channel.send(embed)
        }
        if (!msg.guild.me.hasPermission("CONNECT") || !msg.guild.me.hasPermission("SPEAK")) {
            const embed = new RichEmbed()
            .setTitle('Sem permissão')
            .setColor(0xFF0000)
            .setThumbnail("https://cdn2.iconfinder.com/data/icons/ios-7-style-metro-ui-icons/512/MetroUI_Security_Denied.png")
            .setDescription("Sem permissão para se conectar ao canal de voz.");
            return msg.channel.send(embed)
        }
        async function play() {
            const connection = await voiceChannel.join()
            const guild = msg.guild.id
            const Data = dt.GuildsCacheGetData(guild, DataName)
            if (Data.queue[0]) {
                const embed = new RichEmbed()
                    .setTitle('tocando agora: '+Data.queue[0].title)
                    .setColor(0x00FF00)
                    .setThumbnail("https://i.pinimg.com/originals/d0/4e/9b/d04e9bdab4a54e488557ebdfecde5850.png")
                    .setDescription("A música `"+Data.queue[0].title+"` requisitada por: `"+Data.requesters[0]+"` na data: `"+Data.dates[0]+"` vai ser tocada agora!");
                msg.channel.send(embed)
                //console.log(Data.queue[0].url)
                //console.log(Data.queue.url[0])
                const dispatcher = connection.playStream(ytdl(Data.queue[0].url))
                dispatcher.setVolume(1)
                dispatcher.on("end", async () => {
                    Data.queue.shift()
                    Data.requesters.shift()
                    Data.dates.shift()
                    dt.GuildsCacheAddData(guild,DataName, Data)
                    
                    await play()
                }).on("error", e => {
                    console.log(e)
                })
            } else {
                //send a message sayng the playlist have none music
                const embed = new RichEmbed()
                    .setTitle('Sem musicas')
                    .setColor(0xfcba03)
                    .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                    .setDescription("A playlist de músicas terminou, adicione mais músicas e chame o comando novamente!");
            return msg.channel.send(embed)
            }
        }
        await play()
    }
}
