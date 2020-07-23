const path = require('path');
const { MessageEmbed } = require('discord.js')
const Similar = require('string-similarity')
const Configs = require('../Configs');
const GetData = require('./Controllers/GetData');
const DisHel = require('./Controllers/DiscordHelper')
const fs = require('fs')
var Commands = [];


module.exports = {

    ResolveCommand: async (Client, msg, message) => {
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
            if (Commands.find(element => element == args[0])) {
                var TheCommand = require('./Commands/'+args[0]);
                await TheCommand.Main(Client, msg, args).catch((e) => {
                    const embed = new MessageEmbed()
                        .setTitle('Ocorreu um erro inesperado!')
                        .setColor(0xFF0000)
                        .setThumbnail("https://media.tenor.com/images/71656fc182ad63d50fbcd7c5496aa09d/tenor.gif")
                        .setDescription("Um erro ocorreu na tentativa de executar o comando `"+ args[0]+'`\n'+e);
                    msg.channel.send(embed)
                    DisHel.Log(Client,"Um erro ocorreu na tentativa de executar o comando `"+ args[0]+'`')
                });
            } else {
                var GetBest = Similar.findBestMatch(args[0], Commands)
                if (GetBest.bestMatch.rating > 0.7 && Variables.enabled === true) {
                    const embed = new MessageEmbed()
                        .setTitle('Não encontrado: '+args[0])
                        .setColor(0xFFFFFF)
                        .setThumbnail("https://iabs.org.br/wp-content/uploads/2015/08/404-animation-1.gif")
                        .setDescription('Não foi encontrado nenhum comando chamado: '+'`'+args[0]+'`'+"\n"+"Você queria dizer: "+'`'+GetBest.bestMatch.target+'`'+" ?");
                    msg.channel.send(embed).then(async (message) =>{
                        message.react('✅')
                        //.then(() => message.react(Client.emojis.find(emoji => emoji.name === "LoadingGif1") ))
                        .then(() => message.react("❌"));
                        const filter = (reaction, user) => {
                            return user.id === msg.author.id;
                        };
                        
                        const collector = message.createReactionCollector(filter, { time: 60000 });

                        collector.on('collect', async (reaction, reactionCollector) => {
	                        if (reaction.emoji.name == "✅") {
                                message.delete()
                                var TheCommand = require('./Commands/'+GetBest.bestMatch.target);
                                await TheCommand.Main(Client, msg, args).catch((e) => {
                                    const embed = new MessageEmbed()
                                        .setTitle('Ocorreu um erro inesperado!')
                                        .setColor(0xFF0000)
                                        .setThumbnail("https://media.tenor.com/images/71656fc182ad63d50fbcd7c5496aa09d/tenor.gif")
                                        .setDescription("Um erro ocorreu na tentativa de executar o comando `"+ args[0]+'`\n'+e);
                                    msg.channel.send(embed)
                                });
                            } else if (reaction.emoji.name == "❌") {
                                message.reactions.removeAll()
                            }
                        });
                        
                    }).catch(() => {
                        msg.channel.send("ERROR")
                    });
                }
            }
        } else {
            //Theres no space bar!, try find a command name and return they help with a beautiful formation!
            if (Commands.find(element => element == message)) {
                var GetAboutCommand = require('./Commands/'+message);
                if (GetAboutCommand.NeedArguments === false) {
                        await GetAboutCommand.Main(Client, msg, message).catch((e) => {
                            const embed = new MessageEmbed()
                                .setTitle('Ocorreu um erro inesperado!')
                                .setColor(0xFF0000)
                                .setThumbnail("https://media.tenor.com/images/71656fc182ad63d50fbcd7c5496aa09d/tenor.gif")
                                .setDescription("Um erro ocorreu na tentativa de executar o comando `"+ message+'`\n'+e);
                            msg.channel.send(embed)
                        });
                } else {
                    const embed = new MessageEmbed()
                        .setTitle('Sobre o comando: '+message)
                        .setColor(0x222222)
                        .setDescription('Sobre: `'+GetAboutCommand.Help+"`\n"+"Como usar: `"+Configs.ShowedPrefix+GetAboutCommand.Usage+'`');
                    msg.channel.send(embed);
                }
            } else {
                var GetBest = Similar.findBestMatch(message, Commands)
                if (GetBest.bestMatch.rating > 0.7 && Variables.enabled === true) {
                    const embed = new MessageEmbed()
                        .setTitle('Não encontrado: '+message)
                        .setColor(0xFFFFFF)
                        .setThumbnail("https://iabs.org.br/wp-content/uploads/2015/08/404-animation-1.gif")
                        .setDescription('Não foi encontrado nenhum comando chamado: '+'`'+message+'`'+"\n"+"Você queria dizer: "+'`'+GetBest.bestMatch.target+'`'+" ?");
                    msg.channel.send(embed).then(async function (message) {
                        message.react('✅')
                        //.then(() => message.react(Client.emojis.find(emoji => emoji.name === "LoadingGif1") ))
                        .then(() => message.react("❌"));
                        const filter = (reaction, user) => {
                            return user.id === msg.author.id;
                        };
                        
                        const collector = message.createReactionCollector(filter, { time: 60000 });

                        collector.on('collect', async (reaction, reactionCollector) => {
	                        if (reaction.emoji.name == "✅") {
                                message.delete()
                                var GetAboutCommand = require('./Commands/'+GetBest.bestMatch.target);
                                if (GetAboutCommand.NeedArguments == false) {
                                    await GetAboutCommand.Main(Client, msg, message).catch((e) => {
                                        const embed = new MessageEmbed()
                                            .setTitle('Ocorreu um erro inesperado!')
                                            .setColor(0xFF0000)
                                            .setThumbnail("https://media.tenor.com/images/71656fc182ad63d50fbcd7c5496aa09d/tenor.gif")
                                            .setDescription("Um erro ocorreu na tentativa de executar o comando `"+ args[0]+'`\n'+e);
                                        msg.channel.send(embed)
                                    });
                                } else {
                                    const embed = new MessageEmbed()
                                        .setTitle('Sobre o comando: '+message)
                                        .setColor(0x222222)
                                        .setDescription('Sobre: `'+GetAboutCommand.Help+"`\n"+"Como usar: `"+Configs.ShowedPrefix+GetAboutCommand.Usage+'`');
                                    msg.channel.send(embed);
                                }
                            } else if (reaction.emoji.name == "❌") {
                                message.reactions.removeAll()
                            }
                        });
                        
                    }).catch(function() {
                        msg.channel.send("ERROR")
                    });
                }
            }
        }
    },
}