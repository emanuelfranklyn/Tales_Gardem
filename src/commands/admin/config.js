const Configs = global.TalesGardem.Discord.Configs;
const { ShardParser: Database } = require('mysql.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Languager = require(path.resolve(__dirname, '..','..','controllers','languages', 'languageParser'));
// var Client

function loader() {
    // Client = global.TalesGardem.Discord.Client;
}

// Msg, args, language, [...]
const configs = {
    topics: [{
        name: 'language',
        properties: [{
            name: 'set',
            needArguments: true,
            run: (Msg, args) => {
                return Database.Add('Guild' + Msg.guild.id, 'Language', args[2]);
            },
            fallback: async (Msg, language) => {
                var AllLangs = [];
                await fs.readdirSync(path.resolve(__dirname, '..', '..', 'controllers', 'languages')).forEach(async (languages) => {
                    if (languages.endsWith('.json')) {
                        var languageFileName = languages.slice(0, languages.length - 5);
                        AllLangs.push(languageFileName);
                    }
                });
                var fallbackEMsg = new MessageEmbed()
                    .setTitle(language.Message.ListOfTopics + ':')
                    .setDescription(language.Message.TheTopicsList + ':\n```' + AllLangs.join(',') + '```');
                Msg.channel.send(fallbackEMsg);
            },
        }, 
        {
            name: 'reset',
            needArguments: false,
            run: (Msg) => {
                return Database.Add('Guild' + Msg.guild.id, 'Language', Configs.DefaultLang);
            }
        }]
    }],
};

module.exports = {
    Desc: 'Define the settings of ' + Configs.BotName + ' on the guild',
    Usage: 'config [NameOfCategory [...]] or (Categories)',
    NeedArguments: true,
    Main: (Msg, language, args) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            loader();
            var resolved = false;
            await fs.readdirSync(path.resolve(__dirname, '..', '..', 'controllers', 'languages')).forEach(async (languages) => {
                if (languages.endsWith('.json')) {
                    var languageFileName = languages.slice(0, languages.length - 5);
                    language = await Languager(languageFileName);
                    if (args[0].toString().toLowerCase() === language.CommandWords.config.categories) {
                        return resolved = languageFileName;
                    }
                }
            });
            if (!resolved) {language = await Languager(Configs.DefaultLang);} else {language = await Languager(resolved);}
            // eslint-disable-next-line max-len
            if (args[0].toString().toLowerCase() === language.CommandWords.config.categories || !configs.topics.find(topic => topic.name === args[0].toString().toLowerCase())) {
                var configsTopicsNames = [];
                configs.topics.forEach((topic) => {
                    configsTopicsNames.push(topic.name);
                });
                var AllCategories = new MessageEmbed()
                    .setTitle(language.Message.ListOfConfigs + ':')
                    .setDescription(language.Message.TheConfigsList + ':\n```' + configsTopicsNames.join(',') + '```');
                Msg.channel.send(AllCategories);
                resolved = true;
                resolve();
            }
            // Execute actions
            if (configs.topics.find(topic => topic.name === args[0].toString().toLowerCase())) {
                var topic = configs.topics.find(topic => topic.name === args[0].toString().toLowerCase());
                if (args[1] && topic.properties.find(propertie => propertie.name === args[1].toString().toLowerCase())) {
                    var prop = topic.properties.find(propertie => propertie.name === args[1].toString().toLowerCase());
                    var WorkedMessage = new MessageEmbed()
                        .setTitle(language.Message.sucessfullRunnedCommand)
                        .setDescription(language.Message.sucessfullRunnedCommandLong);
                    if (args[2] && typeof args[2] === 'string' && prop.needArguments) {
                        prop.run(Msg, args).catch(e => {reject(e);});
                        Msg.channel.send(WorkedMessage);
                        resolved = true;
                        resolve();
                    } else if (!prop.needArguments) {
                        prop.run(Msg).catch(e => {reject(e);});
                        Msg.channel.send(WorkedMessage);
                        resolved = true;
                        resolve();
                    } else if (prop.needArguments && prop.fallback) {
                        prop.fallback(Msg, language);
                        resolved = true;
                        resolve();
                    } else {
                        reject({title: 'Unkown failed, you shouldn\'t receive this, sorry about that ;-;', github: false });
                    }
                } else {
                    var propsName = [];
                    topic.properties.forEach((prop) => {
                        propsName.push(prop.name);
                    });
                    var allTopics = new MessageEmbed()
                        .setTitle(language.Message.ListOfTopics + ':')
                        .setDescription(language.Message.TheTopicsList + ':\n```' + propsName.join(',') + '```');
                    Msg.channel.send(allTopics);
                    resolved = true;
                    resolve();
                }
            }
        });
    }
};