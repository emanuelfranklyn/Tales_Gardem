const { MessageEmbed } = require('discord.js');
const path = require('path');
const LanguagerClass = require(path.resolve(__dirname, '..','..','languages', 'languageParser'));

class config {
    constructor(data) {
        this.configs = data.configs;
        this.description = 'Define the settings of ' + this.configs.BotName + ' on the guild';
        this.usage = 'config [NameOfCategory [...]] or (Categories)';
        this.needArgs = true;
        this.languagerClient = new LanguagerClass({configs: this.configs});
        this.languager = this.languagerClient.get;
        this.getAllLanguages = this.languagerClient.getAllLanguages;
        this.configurableConfigs = {
            topics: [{
                name: 'language',
                properties: [{
                    name: 'set',
                    needArguments: true,
                    run: async (Msg, _, args, database) => {
                        var allLangs = [];
                        await this.getAllLanguages().forEach(async (languages) => {
                            var languageFileName = languages.slice(0, languages.length - 5);
                            allLangs.push(languageFileName.toString().toLowerCase());
                        });
                        if (allLangs.includes(args[3])) {
                            return Promise.resolve(database.Add('Guild' + Msg.guild.id, 'Language', args[3]));
                        } else {
                            // eslint-disable-next-line max-len
                            return Promise.reject('Invalid input, try again parsing one of theses options: \n"' + allLangs.join(', ') + '"\n// If it doesn\'t work try reporting this bug on github.');
                        }
                    },
                    fallback: async (Msg, language) => {
                        var allLangs = [];
                        await this.getAllLanguages().forEach(async (languages) => {
                            var languageFileName = languages.slice(0, languages.length - 5);
                            allLangs.push(languageFileName);
                        });
                        var fallbackEMsg = new MessageEmbed()
                            .setTitle(language.message.listOfTopics + ':')
                            .setDescription(language.message.theTopicsList + ':\n```' + allLangs.join(',') + '```');
                        Msg.channel.send(fallbackEMsg);
                    },
                }, 
                {
                    name: 'reset',
                    needArguments: false,
                    run: (msg, database) => {
                        return Promise.resolve(database.Add('Guild' + msg.guild.id, 'Language', this.configs.defaultLang));
                    }
                }]
            }],
        };
    }

    main(params) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            var resolved = false;
            await this.getAllLanguages().forEach(async (languages) => {
                var languageFileName = languages.slice(0, languages.length - 5);
                params[1].language = await this.languager(languageFileName);
                if (params[1].command.toString().toLowerCase() === params[1].language.commandWords.config.categories) {
                    return resolved = languageFileName;
                }
            });
            if (!resolved) {params[1].language = await this.languager(this.configs.defaultLang);} else {params[1].language = await this.languager(resolved);}
            // eslint-disable-next-line max-len
            if (params[1].command.toString().toLowerCase() === params[1].language.commandWords.config.categories || !this.configurableConfigs.topics.find(topic => topic.name === params[1].args[1].toString().toLowerCase())) {
                var configsTopicsNames = [];
                this.configurableConfigs.topics.forEach((topic) => {
                    configsTopicsNames.push(topic.name);
                });
                var AllCategories = new MessageEmbed()
                    .setTitle(params[1].language.message.listOfConfigs + ':')
                    .setDescription(params[1].language.message.theConfigsList + ':\n```' + configsTopicsNames.join(',') + '```');
                params[0].channel.send(AllCategories);
                resolved = true;
                resolve();
            }
            // Execute actions
            if (this.configurableConfigs.topics.find(topic => topic.name === params[1].args[1].toString().toLowerCase())) {
                var topic = this.configurableConfigs.topics.find(topic => topic.name === params[1].args[1].toString().toLowerCase());
                if (params[1].args[2] && topic.properties.find(propertie => propertie.name === params[1].args[2].toString().toLowerCase())) {
                    var prop = topic.properties.find(propertie => propertie.name === params[1].args[2].toString().toLowerCase());
                    var WorkedMessage = new MessageEmbed()
                        .setTitle(params[1].language.message.sucessfullRunnedCommand)
                        .setDescription(params[1].language.message.sucessfullRunnedCommandLong);
                    if (params[1].args[3] && typeof params[1].args[3] === 'string' && prop.needArguments) {
                        prop.run(params[0], params[1].language, params[1].args, params[1].database).then(() => {
                            params[0].channel.send(WorkedMessage);
                            resolved = true;
                            resolve();
                        }).catch(reject);
                    } else if (!prop.needArguments) {
                        prop.run(params[0], params[1].database, params[1].language).then(() => {
                            params[0].channel.send(WorkedMessage);
                            resolved = true;
                            resolve();
                        }).catch(reject);
                    } else if (prop.needArguments && prop.fallback) {
                        prop.fallback(params[0], params[1].language);
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
                        .setTitle(params[1].language.message.listOfTopics + ':')
                        .setDescription(params[1].language.message.theTopicsList + ':\n```' + propsName.join(',') + '```');
                    params[0].channel.send(allTopics);
                    resolved = true;
                    resolve();
                }
            }
        });
    }
}

module.exports = config;