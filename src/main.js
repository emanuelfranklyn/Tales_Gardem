global.TalesGardem = {
    Discord: {
        Configs: JSON.parse(process.argv[2]),
    },
};

const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const { ShardParser: Database } = require('mysql.js');
const Client = new Discord.Client();
global.TalesGardem.Discord.Client = Client;
Database.DefineClient(Client.shard);

const CommandsPath = path.resolve(__dirname, 'commands');
const commands = [];

fs.readdirSync(CommandsPath).forEach((Category) => {
    var Categorye = {
        name: Category,
        commands: []
    };
    fs.readdirSync(path.resolve(CommandsPath, Category)).forEach((Command) => {
        Command = Command.slice(0, Command.length - 3);
        var CommandLoader = require(path.resolve(CommandsPath, Category, Command));
        var CommandObj = {
            name: Command,
            Desc: CommandLoader.Desc,
            NeedArguments: CommandLoader.NeedArguments,
            Run: CommandLoader.Main,
        };
        CommandLoader.NeedArguments ? CommandObj.Usage = CommandLoader.Usage : CommandObj.Usage = CommandObj.name;  
        Categorye.commands.push(CommandObj);
    });
    commands.push(Categorye);
});

global.TalesGardem.Discord.Commands = commands;

const { message, ready, guildMemberAdd } = require('./controllers/events/index');

Client.on('ready', ready);
Client.on('guildMemberAdd', guildMemberAdd);
Client.on('message', message);

Client.login(process.env.DISCORD_TOKEN);
