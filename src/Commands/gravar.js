var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const Configs = require('../../Configs');
const fs = require("fs")

//TODO:
////Resolve the resolver

module.exports = {
    //Base help
    Help: "Grava o audio individual de cada membro na chamada",
    Usage: "gravar (Opcional: #Canal de voz).",
    Topic: "media",
    Thumbnail: "https://icons-for-free.com/iconfiles/png/512/Record-1320568044528108890.png",
    NeedArguments: false,
    //Client = bot client
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (Client, msg, args) => {
        return msg.channel.send("Esse comando foi temporariamente desabilitado ainda incompleto devido `falta de infraestrutura`")
        try {
        msg.reply("Em Construção")
        const voiceChannel = msg.member.voice.channel
        if (!voiceChannel) {
            return msg.reply("Você precisa estar em um canal de voz para usar esse comando")
        }
        let Connectedmembers = []
        voiceHandler()
        Client.on('voiceStateUpdate', voiceHandler)
        async function voiceHandler() {   
            let connectedPeople = voiceChannel.members
            Connectedmembers = []
            connectedPeople.forEach(user => {
                user = user.user
                if (!Connectedmembers.includes(user.username+"#"+user.discriminator)) {
                    Connectedmembers.push(user.username+"#"+user.discriminator)
                }
            })
        }
        } catch (e) {
            console.log(e)
        }
    }
}