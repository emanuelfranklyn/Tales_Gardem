const request = require('request');
const iso = require('iso-639-1');
const querystring = require("querystring");
const { MessageEmbed } = require('discord.js')

function translate(args, toLang) {
        args = querystring.escape(args);
        args = args.split("%0A").join("%20TGDNRGN%20")
        let fromlang = 'auto';
        let gurl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + fromlang + "&tl=" + toLang + "&dt=t&q=" + args;
        return new Promise(function (resolve, reject) {
        request(gurl, function(error, response, body) {
            try {
                let size = body.length/662
                let arrays = [];
                if (Math.round(size) < 1) {
                    size = 1
                } else {
                    size = Math.round(size);
                }
                body = '{"data":'+body+"}"
                translated = JSON.parse(body).data
                for (let a = 0; a<size; a++) {
                    if (translated[0]) {
                        translatede = translated[0][a][0]
                        arrays.push(translatede)
                    }
                }
                translated = arrays.join("")
                translated = translated.split("TGDNRGN").join("\n")
                return resolve(translated)
            } catch (err) {
                return resolve("`Error: `"+err+"\n")
            }
        });
    })
}

module.exports = {
    //Base help
    Help: "Traduz a mensagem para a lingua selecionada.",
    Usage: "traduzir <Lingua> <mensagem>",
    Topic: "utilities",
    Thumbnail: "https://www.pngrepo.com/download/217134/translate-language.png",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        args.shift()
        let language = args[0]
        language = iso.getCode(language) == '' ? language : iso.getCode(language);
        args.shift()
        args = args.join(" ")
        let result = await translate(args, language)
        let resulter = await translate("Disse: ", language)
        const embed = new MessageEmbed()
            .setTitle(await translate('Traduzindo para: ', language)+language)
            .setColor(0xfcba03)
            .setThumbnail("https://www.pngrepo.com/download/217134/translate-language.png")
            .setDescription(msg.author.username+"#"+msg.author.discriminator+" "+resulter+result)
        return msg.channel.send(embed)
    }
}