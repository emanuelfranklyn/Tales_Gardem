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
    Help: "Adiciona uma musica à lista de reprodução da guilda",
    Usage: "tocar <Url/Nome>",
    Topic: "media",
    Thumbnail: "https://i.pinimg.com/originals/71/ba/b9/71bab9e470ee7dd6f4ab65999d540e81.png",
    NeedArguments: true,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
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
        await ytsr(args.join(' '), async function callback(err, searchResults) {
            Promise.resolve(Waiting).then(function(value) {
                value.delete()
            }).catch(() => {
                console.log(Client,"Erro: Não foi possivel deletar: tocar.js: value.delete()")
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
                for (var i=0; i < size; i++) {
                    if (i !== 2) {
                    if (searchResults.items[i].title) {
                        if (searchResults.items[i].title.length > TitleSize) {
                            SearchResult.ResultsTitles.push(searchResults.items[i].title.slice(0, TitleSize)+"...")
                        } else {
                            SearchResult.ResultsTitles.push(searchResults.items[i].title)
                        }
                    }
                    SearchResult.ResultsURLS.push(searchResults.items[i].link)
                    SearchResult.ResultsDurations.push(searchResults.items[i].duration)
                    SearchResult.ResultsThumbnail.push(searchResults.items[i].thumbnail)
                    if (searchResults.items[i].description) {
                        SearchResult.ResultsShortDescription.push(searchResults.items[i].description.slice(0,DescriptionShortSize))
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
            //User select
            var Desc = ""
            var SubNumber = 0
            for (var k = 0; k < SearchResult.NumberOfResults; k++) {
                var n = (k+1)-SubNumber
                if (SearchResult.ResultsTitles[k] != "" && SearchResult.ResultsDurations[k] != "" && SearchResult.AuthorName[k] != undefined && SearchResult.ResultsTitles[k] != undefined && SearchResult.ResultsDurations[k] != undefined && SearchResult.AuthorName[k] != undefined) {
                    if (SearchResult.AuthorVerified[k] == true) {
                        Desc = Desc+"`"+n+":` "+SearchResult.ResultsTitles[k]+" `"+SearchResult.ResultsDurations[k]+"` \nAutor: `"+SearchResult.AuthorName[k]+"` "+`${Client.emojis.cache.find(emoji => emoji.name === "TalesGardemSpaceIntVerifiedIcon1")}`+" \n> `Descrição:`\n"+SearchResult.ResultsShortDescription[k]+" \n--------------------------------------------------------->\n"
                    } else {
                        Desc = Desc+"`"+n+":` "+SearchResult.ResultsTitles[k]+" `"+SearchResult.ResultsDurations[k]+"` \nAutor: `"+SearchResult.AuthorName[k]+"` \n> `Descrição:`\n"+SearchResult.ResultsShortDescription[k]+" \n--------------------------------------------------------->\n"
                    }
                } else {
                    SubNumber += 1
                }
            }
            SearchResult.NumberOfResults -= SubNumber
            const embed = new MessageEmbed()
                .setTitle('Resultados para: '+SearchResult.SearchTerm)
                .setColor(0xfcba03)
                .setThumbnail("https://icons-for-free.com/iconfiles/png/512/Search-131983734713772583.png")
                .setDescription("`"+SearchResult.NumberOfResults+"` resultados: \n "+Desc);
            msg.channel.send(embed).then(async (message) =>{
                for (var u = 0; u<SearchResult.NumberOfResults; u++) {
                    await message.react(Numbers[u])
                }
                const filter = (reaction, user) => {
                    return user.id === msg.author.id;
                };

                const collector = message.createReactionCollector(filter, { time: 60000 });

                collector.on('collect', async (reaction, reactionCollector) => {
                    var selected = Numbers.indexOf(reaction.emoji.name)
                    message.delete()
                    const song = {
                        title: SearchResult.ResultsTitles[selected],
                        url: SearchResult.ResultsURLS[selected],
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
                            CacheStructure=Data.GuildsCacheGetData(guild, DataName)
                            CacheStructure.queue.push(song) //THE ERROR
                            CacheStructure.requesters.push(msg.member.user.username)
                            var today = new Date();
                            var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+"|"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            CacheStructure.dates.push(date)  
                            Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                        } else {
                            CacheStructure.queue.push(song) //NOT THE ERROR
                            CacheStructure.requesters.push(msg.member.user.username)
                            var today = new Date();
                            var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+"|"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            CacheStructure.dates.push(date)
                            Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                        }
                    } else {
                        //No have any cache of that server
                        Data.GuildsCacheCreateCache(guild)
                        if (Data.GuildsCacheExistsData(guild, DataName) == true) {
                            CacheStructure=Data.GuildsCacheGetData(guild, DataName)
                            CacheStructure.queue.push(song) //NOT THE ERROR
                            CacheStructure.requesters.push(msg.member.user.username)
                            var today = new Date();
                            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"|"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            CacheStructure.dates.push(date)  
                            Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                        } else {
                            CacheStructure.queue.push(song)
                            CacheStructure.requesters.push(msg.member.user.username)
                            var today = new Date();
                            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"|"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            CacheStructure.dates.push(date)
                            Data.GuildsCacheAddData(guild, DataName, CacheStructure)
                        }
                    }
                  }
                    var background = undefined;
                    if (SearchResult.ResultsThumbnail[selected]) {
                        background = await Canvas.loadImage(SearchResult.ResultsThumbnail[selected])
                    
                        const over = await Canvas.loadImage("https://cdn.glitch.com/4c45cd89-822e-48b4-9e56-c1115f1e2a1c%2FPlusIcon.png?v=1587688595223")
                        const can = Canvas.createCanvas(background.width,background.height)
                        const ctx = can.getContext('2d')

                        ctx.drawImage(background,0,0, can.width, can.height)
                        ctx.drawImage(over, can.width/4, can.height/8, can.width/4*2, can.height/8*6)

                        const atach = new Discord.MessageAttachment(can.toBuffer(), "IMAGES.png")
                        const embed = new MessageEmbed()
                            .setTitle(song.title+" foi adicionado a lista de reprodução")
                            .setColor(0xfcba03)
                            .attachFiles(atach)
                            .setThumbnail("attachment://IMAGES.png")
                            .setDescription("A música `"+song.title+"` requisitada por: `"+CacheStructure.requesters[CacheStructure.requesters.length-1]+"` na data: `"+CacheStructure.dates[CacheStructure.dates.length-1]+"` foi adicionada com sucesso à lista de reprodução");
                        msg.channel.send(embed)
                        const voiceConnection = Client.voice.connections.find(val => val.channel.guild.id == msg.guild.id);
                        if (voiceConnection == null) {
                        const p = require("./play")
                        p.Main(Client, msg, args)
                        }
                      } else {
                        const embed = new MessageEmbed()
                            .setTitle("ERRO!")
                            .setColor(0xFF0000)
                            .setThumbnail("https://freeiconshop.com/wp-content/uploads/edd/error-flat.png")
                            .setDescription("A música `"+song.title+"` requisitada por: `"+CacheStructure.requesters[CacheStructure.requesters.length-1]+"` na data: `"+CacheStructure.dates[CacheStructure.dates.length-1]+"` Não pode ser adicionada a playlist devido a uma falha da api :sob:");
                        msg.channel.send(embed)
                    }
                })
            })
        })
    //acionar o comando play
}
}