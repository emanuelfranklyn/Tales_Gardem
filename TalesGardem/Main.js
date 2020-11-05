const Discord = require('discord.js');
global.Client = new Discord.Client(); 
const Dt = require('./src/Controllers/GetData')
const Configs = Dt.GetConfigs();
const Hub = require('./src/hub');
const DisHel = require('./src/Controllers/DiscordHelper')
const fs = require('fs');
const canvas = require("canvas")
const path = require("path")
const WelcomeMessageBase = path.resolve("..","..","images","CustomWelcomeMessageBackground")
const StatusVelocity = Configs.TGStatusVelocity;
function Main() {
    Client.on('ready', () => {
        console.log("        "+Client.user.tag+" Connected to discord servers")
        DisHel.Log('```css\n \n['+Dt.DateNowHumanVisualizer(3)+'] Iniciando\n \n'+
        "."+Client.user.tag+" Inicializado e operando"+"\n \n"+
        "{Carregando: '"+Dt.GetCommands().length+" Comandos operacionais'}"
        +"\n ```", true)
        //---BotStatus
        function StatusChanger() {
            let message;
            let StatusRandomizer = Math.floor(Math.random() * (Configs.TGStatus.length + 1 + 1) + 1)-1
            if (StatusRandomizer > Configs.TGStatus.length-1) {
                StatusRandomizer = Configs.TGStatus.length-1;
            }
            if (StatusRandomizer < 0) {
                StatusRandomizer = 0;
            }
            if (Configs.TGStatus[StatusRandomizer].Title.includes('${')) {
                let startIndex = Configs.TGStatus[StatusRandomizer].Title.indexOf('${')+2
                let endIndex = Configs.TGStatus[StatusRandomizer].Title.indexOf('}')
                let Command = Configs.TGStatus[StatusRandomizer].Title.slice(startIndex, endIndex)
                let Result = eval(Command);
                let TBE;
                let TAF;
                if (startIndex > 2) {
                    TBE = Configs.TGStatus[StatusRandomizer].Title.slice(0, startIndex-2)
                }
                if (endIndex < Configs.TGStatus[StatusRandomizer].Title.length-1) {
                    TAF = Configs.TGStatus[StatusRandomizer].Title.slice(endIndex+1, Configs.TGStatus[StatusRandomizer].Title.length-1)
                }
                if (TBE) {
                    message = TBE;
                }
                if (message) {
                    if (Result) {
                        message += Result;
                    }
                    if (TAF) {
                        message += TAF;
                    }
                } else {
                    if (Result) {
                        message = Result;
                    }
                    if (message) { 
                        if (TAF) {
                            message += TAF;
                        }
                    } else {
                        if (TAF) {
                            message = TAF;
                        }
                    }
                }
            } else {
                message = Configs.TGStatus[StatusRandomizer].Title;
            }
            if (message) {
                Client.user.setPresence({ activity: { name: message.toString(), type: Configs.TGStatus[StatusRandomizer].Type } });
            }
            setTimeout(()=>{
                StatusChanger()
            }, StatusVelocity)
        }
        StatusChanger()
    });
    Client.on("guildMemberAdd", async User => {
        if (Dt.GuildsCacheExistsCache(User.guild.id)) {
            if (Dt.GuildsCacheExistsData(User.guild.id,"WelcomeMessageConfig")) {
                let data = Dt.GuildsCacheGetData(User.guild.id, "WelcomeMessageConfig")
                if (data.WelcomeChannel != "") {
                    if (data.Embed == false) {
                        try {
                            canvas.registerFont("/usr/src/app/PiratesOfCydonia-6wpM.ttf", { family: "pirates of cydonia" })
                        } catch {
                            canvas.registerFont("PiratesOfCydonia-6wpM.ttf", { family: "pirates of cydonia" })
                        }
                        //Show a message to this new user
                        let Background = WelcomeMessageBase+data.ImageWallpaperNumber+".png"
                        //Put user data on image
                        const Cunvas = canvas.createCanvas(2006, 1088)
                        const ctx = Cunvas.getContext('2d')

            const baquiground = await canvas.loadImage(Background)
            ctx.drawImage(baquiground, 0,0, Cunvas.width, Cunvas.height)

            let fontSize = 230;

            do {
                // Assign the font to the context and decrement it so it can be measured again
                ctx.font = `${fontSize -= 10}px pirates of cydonia`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (ctx.measureText(User.displayName).width > Cunvas.width / (1.56));

            // Select the style that will be used to fill the text in
            ctx.textAlign = 'center'
            ctx.fillStyle = '#ffffff';
            // Actually fill the text with a solid color
            ctx.fillText(User.displayName, Cunvas.width / 1.54, Cunvas.height / 1.8);
            if (data.ShowServerName == true) {
                let fontSize2 = 200;

                do {
                // Assign the font to the context and decrement it so it can be measured again
                ctx.font = `${fontSize2 -= 10}px pirates of cydonia`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
                } while (ctx.measureText(User.guild.name).width > Cunvas.width / (1.54));

                // Select the style that will be used to fill the text in
                ctx.textAlign = 'center'
                ctx.fillStyle = '#CCCCCC';
                // Actually fill the text with a solid color
                ctx.fillText(User.guild.name, Cunvas.width / 1.54, Cunvas.height / 1.3);
            }
            ctx.beginPath();
            // Start the arc to form a circle
            ctx.arc(360, 545, 225, 0, Math.PI * 2, true);
            // Put the pen down
            ctx.closePath();
            // Clip off the region you drew on
            ctx.clip();

            const avatar = await canvas.loadImage(User.user.displayAvatarURL({ format: 'jpg' }));
            ctx.drawImage(avatar, 120, 315, 470, 470);
            //Send image
            const attachment = new Discord.MessageAttachment(Cunvas.toBuffer(), 'Bem-vindo '+User.displayName.toString()+'.png')
            Client.channels.fetch(data.WelcomeChannel).then(channel => channel.send(attachment))
            }
        }
        }
    }
    })
    Client.on('message', async msg => {
        if(msg.author.bot) return;
        let Work = false;
        let message;
        let args;
        Configs.TGPrefix.forEach(element => {
            if ((msg.toString().toLowerCase().slice(0,element.length) === element) === true) {
                Work=true;
                message = msg.toString().slice(element.length, msg.toString().length);
                args = message.split(' ')
                args[0] = args[0].toLowerCase()
                message = args.join(' ')
            } else if (element.toString().includes("#")) {
                if ((element.slice(0,13) === msg.toString().slice(0,13)) || (element.slice(0,5) === msg.toString().slice(0,5))) {
                    Work=true;
                    message = msg.toString().slice(element.length, msg.toString().length);
                    args = message.split(' ')
                    args[0] = args[0].toLowerCase()
                    message = args.join(' ')
                }
            }
        })
        if (Work === true) {
            await Hub.ResolveCommand(msg, message)
        }
    });
    Client.on('reconnecting', () => {
        console.log('R E C O N E C T A N D O!');
    });
    Client.on('disconnect', () => {
        console.log('desconectado ;-;');
    });
    Client.login(Configs.TalesGardemBotToken);
}
module.exports = Main;