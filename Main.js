const Discord = require('discord.js');
const client = new Discord.Client();
const Configs = require('./Configs');
const Hub = require('./src/hub');
const DisHel = require('./src/Controllers/DiscordHelper')
const fs = require('fs');

client.on('ready', () => {
  DisHel.Log(client,"Log cleaned")
  DisHel.Log(client,`${client.user.tag} inicialisado e operando!`);
});
client.on('message', async msg => {
  var message = msg.toString().toLowerCase().slice(2, msg.toString().length);
  if (msg.toString().toLowerCase().slice(0,2) === Configs.Prefix) {
    //Have the prefix the user want to do some thing!
    var Waiting = msg.channel.send(client.emojis.find(emoji => emoji.name === "TalesGardemSpaceIntLoadingGif1")+"")
    await Hub.ResolveCommand(client, msg, message).then(() => {
      Promise.resolve(Waiting).then(function(value) {
        value.delete()
      }).catch(() => {
        DisHel.Log(client,"Erro: Não foi possivel deletar: Main.js: value.delete()")
      })
    }).catch((e) => {
      DisHel.Log(client,"Erro: Não foi possivel esperar: Main.js: await Hub.ResolveCommand(client, msg, message)   |  "+e)
    });
  }
});

client.on('reconnecting', () => {
  console.log('R E C O N E C T A N D O!');
});
client.on('disconnect', () => {
  console.log('desconectado ;-;');
});

client.login(Configs.BotToken);