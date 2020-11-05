var data = require('../Controllers/GetData')
var DH = require('../Controllers/DiscordHelper')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const cacheName = "votesystem"
const path = require("path")

module.exports = {
    //Base help
    Help: "Configura as votações",
    Usage: "cvotar",
    Topic: "utilities",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        if (msg.member.hasPermission('MANAGE_GUILD') == false) {
            const embed = new MessageEmbed()
                .setTitle('Sem permissão')
                .setColor(0xFF9999)
                .setThumbnail("https://cdn4.iconfinder.com/data/icons/user-management-soft/512/no_permission-512.png")
                .setDescription("Você não tem a permissão de gerenciar servidor necessaria para usar este comando!");
                return msg.channel.send(embed)
        }
        let Variables = {
            channel: "",
        }
        function savedata() {
            let GuildName = msg.guild.id
            if (data.GuildsCacheExistsCache(GuildName)) {
                //Exists data to this server
                data.GuildsCacheAddData(GuildName, cacheName, Variables)
            } else {
                //do not have data to this server create one
                data.GuildsCacheCreateCache(GuildName)
                savedata()
            }
        }

        function LoadData() {
            let GuildName = msg.guild.id
            if (data.GuildsCacheExistsCache(GuildName)) {
                //Exists data to this server
                if (data.GuildsCacheExistsData(GuildName, cacheName)) {
                    //Exists data to this server
                    Variables = data.GuildsCacheGetData(GuildName, cacheName)
                }
            }
        }
        var MainPage;
        function ConfigMainPage(channel) {
            LoadData()
            const ConfigMainPag = new MessageEmbed()
            .setTitle("Configurações da similariedade de comandos")
            .setDescription("1️⃣: Canal de votações: "+Variables.channel)
            .setColor("#FFaa99")
            if (MainPage) {
                  MainPage.edit(ConfigMainPag)
                  MainPage.reactions.removeAll().catch(error => {console.log("Failed to clear reactions: Bemvindomsg.js", error)})
                  rest(MainPage)                          
            } else {
                channel.send(ConfigMainPag).then(async msg1 => {
                    rest(msg1)
                });
            }
            function rest(msg1) {
                msg1.react("1️⃣")
                DH.ReactionController(msg1, collect, msg)
                async function collect(reaction, reactionCollector) {
                    if (reaction.emoji.name == "1️⃣") {
                        msg.channel.send("Por favor insira o canal onde as votações vão ser enviadas. Ex: #votações").then(msg8 => {
                            let dele;
                            function test(msg7) {
                                if (msg7.author !== msg.author) {
                                    return;
                                }
                                if (dele) { dele.delete() }
                                let message = msg7.toString()
                                let hashposition = message.indexOf('#')
                                let finalPosition = message.indexOf('>', hashposition)
                                let channelid = message.slice(hashposition+1,finalPosition)
                                if (channelid && hashposition != -1 && finalPosition != -1) {
                                    Variables.channel =channelid
                                    msg7.delete()
                                    msg8.delete()
                                    Client.removeListener("message", test) 
                                    savedata()
                                    ConfigMainPage(msg1.channel)
                                } else {
                                    msg.channel.send("Por favor insira um canal de texto valido. Um canal de texto valido deve ficar azul e possivel de clicar!").then(a => {
                                        dele = a
                                    })
                                    msg7.delete()
                                }
                            }
                            Client.on("message", test)
                        })
                    }
                };
            }
        }
        ConfigMainPage(msg.channel)
    }
}