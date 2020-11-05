var data = require('../Controllers/GetData')
const { MessageEmbed } = require('discord.js')
var Parser = require('expr-eval').Parser;

//TODO:
////Resolve the resolver

module.exports = {
    //Base help
    Help: "Resolve a conta matemática inserida",
    Usage: "calc <Conta Matemática>",
    Topic: "utilities",
    Thumbnail: "https://cdn2.iconfinder.com/data/icons/ios7-inspired-mac-icon-set/1024/Calculator_5122x.png",
    NeedArguments: true,
    //msg = the function message
    //args = array with all things put after the command (separated by spaces) 
    Main: async (msg, args) => {
        args.shift()
        args = args.join('')
        args = args.split(",").join(".")
        if (args.includes("raiz")) {
            arg = args.split("raiz")
            //arg.shift()
            arg.forEach((element, index) => {
                arg[index] = arg[index].substring(1)
                argu = arg[index].split("")
                argu.forEach((element,index) => {
                    if (element === ")") {
                        argu.splice(index,1)
                        return
                    }
                })
                arg[index] = argu.join("")
            })
            arg = arg.join("")
            
            var expression ="";
            expression = arg;
            var copy = expression;
            
            expression = expression.replace(/[0-9]+/g, "#").replace(/[\(|\|\.)]/g, "");
            var numbers = copy.split(/[^0-9\.]+/);
            var operators = expression.split("#").filter(function(n){return n});
            var resulter = [];
            
            for(i = 0; i < numbers.length; i++){
                 resulter.push(numbers[i]);
                 if (i < operators.length) resulter.push(operators[i]);
            }

            arg = resulter

            let argososos = []
            arg.forEach(element => {
                if (element.length > 10) {
                    arg = []
                    argososos = []
                }
                argososos.push(element)
            }) 
            argososos.forEach((elementy, indexy) => {
                argososos[indexy] = "raiz("+elementy+")"
            })
            arg.forEach((element, index) => {
                //Find the log of the numbers
                let PerfectLog = 0;
                let NotPerfectLogFail = 0;
                for (let indexo = 0; indexo*indexo<Number(element)+1; indexo++) {
                    PerfectLog = indexo;
                    if (indexo*indexo===Number(element)) {
                        arg[index] = indexo
                        return
                    }
                }
                //logs with decimals
                for (let indexa = PerfectLog; indexa*indexa<Number(element)+0.001; indexa = indexa+0.001) {
                    NotPerfectLogFail = indexa
                    if (NotPerfectLogFail.toString().split(".")[1] && NotPerfectLogFail.toString().split(".")[1].length > 2) {
                        NotPerfectLogFail = Number(NotPerfectLogFail.toString().split(".")[0]+"."+NotPerfectLogFail.toString().split(".")[1].slice(0,3))
                    }
                    if (indexa*indexa===Number(element)) {
                        arg[index] = indexa
                        return
                    }
                    arg[index] = NotPerfectLogFail
                }
            })
            argososos.forEach((elements, indexs) => {
                args = args.split(elements).join(arg[indexs])
            })
        }
        let response;
        try {
            var parser = new Parser();
            var expr = parser.parse(args)
            response = expr.evaluate()
    } catch(E) {
    }
        if (isNaN(response)) { response = "Incalculavel" }
        if (response === Infinity) { response = "O numero excedeu os limites de calculo" }
        if (response === true) { response = "Verdadeiro" }
        if (response === false) { response = "Falso" }
        if (!response.toString().includes(".")) {
            msg.channel.send("```"+args+"\n="+response+"```")
        } else {
            if (response.toString().split(".")[1].length > 1) {response = response.toString().split(".")[0]+"."+response.toString().split(".")[1].slice(0,3)}
            msg.channel.send("```"+args+"\n≅"+response+"```")
        }
    }
}