const ytdl = require('ytdl-core-discord')
const { MessageEmbed } = require('discord.js')
const dt = require("../Controllers/GetData")
const DH = require("../Controllers/DiscordHelper")
const path = require("path")
const fs = require("fs")
const DataName = "YTMusicSystemCacheData"
const EndOfPlaylist = "Fim da playlist!"
const CachePath = path.resolve("TalesGardemCache", "GuildsCache")
const { type } = require("os")

module.exports = {
    //Base help
    Help: "Inicia a reprodução da fila de músicas",
    Usage: "play",
    Topic: "media",
    Thumbnail: "https://img.icons8.com/bubbles/2x/play.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async(msg, args) => {
        if ((args[1] !== undefined && typeof(args) !== typeof("")) || typeof(args) !== typeof("")) {
            const embed = new MessageEmbed()
                .setTitle('Comando errado')
                .setColor(0xFFAA00)
                .setThumbnail("https://www.drupal.org/files/project-images/login_redirect.png")
                .setDescription("O comando inserido apenas reproduz a fila de reprodução. \nDeseja ser redirecionando para o comando `tocar` automaticamente?");
            return msg.channel.send(embed).then((data) => {
                data.react('✅')
                data.react('❌')
                DH.ReactionController(data, async(reaction, reactionCollector) => {
                    if (reaction.emoji.name == '✅') {
                        data.delete()
                        const p = require("./tocar")
                        p.Main(msg, args)
                    } else if (reaction.emoji.name == '❌') {
                        data.delete()
                        const b = require("./play")
                        b.Main(msg, [])
                    }
                }, msg)
            })
        }
        const voiceChannel = msg.member.voice.channel;
        const voiceConnection = Client.voice.connections.find(val => val.channel.guild.id == msg.guild.id);
        if (!voiceChannel) {
            const embed = new MessageEmbed()
                .setTitle('Nenhum canal de voz')
                .setColor(0xFF0000)
                .setThumbnail("https://i.ya-webdesign.com/images/no-sound-png-14.png")
                .setDescription("Você tem que estar em um canal de voz para usar esse comando.");
            return msg.channel.send(embed)
        }
        if (!msg.guild.me.hasPermission("CONNECT") || !msg.guild.me.hasPermission("SPEAK")) {
            const embed = new MessageEmbed()
                .setTitle('Sem permissão')
                .setColor(0xFF0000)
                .setThumbnail("https://cdn2.iconfinder.com/data/icons/ios-7-style-metro-ui-icons/512/MetroUI_Security_Denied.png")
                .setDescription("Sem permissão para se conectar ao canal de voz.");
            return msg.channel.send(embed)
        }
        async function play() {
            const guild = msg.guild.id
            if (!dt.GuildsCacheExistsData(guild, DataName)) {
                const embed = new MessageEmbed()
                    .setTitle('Sem musicas')
                    .setColor(0xfcba03)
                    .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                    .setDescription("A playlist de músicas terminou, adicione mais músicas e chame o comando novamente!");
                return msg.channel.send(embed)
            }
            const Data = dt.GuildsCacheGetData(guild, DataName)
            if (voiceConnection == null) {
                if (Data.queue && Data.queue[0]) {
                    const embed = new MessageEmbed()
                        .setTitle('Aquecendo')
                        .setColor(0x00FF00)
                        .setThumbnail("https://i.pinimg.com/originals/d0/4e/9b/d04e9bdab4a54e488557ebdfecde5850.png")
                        .setDescription("Obtendo audio...");
                    const hot = msg.channel.send(embed)
                    const connection = await voiceChannel.join()
                    let audioStream;
                    audioStream = await ytdl(Data.queue[0].url)
                    const dispatcher = await connection.play(audioStream, { type: 'opus' })
                    dispatcher.on("start", async() => {
                        const embed = new MessageEmbed()
                            .setTitle('tocando agora: ' + Data.queue[0].title)
                            .setColor(0x00FF00)
                            .setThumbnail("https://i.pinimg.com/originals/d0/4e/9b/d04e9bdab4a54e488557ebdfecde5850.png")
                            .setDescription("A música `" + Data.queue[0].title + "` requisitada por: `" + Data.requesters[0] + "` na data: `" + Data.dates[0] + "` vai ser tocada agora!");
                        msg.channel.send(embed)
                        Promise.resolve(hot).then(function(value) {
                            value.delete()
                        })
                        let Datanewer = dt.GuildsCacheGetData(guild, DataName)
                        Datanewer.queue[0].start = Date.now()
                        Datanewer.queue[0].status = 0
                        dt.GuildsCacheAddData(guild, DataName, Datanewer)
                    })
                    dispatcher.setVolume(1)
                    dispatcher.on("finish", async() => {
                        const Datanew = dt.GuildsCacheGetData(guild, DataName)
                        Datanew.queue.shift()
                        Datanew.requesters.shift()
                        Datanew.dates.shift()
                        if (Datanew.queue[0]) {
                            Datanew.queue[0].status = 2
                        }
                        dt.GuildsCacheAddData(guild, DataName, Datanew)

                        await play()
                    }).on("error", e => {
                        console.log(e)
                    })
                } else {
                    //send a message sayng the playlist have none music
                    voiceChannel.leave()
                    const embed = new MessageEmbed()
                        .setTitle('Sem musicas')
                        .setColor(0xfcba03)
                        .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                        .setDescription("A playlist de músicas terminou, adicione mais músicas e chame o comando novamente!");
                    return msg.channel.send(embed)
                }
            } else {
                const dispatcher = voiceConnection.player.dispatcher
                if (dispatcher.paused) {
                    const embed = new MessageEmbed()
                        .setTitle('Retomando!')
                        .setColor(0xfcba03)
                        .setThumbnail("https://i.pinimg.com/originals/d0/4e/9b/d04e9bdab4a54e488557ebdfecde5850.png")
                        .setDescription("A música em exibição foi retomada!");
                    msg.channel.send(embed)
                    dispatcher.resume()
                    let Datanewere = dt.GuildsCacheGetData(guild, DataName)
                    Datanewere.queue[0].start = Date.now()
                    Datanewere.queue[0].status = 0
                    dt.GuildsCacheAddData(guild, DataName, Datanewere)
                } else {
                    const embed = new MessageEmbed()
                        .setTitle('Já retomado!')
                        .setColor(0xfcba03)
                        .setThumbnail("https://i.pinimg.com/originals/d0/4e/9b/d04e9bdab4a54e488557ebdfecde5850.png")
                        .setDescription("A música em exibição atual já foi retomada!");
                    return msg.channel.send(embed)
                }
            }
        }
        await play()
    }
}