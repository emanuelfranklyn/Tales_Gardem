var dt = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const DataName = "YTMusicSystemCacheData"
const path = require("path")
const CachePath = path.resolve("..","TalesGardemCache","GuildsCache")

module.exports = {
    //Base help
    Help: "Pausa a música que está tocando agora.",
    Usage: "pause",
    Topic: "media",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
    NeedArguments: false,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        const voiceChannel = msg.member.voice.channel;
        const voiceConnection = Client.voice.connections.find(val => val.channel.guild.id == msg.guild.id);
        const guild = msg.guild.id
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
            if (voiceConnection === null) {
                const embed = new MessageEmbed()
                .setTitle('Nenhuma música está tocando!')
                .setColor(0xfcba03)
                .setThumbnail("https://i.ya-webdesign.com/images/signs-vector-musical-13.png")
                .setDescription("Nenhuma música está tocando agora, por favor inicie e reprodução de uma musica antes de ultilizar este comando!");
            return msg.channel.send(embed)
            }
            const dispatcher = voiceConnection.player.dispatcher
            if (dispatcher.paused) {
                const embed = new MessageEmbed()
                .setTitle('Já pausado!')
                .setColor(0xfcba03)
                .setThumbnail("https://i.ya-webdesign.com/images/signs-vector-musical-13.png")
                .setDescription("A música em exibição atual já está pausada!");
            return msg.channel.send(embed)
            } else {
                dispatcher.pause(true)
                let Datanewer = dt.GuildsCacheGetData(guild, DataName)
                    let currentTime = Datanewer.queue[0].start-Date.now()
                    currentTime = currentTime*-1
                    let secounds = new Date(currentTime).getSeconds().toString()
                    if (Datanewer.queue[0].playtimestamp === 0) {
                        if (new Date(currentTime).getSeconds() < 10 ) {
                            secounds = "0"+secounds
                        }
                        Datanewer.queue[0].playtimestamp = new Date(currentTime).getMinutes()+":"+secounds
                    } else {
                        let gg = Datanewer.queue[0].playtimestamp.split(":")
                        if (new Date(currentTime).getSeconds()+Number(gg[1]) < 10 ) {
                            secounds = "0"+(Number(secounds)+Number(gg[1])).toString()
                        } else {
                         secounds = (Number(secounds)+Number(gg[1])).toString()   
                        }
                        Datanewer.queue[0].playtimestamp = new Date(currentTime).getMinutes()+Number(gg[0])+":"+secounds
                    }
                    Datanewer.queue[0].status = 1;
                    let jj = Datanewer.queue[0].playtimestamp.split(":")
                    if (jj[1] > 59) {
                        jj[1] = Number(jj[1])-60
                        jj[0] = Number(jj[0])+1
                    }
                    Datanewer.queue[0].playtimestamp = jj[0]+":"+jj[1]
                    dt.GuildsCacheAddData(guild,DataName, Datanewer)
                const embed = new MessageEmbed()
                .setTitle('Pausado!')
                .setColor(0xfcba03)
                .setThumbnail("https://cdn.pixabay.com/photo/2017/03/16/03/59/pause-button-2148106_1280.png")
                .setDescription("A música em exibição atual foi pausada!");
            return msg.channel.send(embed)
            }
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