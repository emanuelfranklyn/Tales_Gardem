const path = require('path');
const fs = require('fs');
const LanguagerClass = require(path.resolve(__dirname, '..','languages', 'languageParser'));
const { MessageEmbed } = require('discord.js');
const { ShardParser: Database } = require('mysql.js');

var Configs;
var Commands;
var DBConnected;
var LanguagerClient;
var Languager;

class message {
    constructor(Data) {
        Configs = Data.Configs;
        Commands = Data.Commands;
        DBConnected = Data.DBConnected;
        LanguagerClient = new LanguagerClass({Configs: Configs});
        Languager = LanguagerClient.get;
    }

    async parser(Message) {
        if (Message.author.bot) {return;}
        var Msg = Message.toString().toLowerCase();
        var MsgStartsWithPrefix = false;
        var MsgPrefix = '';
        Configs.Prefixes.forEach((prefix) => {
            if (Msg.startsWith(prefix)) {
                MsgStartsWithPrefix = true;
                MsgPrefix = prefix;
            }
        });
        if (!MsgStartsWithPrefix) {return;}
        async function DBError(e) {
            if (typeof e === 'object') {
                var ErrorMessage = new MessageEmbed()
                    .setImage('attachment://error.gif')
                    .attachFiles([path.resolve(__dirname, '..','..','assets','images','error.gif')])
                    .setTitle('Error while running command!');
                if (!e.title) {
                    ErrorMessage.setDescription('**Error message:**\n```js\n' + e + '\n```');
                } else {
                    ErrorMessage.setDescription('**Error message:**\n```js\n' + e.title + '\n```');
                }
                if (e.github) {
                    ErrorMessage.setTitle('Error while running command, please report it to bot creator on github!');
                    // eslint-disable-next-line max-len
                    ErrorMessage.setURL(Configs.GithubAutomaticIssueLink + '&title=Error+while+running+command&body=%23+Automatic+Generated+Issue+%0D%0A+%23%23+Error+Code:+%0D%0A+```js+%0D%0A+' + encodeURI(e.title) + '+%0D%0A+```');
                }
            } else {
                ErrorMessage = new MessageEmbed()
                    .setTitle('Error while trying to get guild information, please report it to bot creator on github!')
                    .setImage('attachment://error.gif')
                    .setDescription('**Error message:**\n```js\n' + e + '\n```')
                    // eslint-disable-next-line max-len
                    .setURL(Configs.GithubAutomaticIssueLink + '&title=Error+while+trying+to+get+guild+information&body=%23+Automatic+Generated+Issue+%0D%0A+%23%23+Error+Code:+%0D%0A+```js+%0D%0A+' + encodeURI(e) + '+%0D%0A+```')
                    .attachFiles([path.resolve(__dirname, '..','..','assets','images','error.gif')]);
                if (e.toString() === 'No Response') {
                    ErrorMessage.setTitle('Database Offline!');
                    ErrorMessage.setURL('');
                    ErrorMessage.setDescription('**Error message:**\n```js\nThe database is offline, the bot is running in out of data!\n```');
                    var GuildLanguage = await Languager(Configs.DefaultLang);
                    var LoadingMessage = new MessageEmbed()
                        .setImage('attachment://loading.gif')
                        .setTitle(GuildLanguage.Message.WaitingCommandLoad)
                        .attachFiles([path.resolve(__dirname, '..','..','assets','images','loading.gif')]);
                    var LoadingErrorMessage = new MessageEmbed()
                        .setImage('attachment://loadingRed.gif')
                        .setTitle(GuildLanguage.Message.WaitingCommandLoadTooLong)
                        .attachFiles([path.resolve(__dirname, '..','..','assets','images','loadingRed.gif')]);
                    var LoaderMessage;
                    var LoaderMessageErr;
                    var LoadingMessageTO = setTimeout(()=>{Message.channel.send(LoadingMessage).then((data) => {LoaderMessage = data;});}, 500);
                    // eslint-disable-next-line max-len
                    var LoadingMessageErrorTO = setTimeout(()=>{Message.channel.send(LoadingErrorMessage).then((data) => {LoaderMessageErr = data;});clearTimeout(LoadingMessageTO);if (LoaderMessage) {LoaderMessage.delete();}}, 10000);
                    var Args = Msg.split(' ');
                    Args.shift();
                    CommandData.Run(Message, GuildLanguage, Args).finally(() => {
                        clearTimeout(LoadingMessageTO);
                        if (LoaderMessage) {LoaderMessage.delete();}
                        clearTimeout(LoadingMessageErrorTO);
                        if (LoaderMessageErr) {LoaderMessageErr.delete();}
                    }).catch((e) => {DBError(e);});
                }
            }
            Message.channel.send(ErrorMessage);
        }
        var CommandExists = false;
        var CommandData = {};
        await fs.readdirSync(path.resolve(__dirname, '..','languages',)).forEach(async (language) => {
            if (language.endsWith('.json')) {
                language = language.slice(0, language.length - 5);
                var GuildLanguage = await Languager(language);
                Commands.forEach((Category) => {
                    Category.commands.forEach((Command) =>{
                        if (GuildLanguage.Commands[Command.name.toLowerCase()] === Msg.split(' ')[0].slice(MsgPrefix.length)) {
                            CommandExists = true;
                            CommandData = Command;
                        }
                    });
                });
            }
        });
        if (!CommandExists) {return;}
        if (CommandData.NeedArguments && Msg.split(' ').length < 2) {
            Commands.forEach((Category) => {
                Category.commands.forEach((Command) => {
                    if (Command.name === Configs.DefaultCommand) {
                        var args = Msg.split(' ');
                        args[0] = args[0].slice(MsgPrefix.length);
                        Command.Run(Message, Languager(Configs.DefaultLang), args);
                    }
                });
            });
            return;
        }
        if (!DBConnected()) {
            DBError('No Response');
        } else {
            Database.SwitchTo(Configs.DatabaseName, true).then(() => {
            // eslint-disable-next-line max-len
                Database.Query('CREATE TABLE IF NOT EXISTS Guild' + Message.guild.id + ' (id int AUTO_INCREMENT NOT NULL primary key,KeyName VARCHAR(255), ValueContent VARCHAR(255))').then(() => {
                    Database.Get('Guild' + Message.guild.id).then(async (Data) => {
                        var GuildLanguage = Data.find(Config => Config.KeyName === 'Language');
                        if (!GuildLanguage) {
                            GuildLanguage = await Languager(Configs.DefaultLang);
                        } else {
                            GuildLanguage = await Languager(GuildLanguage.ValueContent);
                        }
                        var LoadingMessage = new MessageEmbed()
                            .setImage('attachment://loading.gif')
                            .setTitle(GuildLanguage.Message.WaitingCommandLoad)
                            .attachFiles([path.resolve(__dirname, '..','..','assets','images','loading.gif')]);
                        var LoadingErrorMessage = new MessageEmbed()
                            .setImage('attachment://loadingRed.gif')
                            .setTitle(GuildLanguage.Message.WaitingCommandLoadTooLong)
                            .attachFiles([path.resolve(__dirname, '..','..','assets','images','loadingRed.gif')]);
                        var LoaderMessage;
                        var LoaderMessageErr;
                        var LoadingMessageTO = setTimeout(()=>{Message.channel.send(LoadingMessage).then((data) => {LoaderMessage = data;});}, 500);
                        // eslint-disable-next-line max-len
                        var LoadingMessageErrorTO = setTimeout(()=>{Message.channel.send(LoadingErrorMessage).then((data) => {LoaderMessageErr = data;});clearTimeout(LoadingMessageTO);if (LoaderMessage) {LoaderMessage.delete();}}, 10000);
                        var Args = Msg.split(' ');
                        Args.shift();
                        CommandData.Run(Message, GuildLanguage, Args).finally(() => {
                            clearTimeout(LoadingMessageTO);
                            if (LoaderMessage) {LoaderMessage.delete();}
                            clearTimeout(LoadingMessageErrorTO);
                            if (LoaderMessageErr) {LoaderMessageErr.delete();}
                        }).catch((e) => {DBError(e);});
                    }).catch((e) => {DBError(e);});
                }).catch((e) => {DBError(e);});
            }).catch((e) => {DBError(e);});
        }
    }
}

module.exports = message;