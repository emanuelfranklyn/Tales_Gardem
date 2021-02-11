const configs = JSON.parse(process.argv[2]);

const botConstructor = require('./bot');
const bot = new botConstructor({
    configs: configs,
});

bot.start();
