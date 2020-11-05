const path = require('path');
const { MessageEmbed } = require('discord.js')
const Similar = require('string-similarity')
const GetData = require('./Controllers/GetData');
const Configs = GetData.GetConfigs();
const DisHel = require('./Controllers/DiscordHelper')
const fs = require('fs')
var Commands = [];

async function RunComand(commandName,msg,args,spacebar) {
    spacebar = spacebar ||false;
    var TheCommand = require('./Commands/'+commandName);
    if ((TheCommand.NeedArguments == false && spacebar===true) || (spacebar===false)) {
        await TheCommand.Main(msg, args).catch((e) => {
            typeof(args)===typeof("String")?ErrorText=args:ErrorText=args.join(" ")
            let ErrorMessage = "";
            if (typeof e === 'object') {
                if (e.message) {
                    ErrorMessage = "Error Message: \n-------\n"+e.message;
                }
                if (e.stack) {
                    ErrorMessage = "Error Stack: \n-------\n"+e.stack;
                }
            } else {
                ErrorMessage = 'Error detected: No data founded!';
            }
            const embed = new MessageEmbed()
                .setTitle('Ocorreu um erro inesperado!')
                .setColor(0xFF0000)
                .setThumbnail("https://media.tenor.com/images/71656fc182ad63d50fbcd7c5496aa09d/tenor.gif")
                .setDescription("Um erro ocorreu na tentativa de executar o comando `"+ commandName+'`\n```javascript\n'+ErrorText+'``````javascript\n'+ErrorMessage+"```");
            msg.channel.send(embed)
            var OwnerCaller = "";
            Configs.TGBotAuthorID.forEach(element=>{
                OwnerCaller = OwnerCaller+"<@"+element+"> ";
            })
            DisHel.Log(OwnerCaller+"| Um erro ocorreu na tentativa de executar o comando `"+ commandName+'`\n```javascript\n'+ErrorText+'``````javascript\n'+ErrorMessage+'```')
        });
    }
    if (TheCommand.NeedArguments == true && spacebar===true) {
        const embed = new MessageEmbed()
            .setTitle('Sobre o comando: '+args)
            .setColor(0x222222)
            .setDescription('Sobre: `'+TheCommand.Help+"`\n"+"Como usar: `"+Configs.TGShowedPrefix+TheCommand.Usage+'`');
        msg.channel.send(embed);
    }
}
async function NotFounded(msg, args, GetBest, spacebar) {
    const embed = new MessageEmbed()
        .setTitle('Não encontrado: '+args[0])
        .setColor(0xFFFFFF)
        .setThumbnail("https://iabs.org.br/wp-content/uploads/2015/08/404-animation-1.gif")
        .setDescription('Não foi encontrado nenhum comando chamado: '+'`'+(typeof(args)==="string"?args:args[0])+'`'+"\n"+"Você queria dizer: "+'`'+GetBest.bestMatch.target+'`'+" ?");
    msg.channel.send(embed).then(async (message) =>{
        message.react('✅')
        //.then(() => message.react(Client.emojis.find(emoji => emoji.name === "LoadingGif1") ))
        .then(() => message.react("❌"));
        DisHel.ReactionController(message, async (reaction, reactionCollector) => {
	        if (reaction.emoji.name == "✅") {
                message.delete()
                RunComand(GetBest.bestMatch.target, msg, args, spacebar)
            } else if (reaction.emoji.name == "❌") {
                message.reactions.removeAll()
            }
        }, msg);              
    }).catch(() => {
        msg.channel.send("ERROR")
    });
}

module.exports = {
    ResolveCommand: async (msg, message) => {
        Commands = GetData.GetCommands();
        let Variables = {};
        if (GetData.GuildsCacheExistsCache(msg.guild.id)) {
            if (GetData.GuildsCacheExistsData(msg.guild.id, "SimilarConfig")) {
                Variables = GetData.GuildsCacheGetData(msg.guild.id, "SimilarConfig")
            } else {
                Variables.enabled = false
            }
        } else {
            Variables.enabled = false
        }
        if (message.includes(' ') === true) {
            var args = message.split(' ');
            var commandName = args[0];
            if (Commands.find(element => element == commandName)) {
                RunComand(commandName, msg, args);
            } else {
                var GetBest = Similar.findBestMatch(args[0], Commands)
                if (GetBest.bestMatch.rating > 0.3 && Variables.enabled === true) {
                    NotFounded(msg, args, GetBest)
                }
            }
        } else {
            //Theres no space bar!, try find a command name and return they help with a beautiful formation!
            if (Commands.find(element => element == message)) {
                var GetAboutCommand = require('./Commands/'+message);
                if (GetAboutCommand.NeedArguments === false) {
                    RunComand(message, msg, message);
                } else {
                    const embed = new MessageEmbed()
                        .setTitle('Sobre o comando: '+message)
                        .setColor(0x222222)
                        .setDescription('Sobre: `'+GetAboutCommand.Help+"`\n"+"Como usar: `"+Configs.TGShowedPrefix+GetAboutCommand.Usage+'`');
                    msg.channel.send(embed);
                }
            } else {
                var GetBest = Similar.findBestMatch(message, Commands)
                if (GetBest.bestMatch.rating > 0.3 && Variables.enabled === true) {
                    NotFounded(msg, message, GetBest, true)
                }
            }
        }
    },
}