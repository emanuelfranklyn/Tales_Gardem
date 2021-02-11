const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const { ShardParser: database } = require('mysql.js');
const Client = new Discord.Client();
const { command, commandCategory } = require('./schema');

class bot {
    constructor(options) {
        if (!options || (options && !options.configs)) {throw new Error('Tryed to create shard without options or configs');}
        this.configs = options.configs;

        // Variables
        this.DBConnected = false;
        if (options.commands && typeof(options.commands) !== 'object') {throw new Error('The commands param must be array');}
        this.commands = options.commands || [];

        // Static functions 
        this.messageParser = (Content) => {
            if (Content.MasterResponseId === 2001007) {
                this.DBConnected = Content.ConnectedWithDatabase;
                process.removeListener('message', this.messageParser);
            }
        };
        this.createCommand = (path, name, category) => {
            const commandLoaderClass = require(path);
            const commandLoaderConstructor = new commandLoaderClass({
                commands: this.commands,
                configs: this.configs,
            });
            const commandConstructor = new command({
                category: category,
                name: name,
                description: commandLoaderConstructor.description,
                usage: commandLoaderConstructor.needArgs ? commandLoaderConstructor.usage : name,
                needArguments: commandLoaderConstructor.needArgs,
                startFunction: (...data) => {return commandLoaderConstructor.main(data);},
            });
            return commandConstructor;
        };
    }

    start() {
        database.DefineClient(Client.shard);
        process.on('message', (content) => {this.messageParser(content);});

        // Load commands
        if (this.commands.length === 0) {
            this.commands.push(new commandCategory({name: this.configs.uncategorizedCategoryName}));
        }
        fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(categoryName => {
            if (categoryName.slice(0,-3) === '.js') {
                // Uncategorized command founded
                const uncategorizedCategory = this.commands.find(category => category.name === this.configs.uncategorizedCategoryName); 
                uncategorizedCategory.commands.push(
                    this.createCommand(path.resolve(__dirname, 'commands', categoryName), categoryName.slice(0,-3), uncategorizedCategory)
                );
            } else {
                const category = new commandCategory({
                    name: categoryName,
                });
                fs.readdirSync(path.resolve(__dirname, 'commands', categoryName)).forEach(command => {
                    category.commands.push(this.createCommand(path.resolve(__dirname, 'commands', categoryName, command), command.slice(0,-3), category));
                });
                this.commands.push(category);
            }
        });

        // Load events
        fs.readdirSync(path.resolve(__dirname, 'events')).forEach(eventName => {
            const eventConstructor = require(path.resolve(__dirname, 'events', eventName));
            const event = new eventConstructor({
                client: Client,
                configs: this.configs,
                commands: this.commands,
                DBConnected: this.DBConnected,
                db: database,
            });
            Client.on(eventName.slice(0,-3), (...data) => {if (data.length === 1) {event.run(data[0]);} else {event.run(data);}});
        });

        Client.login(process.env.DISCORD_TOKEN);
    }
}

module.exports = bot;