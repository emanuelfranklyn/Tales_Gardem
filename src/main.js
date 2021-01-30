const configs = JSON.parse(process.argv[2]);

const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const { ShardParser: Database } = require('mysql.js');
const Client = new Discord.Client();
var DBConnected = false;
Database.DefineClient(Client.shard);

Client.shard.send({
    MasterEval: true,
    EvalCommand: 'async function run() {return await DataBase.isConnected();} run()',
    Id: 2001007, 
});

function messageParser(Content) {
    if (Content.MasterResponseId === 2001007) {
        DBConnected = Content.ConnectedWithDatabase;
        process.removeListener('message', messageParser);
    }
}
process.on('message', messageParser);

function IsDbConnected() {
    return DBConnected;
}

const CommandsPath = path.resolve(__dirname, 'commands');
const commands = [];

fs.readdirSync(CommandsPath).forEach((Category) => {
    var Categorye = {
        name: Category,
        commands: []
    };
    fs.readdirSync(path.resolve(CommandsPath, Category)).forEach((Command) => {
        Command = Command.slice(0, Command.length - 3);
        var CommandLoaderC = require(path.resolve(CommandsPath, Category, Command));
        var CommandLoader = new CommandLoaderC({
            Client: Client,
            Configs: configs,
            DBConnected: IsDbConnected,
        }); 
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

const commands2 = [];

fs.readdirSync(CommandsPath).forEach((Category) => {
    var Categorye = {
        name: Category,
        commands: []
    };
    fs.readdirSync(path.resolve(CommandsPath, Category)).forEach((Command) => {
        Command = Command.slice(0, Command.length - 3);
        var CommandLoaderC = require(path.resolve(CommandsPath, Category, Command));
        var CommandLoader = new CommandLoaderC({
            Client: Client,
            Configs: configs,
            Commands: commands,
        }); 
        var CommandObj = {
            name: Command,
            Desc: CommandLoader.Desc,
            NeedArguments: CommandLoader.NeedArguments,
            Run: CommandLoader.Main,
        };
        CommandLoader.NeedArguments ? CommandObj.Usage = CommandLoader.Usage : CommandObj.Usage = CommandObj.name;  
        Categorye.commands.push(CommandObj);
    });
    commands2.push(Categorye);
});

const { message: messageClass, ready: readyClass, guildMemberAdd: guildMemberAddClass } = require('./controllers/events/index');

const ready = new readyClass({
    Configs: configs,
    Commands: commands2,
    Client: Client,
    DBConnected: IsDbConnected,
});

const guildMemberAdd = new guildMemberAddClass({
    Configs: configs,
    Commands: commands2,
    Client: Client,
    DBConnected: IsDbConnected,
});

const message = new messageClass({
    Configs: configs,
    Commands: commands2,
    Client: Client,
    DBConnected: IsDbConnected,
});

Client.on('ready', ready.parser);
Client.on('guildMemberAdd', guildMemberAdd.parser);
Client.on('message', message.parser);

Client.login(process.env.DISCORD_TOKEN);
