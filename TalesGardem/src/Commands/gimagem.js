var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')

module.exports = {
    //Base help
    Help: "Mostra o melhor resultado do google imagens para a pesquisa inserida.",
    Usage: "gimagem <argumentos>",
    Topic: "utilities",
    Thumbnail: "https://image.flaticon.com/icons/svg/1754/1754193.svg",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        args.shift()
        args = args.join(" ")
        let img = await Promise.resolve(data.searchImage(args))
        const embed = new MessageEmbed()
            .setTitle('Melhor resultado para: '+args)
            .setColor("random")
            .setImage(img)
        msg.channel.send(embed);
    }
}