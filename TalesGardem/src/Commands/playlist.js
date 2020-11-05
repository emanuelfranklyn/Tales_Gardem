var dt = require('../Controllers/GetData')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const path = require("path")
const DataName = "YTMusicSystemCacheData"
const cvs = require("canvas")

function roundedsquare (ctx, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    return ctx;
  }

module.exports = {
    //Base help
    Help: "Mostra a playlist atual do bot",
    Usage: "playlist",
    Topic: "media",
    Thumbnail: "https://i.imgur.com/w7lHdkr.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        let guild = msg.guild.id
        if (!dt.GuildsCacheExistsCache(guild)) {
            //if do not exists any cache of the server
            return msg.reply("This server dont have any cache")
        }
        if (!dt.GuildsCacheExistsData(guild, DataName)) {
            //if do not exists playlist
            return msg.reply("This server never have a music playlist")
        }
        let Datanewer = dt.GuildsCacheGetData(guild, DataName)
        if (!Datanewer.queue[0]) {
            //if do not exists playlist
            return msg.reply("No one music is playing right now ...")
        }
        try {
            cvs.registerFont("/usr/src/app/PiratesOfCydonia-6wpM.ttf", { family: "pirates of cydonia" })
        } catch {
            cvs.registerFont("PiratesOfCydonia-6wpM.ttf", { family: "pirates of cydonia" })
        }
        var Waiting = msg.channel.send(`${Client.emojis.cache.find(emoji => emoji.name === "TalesGardemSpaceIntLoadingGif1")} `)
        let currentTime = Datanewer.queue[0].start-Date.now()
        currentTime = currentTime*-1
        let secounds = new Date(currentTime).getSeconds().toString()
        if (Datanewer.queue[0].playtimestamp === 0) {
            if (new Date(currentTime).getSeconds() < 10 ) {
                secounds = "0"+secounds
            }
            Datanewer.queue[0].playtimestamp = new Date(currentTime).getMinutes()+":"+secounds
        } else if (Datanewer.queue[0].playtimestamp === 1) {
            if (Datanewer.queue[0].status == 1) {
                let gg = Datanewer.queue[0].playtimestamp.split(":")
                if (new Date(currentTime).getSeconds()+Number(gg[1]) < 10 ) {
                    secounds = "0"+(Number(gg[1])).toString()
                } else {
                    secounds = (Number(gg[1])).toString()   
                }
                Datanewer.queue[0].playtimestamp = new Date(currentTime).getMinutes()+":"+secounds
                status = "pausado"
            } else if (Datanewer.queue[0].status == 0) {
                let gg = Datanewer.queue[0].playtimestamp.split(":")
                if (new Date(currentTime).getSeconds()+Number(gg[1]) < 10 ) {
                    secounds = "0"+(Number(secounds)+Number(gg[1])).toString()
                } else {
                    secounds = (Number(secounds)+Number(gg[1])).toString()   
                }
                Datanewer.queue[0].playtimestamp = new Date(currentTime).getMinutes()+Number(gg[0])+":"+secounds
                status = "tocando"
            } else if (Datanewer.queue[0].status == 2){
                Datanewer.queue[0].playtimestamp = "0:00"
                status = "carregando"
            }
        } else if (Datanewer.queue[0].playtimestamp === 2) {
            Datanewer.queue[0].playtimestamp = "0:00"
            status = "carregando"
        }
        let jj = Datanewer.queue[0].playtimestamp.split(":")
        let ff = Datanewer.queue[0].size.split(":")
        if (jj[1] > 59) {
            if (Number(jj[1])-60 < 10) {
                jj[1] = "0"+(Number(jj[1])-60).toString()
            } else {
                jj[1] = Number(jj[1])-60
            }
            jj[0] = Number(jj[0])+1
        }
        ff[0] = Number(ff[0])
        ff[1] = Number(ff[1])
        if (jj[0] > ff[0] || (jj[0] === ff[0] && jj[1]> ff[0])) {
            Datanewer.queue[0].playtimestamp = Datanewer.queue[0].size
        } else {
            Datanewer.queue[0].playtimestamp = jj[0]+":"+jj[1]
        }

        const canvas = cvs.createCanvas(1080 , 1500 )
        const ctx = canvas.getContext('2d')
        console.log(__dirname)
        const Background = await cvs.loadImage(dt.GetLocalImage("PlaylistBackGround.png"));
        const avatar = await cvs.loadImage(Datanewer.queue[0].thumb);
        const verifyed = await cvs.loadImage(dt.GetLocalImage("verifiedicon.png"));
        const ItemBackground = await cvs.loadImage(dt.GetLocalImage("PlaylistItem.png"));
        
        ctx.save();      
        ctx.drawImage(Background, 0, 0, 1080 , 1500 );
                    
        let fontSize2 = 200;
        do {
            ctx.font = `${fontSize2 -= 5}px pirates of cydonia`;
        } while (ctx.measureText(Datanewer.queue[0].title).width > canvas.width / (1.5));

        ctx.textAlign = 'start'
        ctx.fillStyle = '#ffffff';

        ctx.fillText(Datanewer.queue[0].title, 315, 125);
                    
        ctx.font = `45px pirates of cydonia`;

        ctx.fillText(Datanewer.queue[0].author, 315, 185);
        
        if (Datanewer.queue[0].verified === true) {
            ctx.drawImage(verifyed, 310+ctx.measureText(Datanewer.queue[0].author).width+10, 155, 40,40);
        }
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(160, 160, 130, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(avatar, -80, 20, 246*2, 138*2);

        ctx.restore();
        
        roundedsquare(ctx,350+ctx.measureText(Datanewer.queue[0].playtimestamp.toString()).width,230,(canvas.width -(472+ctx.measureText(Datanewer.queue[0].playtimestamp.toString()).width))-ctx.measureText(Datanewer.queue[0].size).width,30,25)
        
        ctx.strokeStyle ="#888888" 
        ctx.stroke();
        ctx.fillStyle="#68009c" 
        ctx.globalAlpha = 0.25;
        ctx.fill()
        ctx.globalAlpha = 1;
        
        ctx.restore();
        ctx.globalAlpha = 1;

        let fulltime = Number(Datanewer.queue[0].size.split(":").join(""))
        let currentTimer = Number(Datanewer.queue[0].playtimestamp.toString().split(":").join(""))
        if (currentTimer === fulltime) {
            currentTimer = 0;
            Datanewer.queue[0].playtimestamp = "0:00";
        }
        let barpercentinpixels = (((canvas.width -(330+ctx.measureText(Datanewer.queue[0].playtimestamp.toString()).width))-ctx.measureText(Datanewer.queue[0].size).width)*currentTimer)/(fulltime*1.50);
        
        roundedsquare(ctx,400+ctx.measureText(Datanewer.queue[0].playtimestamp.toString()).width,230,barpercentinpixels,30,25)
        
        ctx.fillStyle="#ffbe3b" 
        ctx.fill()
        
        ctx.restore();
        
        ctx.fillStyle="#ffffff" 
        ctx.textAlign = 'start'
        ctx.font = `45px pirates of cydonia`;
        ctx.fillText(Datanewer.queue[0].playtimestamp.toString(), 250+ctx.measureText(Datanewer.queue[0].playtimestamp.toString()).width, 260);
        ctx.fillText(Datanewer.queue[0].size.toString(), 860+ctx.measureText(Datanewer.queue[0].playtimestamp.toString()).width, 260);

        let DataSNewer = Datanewer;
        DataSNewer.queue.shift()

        //Print Page number
        let ActualPageNumber = 0;
        let TotalPageNumber = Math.floor((DataSNewer.queue.length/4)+0.9);
        ctx.fillStyle="#ffffff" 
        ctx.textAlign = 'start'
        ctx.font = `25px pirates of cydonia`;
        ctx.fillText((ActualPageNumber+1).toString()+"   de   "+TotalPageNumber.toString(), 265, 1443)

        fontSize4 = 37;
        //Early exit
        if(DataSNewer.queue.length === 0) {
            ctx.restore();
            ctx.globalAlpha = 0.50;
            ctx.fillStyle = '#ffffff';
            ctx.save();
            ctx.textAlign = 'center'
            ctx.font = `70px pirates of cydonia`;
            ctx.fillText("A playlist está vazia!", 530, 420);

            var attachment = new MessageAttachment(canvas.toBuffer(), 'PlayList.png')
            msg.channel.send(attachment)
            Promise.resolve(Waiting).then(function(value) {
                value.delete()
            })
        }
            
        await DataSNewer.queue.forEach(async (element, index, array)=>{
            if (index > 3) {
                return
            }
            ctx.restore();
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 1;
            ctx.save();
            ctx.drawImage(ItemBackground, 20, 320+(index*270), 1012 , 255 );
            ctx.textAlign = 'start'
            ctx.font = `${fontSize4}px pirates of cydonia`;
            ctx.fillText(element.title, 380, 400+(index*270));
            ctx.font = `${fontSize4-5}px pirates of cydonia`;
            ctx.fillText(element.author, 380, 450+(index*270));
            ctx.textAlign = 'center'
            ctx.font = `70px pirates of cydonia`;
            ctx.fillText(index+1, 45, 470+(index*270));
            if (element.verified === true) {
                ctx.drawImage(verifyed, (ctx.measureText(element.author).width/2)+370, 427+(index*270), 25,25);
            }
            let viws = Number(element.views)
            if (viws > 999999999) {
                //bilhão
                if (Math.round((viws/1000000000)) > 1) {
                    element.views = (Math.round(viws/1000000000)).toString()+" Bilhões"
                }else {
                    element.views = "1 Bilhão"
                }
            } else if (viws > 999999) {
                //milhão
                if (Math.round((viws/1000000)) > 1) {
                    element.views = (Math.round(viws/1000000)).toString()+" Milhões"
                }else {
                    element.views = "1 Milhão"
                }
            } else if (viws > 999) {
                //mil
                if (Math.round((viws/1000)) > 1) {
                    element.views = (Math.round(viws/1000)).toString()+" Mil"
                }
            }
            ctx.textAlign = 'start'
            ctx.font = `${fontSize4-5}px pirates of cydonia`;
            ctx.fillText(element.views+" de visualizações    |    "+element.size+" Minutos", 380, 500+(index*270));
            ctx.beginPath();
            ctx.arc(233.5, 448, 110, 0, Math.PI * 2, true);
            ctx.arc(233.5, 718, 110, 0, Math.PI * 2, true);
            ctx.arc(233.5, 987, 110, 0, Math.PI * 2, true);
            ctx.arc(233.5, 1257, 110, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            await ctx.drawImage(await cvs.loadImage(element.thumb), 40, 330+(index*270), 246*1.75, 138*1.75)
            if(index === 3 || (DataSNewer.queue.length < 4 && index === DataSNewer.queue.length-1)) {
                var attachment = new MessageAttachment(canvas.toBuffer(), 'PlayList.png')
                msg.channel.send(attachment)
                Promise.resolve(Waiting).then(function(value) {
                    value.delete()
                })
            }
        })
    }
}