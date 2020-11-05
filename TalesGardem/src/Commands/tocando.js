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
    Help: "Mostra a música em atual reprodução.",
    Usage: "tocando",
    Topic: "media",
    Thumbnail: "https://img.icons8.com/bubbles/2x/help.png",
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
        var Waiting = msg.channel.send(`${Client.emojis.cache.find(emoji => emoji.name === "TalesGardemSpaceIntLoadingGif1")} `)
        var status = "carregando";
        try {
            cvs.registerFont("/usr/src/app/PiratesOfCydonia-6wpM.ttf", { family: "pirates of cydonia" })
        } catch {
            cvs.registerFont("PiratesOfCydonia-6wpM.ttf", { family: "pirates of cydonia" })
        }
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
                        } else if (Datanewer.queue[0].status == 0){
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
                    //generate the image
            let shortdescls = Datanewer.queue[0].shortdesc.length/2
            let shortdescp1 = Datanewer.queue[0].shortdesc.slice(0, shortdescls)
            let shortdescp2 = Datanewer.queue[0].shortdesc.slice(shortdescls, Datanewer.queue[0].shortdesc.length)
            if (Datanewer.queue[0].status == 1) {
                status = "Pausado"
            } else if (Datanewer.queue[0].status == 0) {
                status = "Tocando"
            } else if (Datanewer.queue[0].status == 2) {
                status = "Carregando"
            }

            let viws = Number(Datanewer.queue[0].views)
            if (viws > 999999999) {
                //bilhão
                if (Math.round((viws/1000000000)) > 1) {
                    Datanewer.queue[0].views = (Math.round(viws/1000000000)).toString()+" Bilhões"
                }else {
                    Datanewer.queue[0].views = "1 Bilhão"
                }
            } else if (viws > 999999) {
                //milhão
                if (Math.round((viws/1000000)) > 1) {
                    Datanewer.queue[0].views = (Math.round(viws/1000000)).toString()+" Milhões"
                }else {
                    Datanewer.queue[0].views = "1 Milhão"
                }
            } else if (viws > 999) {
                //mil
                if (Math.round((viws/1000)) > 1) {
                    Datanewer.queue[0].views = (Math.round(viws/1000)).toString()+" Mil"
                }
            }

            const canvas = cvs.createCanvas(640 , 360 )
            const ctx = canvas.getContext('2d')

            const avatar = await cvs.loadImage(Datanewer.queue[0].thumb);
            const verifyed = await cvs.loadImage(dt.GetLocalImage("verifiedicon.png"));
            ctx.save();

            // Define the clipping region as an 360 degrees arc at point x and y
            roundedsquare(ctx, 0,0,640 ,360 ,25)
            ctx.clip();
            ctx.drawImage(avatar, 0, 0, 640 , 360 );
            ctx.globalAlpha = 0.85;
            ctx.fillStyle="#000000" 
            ctx.fill()
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = '#ffffff';
            roundedsquare(ctx,20,171,610,119,25)
            ctx.strokeStyle ="#FFFFFF" 
            ctx.stroke();
            ctx.fillStyle="#000000" 
            ctx.fill()
            ctx.globalAlpha = 1;
            ctx.restore();
            //END OF BLUR
            ctx.save();

            // Define the clipping region as an 360 degrees arc at point x and y
            roundedsquare(ctx, 20,20,250 ,141 ,10)

            // Clip!
            ctx.clip();
            ctx.drawImage(avatar, 20, 20, 250, 141 );
            ctx.stroke();
            ctx.restore();

            ctx.font = `22px pirates of cydonia`;

            ctx.textAlign = 'start'
            ctx.fillStyle = '#ffffff';
            ctx.fillText(Datanewer.queue[0].title, 272, canvas.height / 5);
            ctx.textAlign = 'start'
            ctx.fillText("Autor: "+Datanewer.queue[0].author, 272, canvas.height / 3.5);
            ctx.fillText("Views: "+Datanewer.queue[0].views, 272, canvas.height / 2.7);
            if (Datanewer.queue[0].verified === true) {
                ctx.drawImage(verifyed, 270+ctx.measureText("Autor: "+Datanewer.queue[0].author).width+10, canvas.height / 4.1, 20, 20 );
            }

            ctx.textAlign = 'end'
            ctx.fillText(status, canvas.width-10, canvas.height / 3.5);

            let fontSize2 = 200;

            do {
                ctx.font = `${fontSize2 -= 9}px pirates of cydonia`;
            } while (ctx.measureText(Datanewer.queue[0].playtimestamp+" | "+Datanewer.queue[0].size).width > canvas.width / (3));

            if (Datanewer.queue[0].playtimestamp === Datanewer.queue[0].size) {
                Datanewer.queue[0].playtimestamp = "0:00"
            }

            ctx.textAlign = 'start'
            ctx.fillStyle = '#CCCCCC';
            ctx.fillText(Datanewer.queue[0].playtimestamp, 20, canvas.height-20);
            ctx.textAlign = 'end'
            ctx.fillText(Datanewer.queue[0].size, canvas.width -10, canvas.height-20);

            ctx.font = `22px pirates of cydonia`;

            ctx.textAlign = 'start'
            ctx.fillStyle = '#CCCCCC';
            ctx.fillText("Pequena descrição:", 30, canvas.height/1.8);
            ctx.fillText(shortdescp1, 30, canvas.height/1.5);
            ctx.fillText(shortdescp2, 26, canvas.height/1.35);

            //Progress bar
            roundedsquare(ctx,65+ctx.measureText(Datanewer.queue[0].playtimestamp).width,canvas.height-50,(canvas.width -(130+ctx.measureText(Datanewer.queue[0].playtimestamp).width))-ctx.measureText(Datanewer.queue[0].size).width,30,25)
            ctx.strokeStyle ="#888888" 
            ctx.stroke();
            ctx.fillStyle="#68009c" 
            ctx.globalAlpha = 0.25;
            ctx.fill()
            ctx.globalAlpha = 1;
            let fulltime = Number(Datanewer.queue[0].size.split(":").join(""))
            let currentTimer = Number(Datanewer.queue[0].playtimestamp.split(":").join(""))
            if (currentTimer === fulltime) {
                currentTimer = 0;
            }
            let barpercentinpixels = (((canvas.width -(130+ctx.measureText(Datanewer.queue[0].playtimestamp).width))-ctx.measureText(Datanewer.queue[0].size).width)*currentTimer)/fulltime;
            roundedsquare(ctx,65+ctx.measureText(Datanewer.queue[0].playtimestamp).width,canvas.height-50,barpercentinpixels,30,25)
            ctx.fillStyle="#ffbe3b" 
            ctx.fill()
            var attachment = new MessageAttachment(canvas.toBuffer(), 'Tocando'+Datanewer.queue[0].playtimestamp+'agora.png')
            msg.channel.send(attachment)
            Promise.resolve(Waiting).then(function(value) {
                value.delete()
            }).catch(() => {
                console.log(Client,"Erro: Não foi possivel deletar: tocando.js: value.delete()")
            })
        }
    }