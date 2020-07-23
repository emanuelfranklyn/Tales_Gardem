var dt = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const Configs = require('../../Configs');
const solenolyrics= require("solenolyrics"); 
const DataName = "YTMusicSystemCacheData"

module.exports = {
    //Base help
    Help: "Mostra a letra da música inserida.",
    Usage: "letras <nome da música>.",
    Topic: "media",
    Thumbnail: "https://image.flaticon.com/icons/svg/1754/1754193.svg",
    NeedArguments: false,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        if (typeof(args) === typeof("")) {
            args = args.split(" ")
        }
        if (args[1]) {
            args.shift()
            args = args.join(" ")
        } else {
            let guild = msg.guild.id
            if (!dt.GuildsCacheExistsCache(guild)) {
                //if do not exists any cache of the server
                return msg.reply("This server dont have any cache")
            }
            if (!dt.GuildsCacheExistsData(guild, DataName)) {
                //if do not exists playlist
                return msg.reply("This server never have a music playlist")
            }
            let Datanewer = dt.GuildsCacheGetData(guild, DataName)
            if (!Datanewer.queue[0]) {
                //if do not exists playlist
                return msg.reply("No one music is playing right now ...")
            }
            args = Datanewer.queue[0].title
        }
        var lyrics = await solenolyrics.requestLyricsFor(args); 
        if (!lyrics) {
            return msg.reply("Não achei essa letra: "+args)
        }
        let parts = lyrics.length/1980
        let lyricsd = [];
        for (let i=0; i< Math.round(parts+0.99); i++) {
            if (i !== Math.round((parts+0.99)-1)) {
                lyricsd[i] = lyrics.slice(i*1980,(i+1)*1980)+"..."
            } else {
                lyricsd[i] = lyrics.slice(i*1980,(i+1)*1980)
            }
            if (i > 0) {
                lyricsd[i] = "[...] "+lyricsd[i]
            }
        }
        let img = await Promise.resolve(dt.searchImage(args))
        lyricsd.forEach((element, index) => {
            const embed = new MessageEmbed()
            .setColor(0xFF9999)
            .setThumbnail(img)
            .setDescription(element);
            if (index === 0) {
                embed.setTitle('Letras para: '+args+', parte '+(index+1))
            } else {
                embed.setTitle('Parte '+(index+1)+' de: '+args)
            }
            msg.channel.send(embed);
        })
    }
}