var data = require('../Controllers/GetData')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const Configs = require('../../Configs')
const cacheName = "SimilarConfig"
const imagepath = "../../images/CustomWelcomeMessageBackground"
const path = require("path")
const images = imagepath+"All.png"
const NumberOfImages = 0

module.exports = {
    //Base help
    Help: "Configura o sistema de similariedade de nome de comandos",
    Usage: "similarcommands",
    Topic: "moderation",
    Thumbnail: "https://www.nicepng.com/png/full/264-2646301_information-technology-code-icon-vector.png",
    NeedArguments: false,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        if (msg.member.hasPermission('MANAGE_GUILD') == false) {
            const embed = new MessageEmbed()
                .setTitle('Sem permissão')
                .setColor(0xFF9999)
                .setThumbnail("https://cdn4.iconfinder.com/data/icons/user-management-soft/512/no_permission-512.png")
                .setDescription("Você não tem a permissão de gerenciar servidor necessaria para usar este comando!");
                return msg.channel.send(embed)
        }
        let Variables = {
            enabled: false,
        }
        function getBoolPortuguese(Bool, type) {
            type = type || 0
            if (typeof(Bool) != typeof(true)) {
                return "Erro"
            }
            if (Bool === true) {
                if (type == 0) {
                    return "Verdadeiro"
                } else if (type == 1) {
                    return "Sim"
                }
            } else {
                if (type == 0) {
                    return "Falso"
                } else if (type == 1) {
                    return "Não"
                }
            }
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
            .setDescription("1️⃣: ativo: "+getBoolPortuguese(Variables.enabled,1))
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
                const filter = (reaction, user) => {
                    return user.id === msg.author.id;
                };

                const collector = msg1.createReactionCollector(filter, { time: 600000000 });

                collector.on('collect', collect)
                async function collect(reaction, reactionCollector) {
                    if (reaction.emoji.name == "1️⃣") {
                        msg.channel.send("Selecione a reação abaixo, ✅: liga a similariedade, ❌: desliga a similariedade").then(async msg2 => {
                            msg2.react("✅")
                            msg2.react("❌")
                            const filter2 = (reaction, user) => {
                                return user.id === msg.author.id;
                            };
            
                            const collector2 = msg2.createReactionCollector(filter2, { time: 600000000 });
            
                            collector2.on('collect', async (reaction, reactionCollector) => {
                                if (reaction.emoji.name == "✅") {
                                    Variables.enabled = true
                                    MainPage = msg1;
                                    collector.removeListener('collect', collect)
                                    msg2.delete()
                                    savedata()
                                    ConfigMainPage(msg1.channel)
                                }
                                if (reaction.emoji.name == "❌") {
                                    Variables.enabled = false
                                    MainPage = msg1;
                                    collector.removeListener('collect', collect)
                                    msg2.delete()
                                    savedata()
                                    ConfigMainPage(msg1.channel)
                                }
                            });
                        })
                    }
                };
            }
        }
        ConfigMainPage(msg.channel)
    }       
}