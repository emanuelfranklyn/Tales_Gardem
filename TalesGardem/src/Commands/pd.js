const ytsr = require("ytsr")
const Data = require("../Controllers/GetData")
const DH = require("../Controllers/DiscordHelper")
const Canvas = require("canvas")
const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const path = require("path")
const DataName = "YTMusicSystemCacheData"
const DescriptionShortSize = 150
const ResultsPerSearch = 6 //The number you want + 1
const TitleSize = 40
const Numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

module.exports = {
    Help: "Adiciona o primeiro resultado à lista de reprodução",
    Usage: "pd <Url/Nome>",
    Topic: "media",
    Thumbnail: "https://i.pinimg.com/originals/71/ba/b9/71bab9e470ee7dd6f4ab65999d540e81.png",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async(msg, args) => {
        const SearchResult = {
            SearchTerm: "",
            NumberOfResults: 0,
            ResultsTitles: [],
            ResultsURLS: [],
            ResultsDurations: [],
            ResultsThumbnail: [],
            ResultsShortDescription: [],
            ResultsFullDescription: [],
            AuthorName: [],
            AuthorChannel: [],
            AuthorVerified: [],
            Views: []
        }
        var Waiting = msg.channel.send(`${Client.emojis.cache.find(emoji => emoji.name === "TalesGardemSpaceIntLoadingGif1")} `)
        args.shift()
        args = args.join(" ")
        if (args.includes("www.youtube.com") && args.includes("&list=")) {
            //remove the &list and forward
            let listindex = args.indexOf("&list=")
            args = args.slice(0, listindex)
        }
        ytsr.do_warn_deprecate = false
        await ytsr(args, async function callback(err, searchResults) {
            Promise.resolve(Waiting).then(function(value) {
                value.delete()
            }).catch(() => {
                console.log(Client, "Erro: Não foi possivel deletar: tocar.js: value.delete()")
            })
            SearchResult.SearchTerm = searchResults.query
            var size = 0
            if (searchResults.items.length < ResultsPerSearch) {
                size = searchResults.items.length
            } else {
                size = ResultsPerSearch
            }
            if (size == 0) {
                //do something
            } else {
                SearchResult.NumberOfResults = size
                for (var i = 0; i < size; i++) {
                    if (i !== 2) {
                        if (searchResults.items[i].title) {
                            if (searchResults.items[i].title.length > TitleSize) {
                                SearchResult.ResultsTitles.push(searchResults.items[i].title.slice(0, TitleSize) + "...")
                            } else {
                                SearchResult.ResultsTitles.push(searchResults.items[i].title)
                            }
                        }
                        SearchResult.ResultsURLS.push(searchResults.items[i].link)
                        SearchResult.ResultsDurations.push(searchResults.items[i].duration)
                        SearchResult.ResultsThumbnail.push(searchResults.items[i].thumbnail)
                        if (searchResults.items[i].description) {
                            SearchResult.ResultsShortDescription.push(searchResults.items[i].description.slice(0, DescriptionShortSize))
                            SearchResult.ResultsFullDescription.push(searchResults.items[i].description)
                        } else {
                            SearchResult.ResultsShortDescription.push("")
                            SearchResult.ResultsFullDescription.push("")
                        }
                        if (searchResults.items[i].author) {
                            SearchResult.AuthorName.push(searchResults.items[i].author.name)
                            SearchResult.AuthorChannel.push(searchResults.items[i].author.ref)
                            SearchResult.AuthorVerified.push(searchResults.items[i].author.verified)
                        } else {
                            SearchResult.AuthorName.push("")
                            SearchResult.AuthorChannel.push("")
                            SearchResult.AuthorVerified.push("")
                        }
                        SearchResult.Views.push(searchResults.items[i].views)
                    }
                }
                //console.log(SearchResult)
            }
            var selected = 0;
            const song = {
                title: SearchResult.ResultsTitles[selected],
                url: SearchResult.ResultsURLS[selected],
                playtimestamp: 0,
                thumb: SearchResult.ResultsThumbnail[selected],
                start: 0,
                status: 0,
                size: SearchResult.ResultsDurations[selected],
                author: SearchResult.AuthorName[selected],
                verified: SearchResult.AuthorVerified[selected],
                shortdesc: SearchResult.ResultsShortDescription[selected],
                views: SearchResult.Views[selected],
            };
            var CacheStructure = {
                queue: [],
                requesters: [],
                dates: [],
            }
            const guild = msg.guild.id;
            if (SearchResult.ResultsThumbnail[selected]) {
                if (Data.GuildsCacheExistsCache(guild) == true) {
                    if (Data.GuildsCacheExistsData(guild, DataName) == true) {
                        CacheStructure = Data.GuildsCacheGetData(guild, DataName)
                        CacheStructure.queue.push(song) //THE ERROR
                        CacheStructure.requesters.push(msg.member.user.username)
                        var today = Data.GetTime();
                        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + "|" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        CacheStructure.dates.push(date)
                        Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                    } else {
                        CacheStructure.queue.push(song) //NOT THE ERROR
                        CacheStructure.requesters.push(msg.member.user.username)
                        var today = Data.GetTime();
                        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + "|" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        CacheStructure.dates.push(date)
                        Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                    }
                } else {
                    //No have any cache of that server
                    Data.GuildsCacheCreateCache(guild)
                    if (Data.GuildsCacheExistsData(guild, DataName) == true) {
                        CacheStructure = Data.GuildsCacheGetData(guild, DataName)
                        CacheStructure.queue.push(song) //NOT THE ERROR
                        CacheStructure.requesters.push(msg.member.user.username)
                        var today = Data.GetTime();
                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + "|" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        CacheStructure.dates.push(date)
                        Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                    } else {
                        CacheStructure.queue.push(song)
                        CacheStructure.requesters.push(msg.member.user.username)
                        var today = Data.GetTime();
                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + "|" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        CacheStructure.dates.push(date)
                        Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                    }
                }
            }
            var background = undefined;
            if (SearchResult.ResultsThumbnail[selected]) {
                background = await Canvas.loadImage(SearchResult.ResultsThumbnail[selected])

                const over = await Canvas.loadImage("https://cdn.glitch.com/4c45cd89-822e-48b4-9e56-c1115f1e2a1c%2FPlusIcon.png?v=1587688595223")
                const can = Canvas.createCanvas(background.width, background.height)
                const ctx = can.getContext('2d')

                ctx.drawImage(background, 0, 0, can.width, can.height)
                ctx.drawImage(over, can.width / 4, can.height / 8, can.width / 4 * 2, can.height / 8 * 6)

                const atach = new Discord.MessageAttachment(can.toBuffer(), "IMAGES.png")
                const embed = new MessageEmbed()
                    .setTitle(song.title + " foi adicionado a lista de reprodução")
                    .setColor(0xfcba03)
                    .attachFiles(atach)
                    .setThumbnail("attachment://IMAGES.png")
                    .setDescription("A música `" + song.title + "` requisitada por: `" + CacheStructure.requesters[CacheStructure.requesters.length - 1] + "` na data: `" + CacheStructure.dates[CacheStructure.dates.length - 1] + "` foi adicionada com sucesso à lista de reprodução");
                msg.channel.send(embed)
                const voiceConnection = Client.voice.connections.find(val => val.channel.guild.id == msg.guild.id);
                if (voiceConnection == null) {
                    const p = require("./play")
                    p.Main(msg, "")
                }
            } else {
                const embed = new MessageEmbed()
                    .setTitle("ERRO!")
                    .setColor(0xFF0000)
                    .setThumbnail("https://freeiconshop.com/wp-content/uploads/edd/error-flat.png")
                    .setDescription("A música `" + song.title + "` requisitada por: `" + CacheStructure.requesters[CacheStructure.requesters.length - 1] + "` na data: `" + CacheStructure.dates[CacheStructure.dates.length - 1] + "` Não pode ser adicionada a playlist devido a uma falha da api :sob:");
                msg.channel.send(embed)
            }
        }, msg)
        for (var u = 0; u < SearchResult.NumberOfResults; u++) {
            try {
                await message.react(Numbers[u])
            } catch {}
        }
        //acionar o comando play
    }
}