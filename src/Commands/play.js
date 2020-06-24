const ytdl = require("ytdl-core")
const sp = require("say")
const { MessageEmbed } = require('discord.js')
const dt = require("../Controllers/GetData")
const path = require("path")
const fs = require("fs")
const DataName = "YTMusicSystemCacheData"
const EndOfPlaylist = "Fim da playlist!"
const CachePath = path.resolve("..","TalesGardemCache","GuildsCache")

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
                                .setDescription("Ligando sistema de audio...");
                                const hot = msg.channel.send(embed)
                    await sp.export('tocando agora: '+Data.queue[0].title, null, 1, path.resolve(CachePath,guild,"latestSpeak.ogg"), async (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        setTimeout(async () => {
                        const connection1 = await voiceChannel.join()
                        const dispatcher1 = connection1.play(path.resolve(CachePath,guild,"latestSpeak.ogg"))
                        dispatcher1.setVolume(1)
                        dispatcher1.on("finish", async () => {
                            const connection = await voiceChannel.join()
                            const dispatcher = await connection.play(await ytdl(Data.queue[0].url))
                            dispatcher.on("start", async () => {
                                const embed = new MessageEmbed()
                                .setTitle('tocando agora: '+Data.queue[0].title)
                                .setColor(0x00FF00)
                                .setThumbnail("https://i.pinimg.com/originals/d0/4e/9b/d04e9bdab4a54e488557ebdfecde5850.png")
                                .setDescription("A música `"+Data.queue[0].title+"` requisitada por: `"+Data.requesters[0]+"` na data: `"+Data.dates[0]+"` vai ser tocada agora!");
                                msg.channel.send(embed)
                                Promise.resolve(hot).then(function(value) {
                                    value.delete()
                                  })
                            })
                            dispatcher.setVolume(1)
                            dispatcher.on("finish", async () => {
                                const Datanew = dt.GuildsCacheGetData(guild, DataName)
                                Datanew.queue.shift()
                                Datanew.requesters.shift()
                                Datanew.dates.shift()
                                dt.GuildsCacheAddData(guild,DataName, Datanew)
                                
                                await play()
                            }).on("error", e => {
                                console.log(e)
                            })
                        })
                    }, 4000)
                })
                } else {
                    //send a message sayng the playlist have none music
                    await sp.export(EndOfPlaylist, null, 1, path.resolve(CachePath,guild,"latestSpeak.ogg"), async (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        setTimeout(async () => {
                            const connection2 = await voiceChannel.join()
                        const dispatcher2 = connection2.play(path.resolve(CachePath,guild,"latestSpeak.ogg"))
                        dispatcher2.setVolume(1)
                        dispatcher2.on("finish", async () => {
                            voiceChannel.leave()
                            return
                        })
                    }, 4000)
                    const embed = new MessageEmbed()
                    .setTitle('Sem musicas')
                    .setColor(0xfcba03)
                        .setThumbnail("https://images.vexels.com/media/users/3/132346/isolated/preview/afcacb3f2a1c518ca5400088f66e7b2d-stop-flat-media-icon-by-vexels.png")
                        .setDescription("A playlist de músicas terminou, adicione mais músicas e chame o comando novamente!");
                    return msg.channel.send(embed)
                })
                }
            } else {
                const dispatcher = voiceConnection.player.dispatcher
                if (dispatcher.paused) {
                    await sp.export('Retomando: '+Data.queue[0].title, null, 1, path.resolve(CachePath,guild,"latestSpeak.ogg"), async (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    const embed = new MessageEmbed()
                    .setTitle('Retomando!')
                    .setColor(0xfcba03)
                    .setThumbnail("https://i.pinimg.com/originals/d0/4e/9b/d04e9bdab4a54e488557ebdfecde5850.png")
                    .setDescription("A música em exibição foi retomada!");
                    msg.channel.send(embed)
                    setTimeout(() => {
                        dispatcher.resume()
                    }, 4000);
                    })
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