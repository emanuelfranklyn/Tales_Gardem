var data = require('../Controllers/GetData')
var DH = require('../Controllers/DiscordHelper')
const { MessageEmbed } = require('discord.js')

module.exports = {
    //Base help
    Help: "Jogar o clássico jogo 2048 no discord!",
    Usage: "2048",
    Topic: "games",
    Thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/2048_logo.svg/1200px-2048_logo.svg.png",
    NeedArguments: false,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async(msg, args) => {
        var tryies = 0;
        var alerted = false;
        var GameOver = false;
        var lines = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        var Joined = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        var linesemoji = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        GenerateBlocks()
        function Emojify() {
            linesemoji = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
            lines.forEach((element, index) => {
                element.forEach((MiniMatrix, indexo) => {
                    if (MiniMatrix === 0) {
                        linesemoji[index][indexo] = "<:BLockNone:758139654545080373>";
                    }
                    if (MiniMatrix === 2) {
                        linesemoji[index][indexo] = "<:BLockTwo:758139654997803073>";
                    }
                    if (MiniMatrix === 4) {
                        linesemoji[index][indexo] = "<:BLockFour:758139654616383538>";
                    }
                    if (MiniMatrix === 8) {
                        linesemoji[index][indexo] = "<:BLockEight:758139654557663272>";
                    }
                    if (MiniMatrix === 16) {
                        linesemoji[index][indexo] = "<:BLockSixteen:758139654343229450>";
                    }
                    if (MiniMatrix === 32) {
                        linesemoji[index][indexo] = "<:BLockThreethTwo:758139654691749908>";
                    }
                    if (MiniMatrix === 64) {
                        linesemoji[index][indexo] = "<:BLockSixteethFour:758139654414794792>";
                    }
                    if (MiniMatrix === 128) {
                        linesemoji[index][indexo] = "<:BLockOneHundredTwentyEigth:758139654041763881>";
                    }
                    if (MiniMatrix === 256) {
                        linesemoji[index][indexo] = "<:BLockTwoHundredFifthSix:758139654762659901>";
                    }
                    if (MiniMatrix === 512) {
                        linesemoji[index][indexo] = "<:BLockFiveHundredTwoten:758139653701238794>";
                    }
                    if (MiniMatrix === 1024) {
                        linesemoji[index][indexo] = "<:BLockOneThousendTwentyFour:758139654322126878>";
                    }
                })
            })
        }

        function linesParse() {
            Emojify()
            linesemoji.forEach((element, index) => {
                linesemoji[index] = element.join("");
            });
            return linesemoji.join("\n");
        }

        function GenerateBlocks() {
            let collumn = Math.floor(Math.random() * (4 - 1 + 1) + 1)
            let line = Math.floor(Math.random() * (4 - 1 + 1) + 1)
            let BlockToBeGenerated = 2;
            if (Math.random() > 0.95) {
                BlockToBeGenerated = 4; //4 probability
            }
            if (lines[collumn - 1][line - 1] === 0) {
                lines[collumn - 1][line - 1] = BlockToBeGenerated;
            } else {
                if (tryies < 64) {
                    tryies += 1;
                    GenerateBlocks();
                } else {
                    GameOver = true;
                    return
                }
            }
        }

        function NextRound(Position) {
            if (Position === "right") {
                lines.forEach((element, index) => {
                    function moveRight() {
                        element.forEach((line, indexo) => {
                            if (lines[index][indexo + 1] === 0 && lines[index][indexo] !== 0) {
                                lines[index][indexo + 1] = lines[index][indexo];
                                lines[index][indexo] = 0;
                                moveRight()
                            }
                            if (lines[index][indexo + 1] === lines[index][indexo] && Joined[index][indexo + 1] === 0 && Joined[index][indexo] === 0) {
                                lines[index][indexo + 1] = lines[index][indexo] * 2;
                                lines[index][indexo] = 0
                                Joined[index][indexo + 1] = 1;
                                moveRight()
                            }
                        })
                    }
                    moveRight()
                })
                Joined = [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
                tryies = 0;
                GenerateBlocks()
            } else if (Position === "left") {
                lines.forEach((element, index) => {
                    function moveLeft() {
                        element.forEach((line, indexo) => {
                            if (lines[index][indexo - 1] === 0 && lines[index][indexo] !== 0) {
                                lines[index][indexo - 1] = lines[index][indexo];
                                lines[index][indexo] = 0;
                                moveLeft()
                            }
                            if (lines[index][indexo - 1] === lines[index][indexo] && Joined[index][indexo - 1] === 0 && Joined[index][indexo] === 0) {
                                lines[index][indexo - 1] = lines[index][indexo] * 2;
                                lines[index][indexo] = 0;
                                Joined[index][indexo - 1] = 1;
                                moveLeft()
                            }
                        })
                    }
                    moveLeft()
                })
                Joined = [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
                tryies = 0;
                GenerateBlocks()
            } else if (Position === "up") {
                function moveUp() {
                    lines.forEach((element, index) => {
                        element.forEach((line, indexo) => {
                            if (index !== 0) {
                                if (lines[index - 1][indexo] === 0 && lines[index][indexo] !== 0) {
                                    lines[index - 1][indexo] = lines[index][indexo];
                                    lines[index][indexo] = 0;
                                    moveUp()
                                }
                                if (lines[index - 1][indexo] === lines[index][indexo] && Joined[index - 1][indexo] === 0 && Joined[index][indexo] === 0) {
                                    lines[index - 1][indexo] = lines[index][indexo] * 2;
                                    lines[index][indexo] = 0;
                                    Joined[index - 1][indexo] = 1;
                                    moveUp()
                                }
                            }
                        })
                    })
                }
                moveUp()
                Joined = [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
                tryies = 0;
                GenerateBlocks()
            } else if (Position === "down") {
                function moveDown() {
                    lines.forEach((element, index) => {
                        element.forEach((line, indexo) => {
                            if (index !== 3) {
                                if (lines[index + 1][indexo] === 0 && lines[index][indexo] !== 0) {
                                    lines[index + 1][indexo] = lines[index][indexo];
                                    lines[index][indexo] = 0;
                                    moveDown()
                                }
                                if (lines[index + 1][indexo] === lines[index][indexo] && Joined[index + 1][indexo] === 0 && Joined[index][indexo] === 0) {
                                    lines[index + 1][indexo] = lines[index][indexo] * 2;
                                    lines[index][indexo] = 0;
                                    Joined[index + 1][indexo] = 1;
                                    moveDown()
                                }
                            }
                        })
                    })
                }
                moveDown()
                Joined = [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
                tryies = 0;
                GenerateBlocks()
            }
        }
        const embed = new MessageEmbed()
            .setTitle("2048! Beta")
            .setDescription(linesParse());
        msg.channel.send(embed).then((message) => {
            Reactor(message);
            Engine(message);
        })

        function updater(message, direction) {
            if (GameOver) {
                const embe = new MessageEmbed()
                    .setTitle("Fim de jogo! Beta")
                    .setDescription("Você perdeu!\n" + linesParse());
                message.edit(embe)
            } else {
                NextRound(direction);
                const embe = new MessageEmbed()
                    .setTitle("2048! Beta")
                    .setDescription(linesParse())
                message.edit(embe)
            }
        }

        async function Reactor(message) {
            try {
                await message.reactions.removeAll();
            } catch (e) {
                if (alerted === false) {
                    msg.channel.send("Sorry, i cannot remove the reaction, please unselect and select again :P");
                    alerted = true;
                }
            }
            await message.react('◀️');
            await message.react('▶️');
            await message.react('🔽');
            await message.react('🔼');
        }

        function Engine(message) {
            DH.ReactionController(message, async(reaction, reactionCollector) => {
                Reactor(message)
                if (reaction.emoji.name === "◀️") {
                    updater(message, "left")
                } else if (reaction.emoji.name === "▶️") {
                    updater(message, "right")
                } else if (reaction.emoji.name === "🔽") {
                    updater(message, "down")
                } else if (reaction.emoji.name === "🔼") {
                    updater(message, "up")
                }
            }, msg)
        }
    }
}