const Discord = require('discord.js');

const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const nextPageEmoji = '▶️';

class reactionI {
    constructor(param) {
        this.client = param.client;
        this.configs = param.configs;
    }

    numeralAsk(title, itens, message) {
        return new Promise((resolve) => {
            var page = 0;
            var description = '```';
            var thingsToReact = [];

            for (var i = 0; ((i < numbers.length) && (i < itens.length)); i++) {
            
                description += numbers[i] + ' | ' + itens[i].title + '\n';
                thingsToReact.push(numbers[i]);
            }

            if (itens.length > numbers.length) {
                thingsToReact.push(nextPageEmoji);
            }

            description += '```';

            var askMessage = new Discord.MessageEmbed()
                .setTitle(title + ':')
                .setDescription(description);
            message.channel.send(askMessage).then((data) => {
                thingsToReact.forEach(async emoji => {
                    await data.react(emoji);
                });
            
                this.client.on('messageReactionAdd', messageReactionHandler);

                async function messageReactionHandler (reaction) {
                    if (reaction.partial) {
                        try {
                            await reaction.fetch();
                        } catch (error) {
                            data.edit(
                                new Discord.MessageEmbed()
                                    .setTitle('An error occurred:')
                                    .setDescription(error)
                            );
                            return;
                        }
                    }
                    
                    if (reaction.users.cache.find(user => user.id === message.author.id) && reaction.message.id === data.id) {
                        var reactionText = reaction._emoji.name;

                        if (reactionText.toString() !== nextPageEmoji.toString()) {
                            this.removeListener('messageReactionAdd', messageReactionHandler);
                            var index = numbers.indexOf(reactionText.toString());
                            data.delete();
                            resolve(itens[index + (numbers.length * page)]);

                        } else {
                            // Next Page!
                            reaction.remove();
                            page += 1;
                            var description = '```';
                            var thingsToReact = [];
                            for (var i = 0; ((i < numbers.length) && (i < (itens.length - (numbers.length * page)))); i++) {
                                

                                description += numbers[i] + ' | ' + itens[i + (numbers.length * page)].title + '\n';
                                thingsToReact.push(numbers[i]);
                            }
                    
                            if (itens.length - (numbers.length * page) > numbers.length) {
                                thingsToReact.push(nextPageEmoji);
                            }
                    
                            description += '```';
                    
                            var askMessage = new Discord.MessageEmbed()
                                .setTitle(title + ':')
                                .setDescription(description);
                            data.edit(askMessage);
                        }
                    }
                }
            });
        });
    }
}

module.exports = reactionI;