var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const fs = require("fs")

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

module.exports = {
    //Base help
    Help: "Monitora quem está em um canal de voz e cria um registro em tempo real",
    Usage: "monivoz",
    Topic: "media",
    Thumbnail: "https://icons-for-free.com/iconfiles/png/512/Record-1320568044528108890.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        const voiceChannel = msg.member.voice.channel
        if (!voiceChannel) {
            return msg.reply("Você precisa estar em um canal de voz para usar esse comando")
        }
        let Connectedmembers = []
        let Totalmembers = []
        const embed = new MessageEmbed()
            .setTitle('Monitorando canal de voz: '+voiceChannel.name)
            .setColor(0x99FF99)
            .setDescription("Total de pessoas conectadas em "+voiceChannel.name+":\n"+"\nPessoas connectadas nesse momento em "+voiceChannel.name+":\n");
        let ConnectedPeopleMessage = await msg.channel.send(embed)
        ConnectedPeopleMessage.react("🛑")
        voiceHandler()
        Client.on('voiceStateUpdate', voiceHandler)
        async function voiceHandler() {   
            let connectedPeople = voiceChannel.members
            Connectedmembers = []
            connectedPeople.forEach(use => {
                if (!use.nickname) {
                    use.nickname = use.user.username
                }
                if (!Connectedmembers.includes(use.nickname)) {
                    Connectedmembers.push(use.nickname)
                }
                if (!Totalmembers.includes(use.nickname)) {
                    if (Totalmembers.includes(use.user.username)) {
                        Totalmembers.remove(use.user.username)
                    } 
                    Totalmembers.push(use.nickname)
                }
            })
            const filter = (reaction, user) => {
                return user.id === msg.author.id;
            };
            const collector3 = ConnectedPeopleMessage.createReactionCollector(filter, { time: 600000000})
            collector3.on('collect', async (reaction, reactionCollector) => {
                if (reaction.emoji.name == "🛑") {
                    Client.removeListener('voiceStateUpdate', voiceHandler)
                }
            })
            embed.setDescription("Total de pessoas conectadas em "+voiceChannel.name+":\n`"+Totalmembers.join("\n")+"`\nPessoas connectadas nesse momento em "+voiceChannel.name+":\n`"+Connectedmembers.join("\n")+"`")
            await ConnectedPeopleMessage.edit(embed)
        }
    }
}