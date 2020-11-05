var Dt = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')

module.exports = {
    //Base help
    Help: "Cria uma frequência.",
    Usage: "frequencia <Texto>",
    Topic: "utilities",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        if (Dt.GuildsCacheExistsCache(msg.guild.id)) {
            if (Dt.GuildsCacheExistsData(msg.guild.id,"frequencysystem")) {
              let data = Dt.GuildsCacheGetData(msg.guild.id, "frequencysystem")
              if (data.channel != "" && data.role != "") {
                  args.shift()
                  let guild = Client.guilds.cache.get(msg.guild.id);
                let rolemember = msg.member.roles.cache.find(r => r.id === data.role)
                let role = guild.roles.cache.find(r => r.id === data.role)
                if(!rolemember){
                    return msg.reply("Você não possui o cargo "+role.name+" para executar este comando!")
                }
                let member = guild.member(msg.author);
                let nickname = member ? member.displayName : null;
                const embed = new MessageEmbed()
                    .setAuthor("Frequência por: "+nickname, "https://cdn.discordapp.com/avatars/"+msg.author.id+"/"+msg.author.avatar+".png")
                    .setDescription(">>> ```"+args.join(" ")+"```\n\n`Se seu nome não aparecer na lista tente tirar e recolocar a reação!`")
                    .addField("Pessoas que marcaram a frequência:", "Ninguem")
                    .setColor("#FFAA22")
                Client.channels.fetch(data.channel).then(channel => channel.send(embed).then(async (data) => {
                    await data.react("✅")
                    await data.react("🛑")
                    msg.channel.send("Frequência criada com sucesso ✅")
                        const filter = (reaction, user) => {
                            return true;
                        };
                        let looperman = true
                        function waiter() {
                            setTimeout(() => {
                                if (looperman) {
                                    loop()
                                }
                            }, 50000000)
                        }
                        function loop() {
                            waiter()
                        let collector3 = data.createReactionCollector(filter, { time: 600000000})
                        collector3.on('collect', fcollect)
                        async function fcollect(reaction, reactionCollector) {
                                member = guild.member(reactionCollector);
                                nickname = member ? member.displayName : null;
                            if (reaction.emoji.name == "🛑") {
                                if (reactionCollector.id === msg.author.id) {
                                    looperman = false
                                    data.reactions.removeAll()
                                    Client.removeListener('collect', fcollect)
                                    embed.fields[0].value = "-❌-Frequência finalizada-❌-\n"+embed.fields[0].value
                                    await data.edit(embed)
                                }
                            }
                            if (reaction.emoji.name == "✅") {
                                let time = Dt.GetTime(Dt.GetTimeNow()).toString()
                                let minutesecoundss = time.split(" ")[4].split(":") 
                                let minutesecounds = minutesecoundss[0]+":"+minutesecoundss[1]
                                let desc = embed.fields[0].value + "\n"+minutesecounds+" - "+nickname+" ✅"
                                if (embed.fields[0].value === "Ninguem") {
                                    desc = minutesecounds+" - "+nickname+" ✅"
                                }
                                if (!embed.fields[0].value.includes(nickname)) {
                                    embed.fields[0].value = desc
                                    await data.edit(embed)
                                }
                            }
                        }
                    }
                    loop()
                    }))
                
              } else {
                  msg.reply("Configure a frequencia antes de usar!!!")
              }
            }
        }
    }
}