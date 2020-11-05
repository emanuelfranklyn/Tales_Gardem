var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
const Configs = data.GetConfigs();
const { inspect } = require('util');

module.exports = {
    //Base help
    Help: "Executa o codigo javascript inserido. |Somente donos|",
    Usage: "eval <Codigo JavaScript>",
    Topic: "exclusive",
    Thumbnail: "https://image.flaticon.com/icons/png/512/919/919825.png",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        if (Configs.TGBotAuthorID.includes(msg.author.id)) {
            let evaled;
            args.shift()
            if (args.join(" ").toLocaleLowerCase().includes("token")) {return msg.channel.send("Nop")}
            evaled = await eval(args.join(' ')) || "No results"
            evaled = evaled.toString().split(Configs.BotToken).join(" I will not send my token! ")
            const embed = new MessageEmbed()
                .setTitle('Resultado do codigo JS:')
                .setColor(0xfcba03)
                .setThumbnail("https://image.flaticon.com/icons/png/512/919/919825.png")
                .addField("📤 Entrada:", "```javascript\n"+args+"```")
                .addField("🎛️ metadata:", "```javascript\n"+inspect(evaled).slice(0,1000)+"```")
                .addField("📥 Saida:", "```javascript\n"+evaled+"```")
            return msg.channel.send(embed)
        } else {
            msg.channel.send("Somente meus donos podem utilizar este comando!")
        }
    }
}