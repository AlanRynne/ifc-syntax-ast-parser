// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

let lexer = moo.compile({
    space: {match: /\s+/, lineBreaks: true},
    number: /(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:\.[eE][-+]?[0-9]+)?\b/,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    '(':'(',
    ')':')',
    ',': ',',
    ':': ':',
    ';':';',
    '.':'.',
    '<':'<',
    '=':'=',
    '>':'>',
    '_':'_',
    '-':'-',
    '#':'#',
    '\'':'\'',
    '/':'/',
    dollar:'$',
    star:'*',
    header: 'HEADER',
    file: 'FILE',
    endSec: 'ENDSEC',
    data: 'DATA',
    ifc: 'IFC',
    iso: 'ISO',
    end: 'END',
    word: /[a-zA-Z0-9\-]+/,

})




function extractPair(kv, output) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject(d) {
    let output = {};

    extractPair(d[2], output);

    for (let i in d[3]) {
        extractPair(d[3][i][3], output);
    }

    return output;
}

function extractArray(d) {
    let output = [d[2]];

    for (let i in d[3]) {
        output.push(d[3][i][3]);
    }

    return output;
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": ["line"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "line"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": id},
    {"name": "line", "symbols": ["content", "_", {"literal":";"}, "_"], "postprocess": (data) => data[0]},
    {"name": "content$subexpression$1", "symbols": ["headTags"]},
    {"name": "content$subexpression$1", "symbols": ["entity"]},
    {"name": "content$subexpression$1", "symbols": ["headEntity"]},
    {"name": "content", "symbols": ["content$subexpression$1"], "postprocess": (data) => data[0][0]},
    {"name": "entity", "symbols": ["ifcRef", "_", {"literal":"="}, "_", "ifcClass", "ifcInput"], "postprocess": 
        function(data){
            return {
                type: "ifcEntity",
                ref: data[0].value,
                class: data[4],
                input: data[5]
            }
        }
        },
    {"name": "headEntity", "symbols": [{"literal":"FILE"}, {"literal":"_"}, "word", "ifcInput"], "postprocess":  
        function(data) {
            return {
                type: data[2],
                value: data[3]
            }
        }
        },
    {"name": "ifcInput$ebnf$1", "symbols": [{"literal":"("}], "postprocess": id},
    {"name": "ifcInput$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ifcInput$ebnf$2", "symbols": [{"literal":")"}], "postprocess": id},
    {"name": "ifcInput$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ifcInput", "symbols": ["ifcInput$ebnf$1", "ifcInputList", "ifcInput$ebnf$2"], "postprocess": (data) => data[1]},
    {"name": "ifcInputList$ebnf$1", "symbols": []},
    {"name": "ifcInputList$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "ifcInputType"]},
    {"name": "ifcInputList$ebnf$1", "symbols": ["ifcInputList$ebnf$1", "ifcInputList$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ifcInputList", "symbols": [{"literal":"("}, "_", "ifcInputType", "ifcInputList$ebnf$1", "_", {"literal":")"}], "postprocess": extractArray},
    {"name": "ifcInputType$subexpression$1", "symbols": ["star"]},
    {"name": "ifcInputType$subexpression$1", "symbols": ["dollar"]},
    {"name": "ifcInputType$subexpression$1", "symbols": ["dotWord"]},
    {"name": "ifcInputType$subexpression$1", "symbols": ["sqstring"]},
    {"name": "ifcInputType$subexpression$1", "symbols": ["ifcRef"]},
    {"name": "ifcInputType$subexpression$1", "symbols": ["number"], "postprocess": function(data) {return[{type:"number",value:data[0]}]}},
    {"name": "ifcInputType$subexpression$1", "symbols": ["ifcClass", "ifcInput"], "postprocess": function(data) {return[{type:"ifcEntity", ref: null, class:data[0], input: data[1]}]}},
    {"name": "ifcInputType$subexpression$1", "symbols": ["parenIfcInputType"]},
    {"name": "ifcInputType$subexpression$1", "symbols": ["ifcInputList"]},
    {"name": "ifcInputType$subexpression$1", "symbols": [{"literal":"("}, {"literal":")"}]},
    {"name": "ifcInputType", "symbols": ["ifcInputType$subexpression$1"], "postprocess": (data) => data[0][0]},
    {"name": "parenIfcInputType", "symbols": [{"literal":"("}, "ifcInputType", {"literal":")"}], "postprocess": (data) => data[1]},
    {"name": "ifcClass", "symbols": [{"literal":"IFC"}, "word"], "postprocess": function(data){ return data[0] + data[1].value;}},
    {"name": "ifcRef", "symbols": [{"literal":"#"}, (lexer.has("number") ? {type: "number"} : number)], "postprocess": function(d) { return { type: "ifcRef", value: parseFloat(d[1].value) } }},
    {"name": "fileTags$subexpression$1", "symbols": [(lexer.has("fileDescription") ? {type: "fileDescription"} : fileDescription)]},
    {"name": "fileTags$subexpression$1", "symbols": [(lexer.has("fileName") ? {type: "fileName"} : fileName)]},
    {"name": "fileTags$subexpression$1", "symbols": [(lexer.has("fileSchema") ? {type: "fileSchema"} : fileSchema)]},
    {"name": "fileTags", "symbols": ["fileTags$subexpression$1"], "postprocess": id.text},
    {"name": "headTags$subexpression$1", "symbols": [(lexer.has("header") ? {type: "header"} : header)]},
    {"name": "headTags$subexpression$1", "symbols": [(lexer.has("data") ? {type: "data"} : data)]},
    {"name": "headTags$subexpression$1", "symbols": [(lexer.has("endSec") ? {type: "endSec"} : endSec)]},
    {"name": "headTags", "symbols": ["headTags$subexpression$1"], "postprocess":  function (data) {
            return {
                type: 'tag',
                name: data[0][0].type
            }
        } },
    {"name": "headTags$subexpression$2", "symbols": ["isoTag"]},
    {"name": "headTags$subexpression$2", "symbols": ["endIsoTag"]},
    {"name": "headTags", "symbols": ["headTags$subexpression$2"], "postprocess": (data) => data[0][0]},
    {"name": "endIsoTag", "symbols": [{"literal":"END"}, {"literal":"-"}, "isoTag"], "postprocess": 
        function (data) {
            return {
                type: 'tag',
                name: 'endIso',
                main: data[2].main,
                sub: data[2].sub
            }
        }
        },
    {"name": "isoTag", "symbols": [{"literal":"ISO"}, {"literal":"-"}, "number", {"literal":"-"}, "number"], "postprocess": 
        function (data) {
            return {
                type: 'tag',
                name: 'iso',
                main: data[2],
                sub: data[4]
            }
        }
        },
    {"name": "dotWord", "symbols": [{"literal":"."}, "word", {"literal":"."}], "postprocess": data => { return data[1]}},
    {"name": "star", "symbols": [(lexer.has("star") ? {type: "star"} : star)], "postprocess": function(data){ return { type: "star", value: "*"}}},
    {"name": "dollar", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar)], "postprocess": function(data){ return { type: "dollar", value: "$"}}},
    {"name": "word$subexpression$1", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": (data)=>data[0].value},
    {"name": "word$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":"_"}, (lexer.has("word") ? {type: "word"} : word)]},
    {"name": "word$subexpression$1$ebnf$1", "symbols": ["word$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "word$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "word$subexpression$1", "symbols": [(lexer.has("word") ? {type: "word"} : word), "word$subexpression$1$ebnf$1"], "postprocess": extractArray},
    {"name": "word", "symbols": ["word$subexpression$1"], "postprocess": function(data){ return { type: "string", value: data[0] }}},
    {"name": "number$subexpression$1", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "number$subexpression$1", "symbols": [{"literal":"-"}, (lexer.has("number") ? {type: "number"} : number)]},
    {"name": "number$ebnf$1", "symbols": [{"literal":"."}], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$subexpression$1", "number$ebnf$1"], "postprocess": function(d) { return parseFloat(d[0].join("")) }},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": function(d) { return null; }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return { type: "string", value: d[1].join("") } }},
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar", "symbols": [{"literal":"\\'"}], "postprocess": function(d) {return "'"; }},
    {"name": "sstrchar", "symbols": [{"literal":"/"}], "postprocess": function(d) {return "/"; }},
    {"name": "strescape", "symbols": [/["\\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        }
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
