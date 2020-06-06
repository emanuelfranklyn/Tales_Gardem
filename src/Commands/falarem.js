var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const Configs = require('../../Configs')
const DisHel = require('../Controllers/DiscordHelper')

module.exports = {
    //Base help
    Help: "Envia uma mensagem embed customizada no canal escolhido.",
    Usage: "falarem",
    Topic: "moderation",
    Thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcStrnDX9zdXvqK55A1LDuA6MZSMHc55DntH7w8YO_Tgd2sNLkjm&usqp=CAU",
    NeedArguments: false,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        const DescD = []
        var fields = []
        var AddField = false
        var AddFieldP2 = false
        var FieldNameCache = ""
        var DELETEVISUALIZATION = [];
        var C1;
        var C2;
        var lastoneisafield = false
        var FTitle = false;
        var FUrl = false;
        var FColor = false;
        var FThumb = false;
        var FFooterT = false;
        var FFooterU = false; //IMAGE!!!!!!!!
        var FAName = false;
        var FAImage = false;
        var FAUrl = false;
        var FImage = false;
        var FCHANNELMESSAGESENDER = false;
        var TFTitle = "Visualização";
        var TFUrl = "";
        var TFColor = "#FFFFFF";
        var TFThumb = "https://getdrawings.com/free-icon-bw/visual-basic-6.0-icon-26.png";
        var TFTimecodeB = false;
        var TFFooterT = "";
        var TFFooterU = "";
        var TFAName = "";
        var TFAUrl = "";
        var TFAImage = "";
        var TFImage;
        var HaveFooter = false;
        var HaveAuthor = false;
        var FinalizationFormData = []
        var ChannelToSend;
        var _G = []
        var CreationMessage;
        try {
            //if (msg.member.hasPermission('ADMINISTRATOR') == false) {
            //    const embed = new MessageEmbed()
            //    .setTitle('Sem permissão')
            //    .setColor(0xFF9999)
            //    .setThumbnail("https://cdn4.iconfinder.com/data/icons/user-management-soft/512/no_permission-512.png")
            //    .setDescription("Você não tem a permissão de administrador necessaria para usar este comando!");
            //    return msg.channel.send(embed)
            //}
            //Send the instructions message
            const embed = new MessageEmbed()
                .setTitle('Mensagem embutida customizável')
                .setColor(0x19AA19)
                .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcStrnDX9zdXvqK55A1LDuA6MZSMHc55DntH7w8YO_Tgd2sNLkjm&usqp=CAU")
                .setDescription("Olá seja bem-vindo ao menu the criação de mensagem embutidas customizáveis \n Por favor selecione a reação abaixo para iniciar");
            msg.channel.send(embed).then(async (value) => {
                await value.react("🆗")
                const filter = (reaction, user) => {
                    return user.id === msg.author.id;
                };

                const collector = value.createReactionCollector(filter, { time: 60000 });

                collector.on('collect', async (reaction, reactionCollector) => {
                    //Start the custom messages // send the preview
                    value.delete()
                    const embed = new MessageEmbed()
                        .setTitle('Criação')
                        .setColor(0x19AA19)
                        .setThumbnail("https://www.freepnglogos.com/uploads/plus-icon/icon-symbol-plus-vector-graphic-pixabay-34.png")
                        .setDescription("Por favor digite abaixo sua mensagem e use ENTER para quebra de linhas \n você pode usar elementos especiais na sua mensagem \n Exemplo: `*Italico*`, `**Negrito**`,`***Italico e Negrito***`, `> Linha com barra atraz`, `>>> Multiplas linhas com barra atraz`, `` `Fundo preto` ``, `__Sublinhado__ (2x_)`, `~~Cortado~~`, ` ```Caixa de multiplas linhas``` `,Você pode misturar diferentes estilos! \n Ultilize as reações para opções customizadas! \n '◀️': Desfaz a ultima ação \n '🔳': Adiciona um campo \n '⏏️': adiciona um campo em branco \n '🛑':Finaliza")
                    msg.channel.send(embed).then(async (message) => {
                        CreationMessage = message
                        await Visualization()
                        const test = async (msg2) => {
                            if (msg2.author.id !== msg.author.id) { return}
                            if (msg2.attachments.size > 0 && FThumb === false && FImage === false && FFooterU === false && FAImage === false) {
                                const embed = new MessageEmbed()
                                .setTitle("Anexos não aceitos! (por agora)")
                                .setColor(0xFFFFFF)
                                .setThumbnail("https://i7.uihere.com/icons/605/755/657/production-processing-57ac41214291d85eefdc09c0264c5676.png")
                                .setDescription("O sistema de mensagems embutidas nesse atual estagio não aceita anexos ☹️")
                                return embed
                            }
                            if (AddField == true) {
                                    FieldNameCache = msg2.toString()
                                    Promise.resolve(C1).then((data) => {
                                        data.delete()
                                    })
                                    msg2.delete()
                                    msg.channel.send("`Por favor digite a descrição do campo abaixo ⬇️` - `Clique 🔲 no abaixo para deixar em branco`").then(async (data) => {
                                        C2 = data
                                        data.react("🔲")
                                        const collector4 = data.createReactionCollector(filter, { time: 600000000})
                                        collector4.on('collect', async (reaction, reactionCollector) => {
                                            if (AddFieldP2 == true) {
                                                AddFieldP2 = false
                                                fields.push({name: FieldNameCache, value: '\u200B'})
                                                Promise.resolve(C2).then((data) => {
                                                    data.delete()
                                                })
                                                await Visualization()
                                            }
                                        })
                                    })
                                    AddFieldP2 = true
                                    AddField = false
                            } else if (AddFieldP2 == true) {
                                    AddFieldP2 = false
                                    fields.push({name: FieldNameCache, value: msg2.toString()})
                                    Promise.resolve(C2).then((data) => {
                                        data.delete()
                                    })
                                    msg2.delete()
                                    await Visualization()
                            } else if (FTitle === true) {
                                TFTitle = msg2.toString()
                                FTitle = false;
                                FinalizationFormData.push(msg2)
                                _G.FFURL()
                            } else if (FUrl === true) {
                                TFUrl = msg2.toString()
                                FUrl = false
                                FinalizationFormData.push(msg2)
                                _G.FFCOLOR()
                            } else if (FColor === true) {
                                TFColor = msg2.toString()
                                FColor = false
                                FinalizationFormData.push(msg2)
                                _G.FFTHUMB()
                            } else if (FThumb === true) {
                                if (msg2.attachments.size > 0) {
                                    TFThumb = msg2.attachments.array()[0].attachment
                                } else {
                                    TFThumb = msg2.toString()
                                }
                                FThumb = false
                                FinalizationFormData.push(msg2)
                                _G.FFTIMECODE()
                            } else if (FFooterT === true) {
                                TFFooterT = msg2.toString()
                                FFooterT = false
                                FinalizationFormData.push(msg2)
                                _G.FFFOOTERU()
                            } else if (FFooterU === true) {
                                if (msg2.attachments.size > 0) {
                                    TFFooterU = msg2.attachments.array()[0].attachment
                                } else {
                                    TFFooterU = msg2.toString()
                                }
                                FFooterU = false
                                FinalizationFormData.push(msg2)
                                _G.FFAUTHORN()
                            } else if (FAName === true) {
                                TFAName = msg2.toString()
                                FAName = false
                                FinalizationFormData.push(msg2)
                                _G.FFAURL()
                            } else if (FAImage === true) {
                                if (msg2.attachments.size > 0) {
                                    TFAImage = msg2.attachments.array()[0].attachment
                                } else {
                                    TFAImage = msg2.toString()
                                }
                                FAImage = false
                                FinalizationFormData.push(msg2)
                                _G.FFIMAGE()
                            } else if (FAUrl === true) {
                                TFAUrl = msg2.toString()
                                FAUrl = false;
                                FinalizationFormData.push(msg2)
                                _G.FFAIMAGE()
                            } else if (FImage === true) {
                                if (msg2.attachments.size > 0) {
                                    TFImage = msg2.attachments.array()[0].attachment
                                } else {
                                    TFImage = msg2.toString()
                                }
                                FImage = false
                                FinalizationFormData.push(msg2)
                                _G.FFCHANNELMESSAGESENDER()
                            } else if (FCHANNELMESSAGESENDER) {
                                //find the # in the string
                                FinalizationFormData.push(msg2)
                                let message = msg2.toString()
                                let hashposition = message.indexOf('#')
                                let finalPosition = message.indexOf('>', hashposition)
                                let channelid = message.slice(hashposition+1,finalPosition)
                                _G.ChannelToSend = Client.channels.cache.get(channelid)
                                //msg.channel.send(channelid)
                                if (_G.ChannelToSend.permissionsFor(msg2.member).has("SEND_MESSAGES")) {
                                    _G.FFENDER()
                                } else {
                                    let ERRORRRRR = msg.channel.send("Você não tem permissão para enviar mensagens nesse canal, insira outro na qual você tenha permissão para falar!")
                                    FinalizationFormData.push(ERRORRRRR)
                                }
                            } else {
                                lastoneisafield = false
                                DescD.push(msg2.toString())
                                    DELETEVISUALIZATION.forEach(async (Value, Index) => {
                                    if (Value.CanDelete == true) {
                                        Value.Data.delete()
                                        DELETEVISUALIZATION.splice(Index, 1)
                                        } 
                                    })
                                msg2.delete()
                                await Visualization()
                            }
                        }
                        Client.on("message", test)
                        async function Visualization(G) {
                            _G.THEEMBED = new MessageEmbed()
                                .setTitle(TFTitle)
                                .setURL(TFUrl)
                                .setColor(TFColor)
                                .setThumbnail("https://i7.uihere.com/icons/605/755/657/production-processing-57ac41214291d85eefdc09c0264c5676.png")
                                .setDescription(DescD)
                                .setThumbnail(TFThumb)
                                .setImage(TFImage)
                                if (TFTimecodeB === true) {
                                    _G.THEEMBED.setTimestamp()
                                }
                                if (HaveFooter === true) {
                                    _G.THEEMBED.setFooter(TFFooterT, TFFooterU)
                                }
                                if (HaveAuthor === true) {
                                    _G.THEEMBED.setAuthor(TFAName, TFAImage, TFAUrl)
                                }
                                fields.forEach((Value, Index) => {
                                    _G.THEEMBED.addField(Value.name, Value.value)
                                })
                                return msg.channel.send(_G.THEEMBED).then(async data => {
                                    DELETEVISUALIZATION.push({Data:data, CanDelete: false});
                                    if (G && G === true) {
                                        DELETEVISUALIZATION[DELETEVISUALIZATION.length] = {Data:data, CanDelete: true}
                                        DELETEVISUALIZATION.forEach(async (Value, Index) => {
                                            if (Value.CanDelete == true && Index != DELETEVISUALIZATION.length-1) {
                                              Value.Data.delete()
                                              DELETEVISUALIZATION.splice(Index, 1)
                                            } 
                                          })
                                    } else {
                                        data.react("🛑").then(async() => {
                                            await data.react("🔳").then(async() => {
                                                await data.react("◀️").then(async() => {
                                                    await data.react("⏏️").then(async() => {
                                                        DELETEVISUALIZATION[DELETEVISUALIZATION.length] = {Data:data, CanDelete: true}
                                                        DELETEVISUALIZATION.forEach(async (Value, Index) => {
                                                            if (Value.CanDelete == true && Index != DELETEVISUALIZATION.length-1) {
                                                              Value.Data.delete()
                                                              DELETEVISUALIZATION.splice(Index, 1)
                                                            } 
                                                          })
                                                    })
                                                })
                                            })
                                        })
                                    }
                                const filter = (reaction, user) => {
                                    return user.id === msg.author.id;
                                };
        
                                const collector2 = data.createReactionCollector(filter, { time: 600000000})
        
                                collector2.on('collect', async (reaction, reactionCollector) => {
                                    if (reaction.emoji.name == "🛑") {
                                        //ask the title
                                        FTitle = true
                                        msg.channel.send("`Por favor insira o título da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar o titulo em branco`").then(async (data) => {
                                            data.react("🔲")
                                            FinalizationFormData.push(data)
                                            const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                            collector5.on('collect', async (reaction, reactionCollector) => {
                                                if (FTitle === true) {
                                                    TFTitle = "\u200B"
                                                    FTitle = false
                                                    data.reactions.removeAll();
                                                    _G.FFURL()
                                                }
                                            })
                                        })
                                        //ask the url
                                        _G.FFURL = () => {
                                            Visualization(true)
                                            FUrl = true
                                            msg.channel.send("`Por favor insira a url do título da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar a url em branco`").then(async (data) => {
                                                data.react("🔲")
                                                FinalizationFormData.push(data)
                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                    if (FUrl === true) {
                                                        TFUrl = ""
                                                        FUrl = false
                                                        data.reactions.removeAll();
                                                        _G.FFCOLOR()
                                                    }
                                                })
                                            })
                                        }
                                        //ask the color
                                        _G.FFCOLOR = () => {
                                            Visualization(true)
                                            FColor = true
                                            msg.channel.send("`Por favor insira o codigo HEX da cor da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar a cor aleatoria`").then(async (data) => {
                                                data.react("🔲")
                                                FinalizationFormData.push(data)
                                                FinalizationFormData.push(msg.channel.send("Seletor de cores: https://www.google.com/search?q=colorpicker"))
                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                    if (FColor === true) {
                                                        TFColor = "RANDOM"
                                                        FColor = false
                                                        data.reactions.removeAll();
                                                        _G.FFTHUMB()
                                                    }
                                                })
                                            })
                                        }
                                        _G.FFTHUMB = () => {
                                            Visualization(true)
                                            //ask the 
                                            FThumb = true
                                            msg.channel.send("`Por favor insira a url ou envie um anexo da thumbnail da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar a thumbnail em branco`").then(async (data) => {
                                                data.react("🔲")
                                                FinalizationFormData.push(data)
                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                    if (FThumb === true) {
                                                        TFThumb = ""
                                                        FThumb = false
                                                        data.reactions.removeAll();
                                                        _G.FFTIMECODE()
                                                    }
                                                })
                                            })
                                        }
                                        _G.FFTIMECODE = () => {
                                            Visualization(true)
                                            //ask the timecode
                                            msg.channel.send("`Você deseja adicionar um marca de horario na sua mensagem incorporada?`").then(async (data) => {
                                                data.react("✅")
                                                data.react("❌")
                                                FinalizationFormData.push(data)
                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                    if (reaction.emoji.name == "✅") {
                                                        TFTimecodeB = true
                                                    } else {
                                                        TFTimecodeB = false    
                                                    }
                                                    data.reactions.removeAll();
                                                    _G.FFFOOTER()
                                                })
                                            })
                                        }
                                        _G.FFFOOTER = () => {
                                            Visualization(true)
                                            //ask the footer
                                            msg.channel.send("`Você deseja adicionar um rodapé na sua mensagem incorporada?`").then(async (data) => {
                                                data.react("✅")
                                                data.react("❌")
                                                FinalizationFormData.push(data)
                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                    if (reaction.emoji.name == "✅") {
                                                        //Footer!
                                                        HaveFooter = true
                                                        FFooterT = true
                                                        msg.channel.send("`Por favor insira o texto do rodapé da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar o título do rodapé em branco`").then(async (data) => {
                                                            data.react("🔲")
                                                            FinalizationFormData.push(data)
                                                            const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                            collector5.on('collect', async (reaction, reactionCollector) => {
                                                                if (FFooterT === true) {
                                                                    TFFooterT = ""
                                                                    FFooterT = false
                                                                    data.reactions.removeAll();
                                                                    _G.FFFOOTERU()
                                                                }
                                                            })
                                                        })
                                                        _G.FFFOOTERU = () => {
                                                            Visualization(true)
                                                            FFooterU = true
                                                            msg.channel.send("`Por favor insira a url ou anexo da imagem do rodapé da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar o rodapé sem imagem`").then(async (data) => {
                                                                data.react("🔲")
                                                                FinalizationFormData.push(data)
                                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                                    if (FFooterU === true) {
                                                                        TFFooterU = ""
                                                                        FFooterU = false
                                                                        data.reactions.removeAll();
                                                                        _G.FFAUTHORN()
                                                                    }
                                                                })
                                                            })
                                                        }
                                                    } else {
                                                        HaveFooter = false  
                                                        _G.FFAUTHORN()  
                                                    }
                                                    data.reactions.removeAll();
                                                })
                                            })
                                        }
                                        _G.FFAUTHORN = () => { //CONTINUAR DAQUI!!!!!!!!!!!!!!!!!!!!!!!!
                                            Visualization(true)
                                            //ask the author name
                                            msg.channel.send("`Você deseja adicionar um autor na sua mensagem incorporada?`").then(async (data) => {
                                                data.react("✅")
                                                data.react("❌")
                                                FinalizationFormData.push(data)
                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                    if (reaction.emoji.name == "✅") {
                                                        //author!
                                                        HaveAuthor = true
                                                        FAName = true
                                                        msg.channel.send("`Por favor insira o nome do autor da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar o nome do autor em branco`").then(async (data) => {
                                                            data.react("🔲")
                                                            FinalizationFormData.push(data)
                                                            const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                            collector5.on('collect', async (reaction, reactionCollector) => {
                                                                if (FAName === true) {
                                                                    TFAName = ""
                                                                    FAName = false
                                                                    data.reactions.removeAll();
                                                                    _G.FFAURL()
                                                                }
                                                            })
                                                        })
                                                        _G.FFAURL = () => {
                                                            Visualization(true)
                                                            FAUrl = true
                                                            msg.channel.send("`Por favor insira a url do autor da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar a url do autor em branco`").then(async (data) => {
                                                                data.react("🔲")
                                                                FinalizationFormData.push(data)
                                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                                    if (FAUrl === true) {
                                                                        TFAUrl = ""
                                                                        FAUrl = false
                                                                        data.reactions.removeAll();
                                                                        _G.FFAIMAGE()
                                                                    }
                                                                })
                                                            })
                                                        }
                                                        _G.FFAIMAGE = () => {
                                                            Visualization(true)
                                                            FAImage = true
                                                            msg.channel.send("`Por favor insira a url ou anexo imagem do autor da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar a imagem do autor em branco`").then(async (data) => {
                                                                data.react("🔲")
                                                                FinalizationFormData.push(data)
                                                                const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                                collector5.on('collect', async (reaction, reactionCollector) => {
                                                                    if (FAImage === true) {
                                                                        TFAImage = "";
                                                                        FAImage = false
                                                                        data.reactions.removeAll();
                                                                        _G.FFIMAGE()
                                                                    }
                                                                })
                                                            })
                                                        }
                                                    } else {
                                                        HaveAuthor = false   
                                                        _G.FFIMAGE() 
                                                    }
                                                    data.reactions.removeAll();
                                                })
                                            })
                                        }
                                        _G.FFIMAGE = () => {
                                            Visualization(true)
                                            //ask the image
                                                FImage = true
                                                msg.channel.send("`Por favor insira a url ou anexo imagem da sua mensagem incorporada!` - `Clique no 🔲 abaixo para deixar sem imagem`").then(async (data) => {
                                                    data.react("🔲")
                                                    FinalizationFormData.push(data)
                                                    const collector5 = data.createReactionCollector(filter, { time: 600000000})
                                                    collector5.on('collect', async (reaction, reactionCollector) => {
                                                        if (FImage === true) {
                                                            TFImage = "";
                                                            FImage = false
                                                            data.reactions.removeAll();
                                                            _G.FFCHANNELMESSAGESENDER()
                                                        }
                                                    })
                                                })
                                            }
                                        //Ask the channel the message will be sended
                                        _G.FFCHANNELMESSAGESENDER = () => {
                                            Visualization(true)
                                            FCHANNELMESSAGESENDER = true
                                            FinalizationFormData.push(msg.channel.send("`Por favor insira o canal de texto para o qual sua mensagem incorporada sera enviada!` - `Marque usando #Nomedocanal`"))
                                        }
                                        //stop the listener //Check
                                        _G.FFENDER = () => {
                                            Client.removeListener("message", test) 
                                            //Send the message
                                            const GEMBED= new MessageEmbed()
                                                .setTitle(TFTitle)
                                                .setURL(TFUrl)
                                                .setColor(TFColor)
                                                .setThumbnail("https://i7.uihere.com/icons/605/755/657/production-processing-57ac41214291d85eefdc09c0264c5676.png")
                                                .setDescription(DescD)
                                                .setThumbnail(TFThumb)
                                                .setImage(TFImage)
                                                if (TFTimecodeB === true) {
                                                    GEMBED.setTimestamp()
                                                }
                                                if (HaveFooter === true) {
                                                    GEMBED.setFooter(TFFooterT, TFFooterU)
                                                }
                                                if (HaveAuthor === true) {
                                                    GEMBED.setAuthor(TFAName, TFAImage, TFAUrl)
                                                }
                                                fields.forEach((Value, Index) => {
                                                    GEMBED.addField(Value.name, Value.value)
                                                })
                                            _G.ChannelToSend.send(GEMBED)
                                            FinalizationFormData.forEach((value, index) => {
                                                Promise.resolve(value).then((data) => {
                                                    data.delete()
                                                })
                                            })
                                            msg.delete()
                                            DELETEVISUALIZATION.forEach(async (Value, Index) => {
                                                if (Value.CanDelete == true) {
                                                  Value.Data.delete()
                                                  DELETEVISUALIZATION.splice(Index, 1)
                                                } 
                                              })
                                              CreationMessage.delete()
                                        }
                                    }
                                    if (reaction.emoji.name == "🔳") {
                                        //footer
                                        lastoneisafield = true
                                        msg.channel.send("`Por favor digite o titulo do campo abaixo ⬇️` - `Clique 🔲 no abaixo para deixar em branco`").then(async (data) => {
                                            C1 = data;
                                            data.react("🔲")
                                            const collector3 = data.createReactionCollector(filter, { time: 600000000})
                                            collector3.on('collect', async (reaction, reactionCollector) => {
                                                if (AddField == true) {
                                                    FieldNameCache = '\u200B'
                                                    Promise.resolve(C1).then((data) => {
                                                        data.delete()
                                                    })
                                                    msg.channel.send("`Por favor digite a descrição do campo abaixo ⬇️` - `Clique 🔲 no abaixo para deixar em branco`").then(async (data) => {
                                                        C2 = data
                                                        data.react("🔲")
                                                        const collector4 = data.createReactionCollector(filter, { time: 600000000})
                                                        collector4.on('collect', async (reaction, reactionCollector) => {
                                                            if (AddFieldP2 == true) {
                                                                AddFieldP2 = false
                                                                fields.push({name: FieldNameCache, value: '\u200B'})
                                                                Promise.resolve(C2).then((data) => {
                                                                    data.delete()
                                                                })
                                                                await Visualization()
                                                            }
                                                        })
                                                    })
                                                    AddFieldP2 = true
                                                    AddField = false
                                                }
                                            })
                                        })
                                        AddField = true
                                    }
                                    if (reaction.emoji.name == "◀️") {
                                        //Undo
                                        if (lastoneisafield == true) {
                                            fields.pop()
                                        } else {
                                            DescD.pop()
                                        }
                                        await Visualization()
                                    }
                                    if (reaction.emoji.name == "⏏️") {
                                        //Blank space
                                        lastoneisafield = true
                                        fields.push({name:'\u200B', value:'\u200B'})
                                        DELETEVISUALIZATION.forEach(async (Value, Index) => {
                                            if (Value.CanDelete == true) {
                                              Value.Data.delete()
                                              DELETEVISUALIZATION.splice(Index, 1)
                                            } 
                                          })
                                        Visualization()
                                    }
                                });
                            })
                        }
                    });
                    //finish
                });
            });
        } catch(erro) {
            DisHel.Log(Client,erro) 
        }
    }
}