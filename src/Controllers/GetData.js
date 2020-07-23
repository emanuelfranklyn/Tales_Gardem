const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const CommandsPath = path.resolve('src','Commands')
const CachePath = path.resolve("..","TalesGardemCache","GuildsCache")
var Commands = [];

function doRequest(url) {
    try {
        return new Promise(function (resolve, reject) {
            request(url, 
                function (error, res, body) {
                    const $ = cheerio.load(body);
                    let diti = $('img')
                    if (diti) {
                        if (diti[1]) {
                            return resolve(diti[1].attribs.src)
                        } else {
                            return resolve("https://image.freepik.com/free-vector/error-404-found-glitch-effect_8024-5.jpg")
                        }
                    } else {
                        return resolve("https://image.freepik.com/free-vector/error-404-found-glitch-effect_8024-5.jpg")
                    }
                });
           });
    } catch (e) {
        return "https://image.freepik.com/free-vector/error-404-found-glitch-effect_8024-5.jpg";
    }
}

module.exports = {
    GetCommands: (topic) => {
        Commands = [];
        var data = fs.readdirSync(CommandsPath)
        for (var g = 0; g < data.length; g = g + 1) {
            var FileExtension = path.extname(data[g])
            var FileName = data[g].slice(0, data[g].length-FileExtension.length) 
            if (topic) {
                var GetInfo = require('../Commands/'+FileName)
                if (GetInfo.Topic == topic) {
                    Commands.push(FileName);
                }
            } else {
                Commands.push(FileName);
            }
        }
        return Commands;
    },
    GetCommandThumbnail: (Name) => {
        Commands = [];
        var data = fs.readdirSync(CommandsPath)
        for (var g = 0; g < data.length; g = g + 1) {
            var FileExtension = path.extname(data[g])
            var FileName = data[g].slice(0, data[g].length-FileExtension.length) 
            Commands.push(FileName);
        }
        if (Commands.find(element => element == Name)) {
            return require('../Commands/'+Name).Thumbnail
        } else {
            return false
        }
    },
    searchImage: async (query) => {
        try {
            return await doRequest("https://www.google.com.br/search?safe=active&tbm=isch&q="+query)
        } catch (e) {
            return("https://image.freepik.com/free-vector/error-404-found-glitch-effect_8024-5.jpg")
        }
    },
    GuildsCacheAddData: (GuildName, DataName, Data) => {
        const CDachePath = path.resolve(CachePath,GuildName,DataName+".json")
        fs.writeFileSync(CDachePath, JSON.stringify(Data), 'utf8')
    },
    GuildsCacheCreateCache: (GuildName) => {
        const PathToExamine = path.resolve(CachePath,GuildName)
        fs.mkdirSync(PathToExamine) 
    },
    GuildsCacheDeleteData: (GuildName, DataName) => {
        //TODO
    },
    GuildsCacheDeleteGuild: (GuildName) => {
        //TODO
    },
    GuildsCacheGetData: (GuildName, DataName) => {
        const PathToExamine = path.resolve(CachePath,GuildName,DataName+".json")
        return JSON.parse(fs.readFileSync(PathToExamine))
    },
    GuildsCacheExistsData: (GuildName, DataName) => {
        const PathToExamine = path.resolve(CachePath,GuildName,DataName+".json")
        return fs.existsSync(PathToExamine)
    },
    GuildsCacheExistsCache: (GuildName) => {
        const PathToExamine = path.resolve(CachePath,GuildName)
        return fs.existsSync(PathToExamine)
    }
}