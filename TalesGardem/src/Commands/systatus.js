const { MessageEmbed, MessageAttachment } = require('discord.js')
const path = require("path")
const System = require(path.resolve("controllers","GetSystemData"));

module.exports = {
    //Base help
    Help: "Exibe informações sobre o sistema",
    Usage: "systatus",
    Topic: "utilities",
    Thumbnail: "https://i.imgur.com/s3xVn5k.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        let EmbedMessage = undefined;
        const embed = new MessageEmbed()
            .setTitle("Informações do sistema")
            .setColor(0x99FF99)
            .setThumbnail("https://png2.cleanpng.com/sh/b15885d6b6f11834ee84d541608b435e/L0KzQYm3U8MyN6Fxj5H0aYP2gLBuTfNwdaF6jNd7LXnmf7B6TgN6e6VqhZ9ybnbygr7olPlwdl54keV9ZX2wRbLphsM4QWNofqsBMEGxR4OAUcI4PWo2TaQ7NEi0QIW5WMUxO191htk=/kisspng-computer-icons-system-information-system-5abf3792cf9601.7271275915224810428503.png")
            .setDescription("`Obtendo dados...`")
            .addField("Processador:", "Obtendo dados...")
            .addField("Memoria (RAM):", "Obtendo dados...")
            .addField("Placa de vídeo:", "Obtendo dados...")
            .addField("Sistema Operacional:", "Obtendo dados...")
        await msg.channel.send(embed).then(async msg1=>{
            EmbedMessage = msg1;
            await System.GetComputerModel().then((data)=>{
                embed.description = "`"+data.model+"`";
                if (EmbedMessage) { 
                    EmbedMessage.edit(embed)
                }
            })
            await System.GetCPUModel().then((data)=>{
                    embed.fields[0].value = "```diff\n+ "+data.manufacturer+" "+data.brand+"\n+ Velocidade: "+data.speed+"GHz\n+ Núcleos: "+data.cores+"```";
                    if (EmbedMessage) { 
                        EmbedMessage.edit(embed)
                    }
            })
            await System.GetCPUTemp().then((data)=>{
                embed.fields[0].value = embed.fields[0].value.slice(0,embed.fields[0].value.length-3)+"\n+ Temperatura: "+(data.main===-1?"Error":data.main+"º")+"```";
                if (EmbedMessage) { 
                    EmbedMessage.edit(embed)
                }
            })
            await System.GetMemoryAmount().then((data)=>{
                embed.fields[1].value = "```diff\n+ Total: "+Math.floor((data.total/1000000000))+"GB\n+ Livre: "+Math.floor((data.free/1000000000))+"GB\n+ Usado: "+Math.floor((data.used/1000000000))+"GB```"
                if (EmbedMessage) { 
                    EmbedMessage.edit(embed)
                }
            })
            await System.GetGPUModel().then((data)=>{
                if (data[0]) {
                    data = data[0];
                    embed.fields[2].value = "```diff\n+ "+data.model+"\n+ VRam: "+data.vram+"mb\n+ VRam Dinamica: "+(data.vramDynamic?"Sim":"Não")+"```";
                } else {
                    embed.fields[2].value = "```diff\n+ Nenhuma placa de vídeo foi encontrada!```";
                }
                if (EmbedMessage) { 
                    EmbedMessage.edit(embed)
                }
            })
            await System.GetOSData().then((data)=>{
                embed.fields[3].value = "```diff\n+ "+data.distro+"\n+ Arquitetura: "+data.arch+"```";
                if (EmbedMessage) { 
                    EmbedMessage.edit(embed)
                }
            })
        })
    }
}