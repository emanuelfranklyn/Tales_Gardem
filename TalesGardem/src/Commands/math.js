var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
var Parser = require('expr-eval').Parser;

//TODO:
////Resolve the resolver

module.exports = {
    //Base help
    Help: "Calcula expressões matematicas com valores desconhecidos. Não use Barras de espaço",
    Usage: "math <expressão matematica>",
    Topic: "utilities",
    Thumbnail: "https://image.flaticon.com/icons/png/512/746/746960.png",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        var elements = []
        var values = []
        var breaker = false;
        args.shift()
        args.forEach(element => {
            element = element.replace(/\s/g, '');
            element = element.split('=')
            elements.push(element[0])
            values.push(element[1])
        });
        elements.forEach((theelement, index, array) => {
            values.forEach((thevalue, index2, array) => {
                if (thevalue === undefined && breaker === false) {
                    msg.channel.send("Formato invalido! ex: x=10*a a=15 (Usando espaços apenas para separar uma variável da outra)")
                    breaker = true;
                    return
                }
                if (breaker === false && thevalue.toString().includes(theelement)) {
                    values[index2] = thevalue.split(theelement).join(values[index])
                }
            })
        })
        try {
        values.forEach((ele,index,array) => {
            var parser = new Parser();
            var expr = parser.parse(ele)
            values[index] = expr.evaluate()
        })
    } catch(E) {
    }
        let response = [];
        elements.forEach((f,index,array) => {
            response.push(f+" = "+values[index])
        })
        if (breaker === false) {
            msg.channel.send("```"+response.join("\n")+"```")    
        }
    }
}