const Configs = require('../../Configs')

module.exports = {
    Log: (client, Message) => {
        const channel = client.channels.get(Configs.LogChannel)
        channel.send("`"+Date.now()+"` "+Message)
    }
}