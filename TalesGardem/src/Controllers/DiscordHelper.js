const Configs = require('../../../../Configs')

module.exports = {
    Log: (Message, DisableArrow) => {
        const channel = Client.channels.cache.get(Configs.TGLogChannel)
        var Arrow = DisableArrow?"":"<:ArrowRight:"+Client.emojis.cache.find(emoji => emoji.name === "ArrowRight")+">"
        channel.send(Arrow.toString()+Message.toString())
    },
    ReactionController(msg, Callback, authormsg, time) {
        time = time || 600000000;
        const filter = (reaction, user) => {
            return user.id === authormsg.author.id;
        };
        const collector = msg.createReactionCollector(filter, { time: time });
        collector.on('collect', Callback)
        return collector;
    },
    ReactionRemoveController(collector, Callback) {
        collector.removeListener('collect', Callback)
    }
}