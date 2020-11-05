var Dt = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')

module.exports = {
    //Base help
    Help: "Cria uma votação.",
    Usage: "votar <texto>",
    Topic: "utilities",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        if (Dt.GuildsCacheExistsCache(msg.guild.id)) {
            if (Dt.GuildsCacheExistsData(msg.guild.id,"votesystem")) {
              let data = Dt.GuildsCacheGetData(msg.guild.id, "votesystem")
              if (data.channel != "") {
                args.shift()
                const embed = new MessageEmbed()
                    .setAuthor("Sugestão de: "+msg.author.username+"#"+msg.author.discriminator, "https://cdn.discordapp.com/avatars/"+msg.author.id+"/"+msg.author.avatar+".png")
                    .setDescription("```"+args.join(" ")+"```\n✅ Votar: Sim\n❌ Votar: Não")
                    .setColor("#FFAA22")
                Client.channels.fetch(data.channel).then(channel => channel.send(embed).then(async (data) => {
                    await data.react("✅")
                    await data.react("❌")
                    msg.channel.send("Votação criada com sucesso ✅")
                }))
              }
            }
        }
    }
}