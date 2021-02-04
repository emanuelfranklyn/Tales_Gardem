const Node_Env = process.env.NODE_ENV || 'development';
const Mysql = require('mysql.js');
const { ShardingManager } = require('discord.js');
const configs = require('./Configs.json');

Node_Env === 'production' ? false : configs.Prefixes = configs.DevPrefixes;

var DataBase = new Mysql.Client({
    Debug: Node_Env !== 'production',
});

const manager = new ShardingManager('./src/main.js', { 
    token: Node_Env === 'production' ? configs.Token : configs.DevToken,
    shardArgs: [JSON.stringify(configs)],
});

DataBase.Connect('localhost', 'root', 'password', 'mysql').then(() => {
    setInterval(() => {
        manager.broadcast({MasterResponseId: 2001007, ConnectedWithDatabase: true});    
    }, 15000);
});

manager.on('shardCreate', shard => {
    console.log('Shard Created!');
    shard.on('message', async (Content) => {
        if (Content.MasterEval === true) {
            eval(Content.EvalCommand).then((Results) => {
                shard.send(JSON.stringify({
                    MasterEvalResponse: true,
                    MasterEvalResponseId: Content.Id,
                    Response: Results,
                }));
            }).catch((e) => {
                shard.send(JSON.stringify({
                    MasterEvalResponse: true,
                    MasterEvalResponseId: Content.Id,
                    error: JSON.stringify(e.toString()),
                }));
            });
        }
    });
});

manager.spawn('auto');
