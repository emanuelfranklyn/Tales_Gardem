var data = require('../Controllers/GetData')
var DH = require('../Controllers/DiscordHelper')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const cacheName = "WelcomeMessageConfig"
const path = require("path")
const NumberOfImages = 0

module.exports = {
    //Base help
    Help: "Configura o envio de uma mensagem customizada quando alguém entrar em um servidor",
    Usage: "bemvindomsg",
    Topic: "moderation",
    Thumbnail: "https://www.nicepng.com/png/full/264-2646301_information-technology-code-icon-vector.png",
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
            Embed: false,
            ShowServerName: false,
            ImageWallpaperNumber: 0,
            WelcomeChannel: ""
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
            .setTitle("Configurações da mensagem de bem-vindo")
            .setDescription("1️⃣: Mensagem embutida: "+getBoolPortuguese(Variables.Embed,1)+
            "\n2️⃣: Mostrar o nome do servidor: "+getBoolPortuguese(Variables.ShowServerName,1)+
            "\n3️⃣: Papel de pareide: "+Variables.ImageWallpaperNumber+
            "\n4️⃣: Canal de bem-vindo: <#"+Variables.WelcomeChannel+">")
            .setColor("#eb9e34")
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
                msg1.react("2️⃣")
                msg1.react("3️⃣")
                msg1.react("4️⃣")
                let Collector = DH.ReactionController(msg1, collect, msg)
                async function collect(reaction, reactionCollector) {
                    if (reaction.emoji.name == "1️⃣") {
                        msg.channel.send("Selecione a reação abaixo, ✅: Envia uma mensagem embutida customizada, ❌: Envia uma imagem customizada").then(async msg2 => {
                            msg2.react("✅")
                            msg2.react("❌")
                            DH.ReactionController(msg2, async (reaction, reactionCollector) => {
                                if (reaction.emoji.name == "✅") {
                                    Variables.Embed = false
                                    MainPage = msg1;
                                    DH.ReactionRemoveController(Collector, collect)
                                    msg2.delete()
                                    savedata()
                                    ConfigMainPage(msg1.channel)
                                }
                                if (reaction.emoji.name == "❌") {
                                    Variables.Embed = false
                                    MainPage = msg1;
                                    DH.ReactionRemoveController(Collector, collect)
                                    msg2.delete()
                                    savedata()
                                    ConfigMainPage(msg1.channel)
                                }
                            }, msg);
                        })
                    }
                    if (reaction.emoji.name == "2️⃣") {
                        msg.channel.send("Selecione a reação abaixo, ✅: Exibe o nome do servidor junto a imagem/mensagem embutida, ❌: Envia a foto/mensagem embutida sem o nome do servidor").then(async msg2 => {
                            msg2.react("✅")
                            msg2.react("❌")
                            DH.ReactionController(msg2, async (reaction, reactionCollector) => {
                                if (reaction.emoji.name == "✅") {
                                    Variables.ShowServerName = true
                                    MainPage = msg1;
                                    DH.ReactionRemoveController(Collector, collect)
                                    msg2.delete()
                                    savedata()
                                    ConfigMainPage(msg1.channel)
                                }
                                if (reaction.emoji.name == "❌") {
                                    Variables.ShowServerName = false
                                    MainPage = msg1;
                                    DH.ReactionRemoveController(Collector, collect)
                                    msg2.delete()
                                    savedata()
                                    ConfigMainPage(msg1.channel)
                                }
                            }, msg);
                        })
                    }
                    if (reaction.emoji.name == "3️⃣") {
                        const WelcomeMessageBase = data.GetLocalImage("CustomWelcomeMessageBackground")
                        let Background = WelcomeMessageBase+"All.png"
                        const attachment = new MessageAttachment(Background, 'Opções.png')
                        var del;
                        msg.channel.send(attachment).then(Data => {
                            del = Data;
                        })
                        msg.channel.send("Digite abaixo o numero da mensagem que você deseja ultilizar").then(msg4 => {

                            let deleter = []
                            function test(msg3) {
                                if (msg3.author !== msg.author) {
                                    return;
                                }
                                if (Number(msg3.toString()) > -999999) {
                                    let selected = Number(msg3.toString())
                                    if (selected > NumberOfImages) {
                                        msg.channel.send("Por favor insira um numero entre 0 e "+NumberOfImages).then(msg6 => {
                                            deleter.push(msg6);
                                        })
                                        deleter.push(msg3)
                                    } else if (selected <= NumberOfImages && selected >= 0){
                                        deleter.forEach((l)=>{
                                            l.delete()
                                        })
                                        msg3.delete()
                                        MainPage = msg1;
                                        DH.ReactionRemoveController(Collector, collect)
                                        msg4.delete()
                                        if (del) {
                                            del.delete()
                                        }
                                        Variables.ImageWallpaperNumber = selected
                                        Client.removeListener("message", test)
                                        savedata() 
                                        ConfigMainPage(msg1.channel)
                                    }
                                } else {
                                    msg.channel.send("Por favor insira um numero entre 0 e "+NumberOfImages).then(msg6 => {
                                        deleter.push(msg6);
                                    })
                                    deleter.push(msg3)
                                }
                            }
                            Client.on("message", test)
                        })
                    }
                    if (reaction.emoji.name == "4️⃣") {
                        msg.channel.send("Por favor insira o canal onde as mensagems de bem vindo vão ser enviadas. Ex: #Bem-vindo").then(msg8 => {
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
                                    Variables.WelcomeChannel =channelid
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