// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

let newlexer = moo.states({
    // Rules that apply to every state.
    $all: {
        eol: {match: /;\s*/, lineBreaks: true},
        space: {match: /\s+/, lineBreaks: true},
        ifcError: moo.error
    },
    // Main rules
    main: {
        isotag: {match: /ISO-\d\d\d\d\d-\d\d/, value: x=> x.slice(4,0)},
        isoclosetag: {match: /END-ISO-\d\d\d\d\d-\d\d/, value: x=> x.slice(8,0)},
        headertag: {match: /HEADER/, lineBreaks: true, push: 'header'},
        datatag: {match: /DATA/, lineBreaks: true, push: 'header'},
    },
    // "HEADER" section
    header: {
        include: ['endsec'],
    },
    // "DATA" section
    data: {
        include: ['endsec'],
    },
    // Close section tag "ENDSEC"
    endsec: {
        endtag: {match: /ENDSEC/, pop: true},
    },
})

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
    myError: moo.error
})




function createTag(name,value) {
    return {
        type: 'tag',
        name: name,
        value: value
    }
}

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
    Lexer: newlexer,
    ParserRules: [
    {"name": "main_section$ebnf$1$subexpression$1", "symbols": ["header_section"]},
    {"name": "main_section$ebnf$1", "symbols": ["main_section$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "main_section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main_section$ebnf$2$subexpression$1", "symbols": ["data_section"]},
    {"name": "main_section$ebnf$2", "symbols": ["main_section$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "main_section$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main_section", "symbols": ["tag_iso_open", "_", "main_section$ebnf$1", "_", "main_section$ebnf$2", "_", "tag_iso_close"], "postprocess":  (data) => {
            console.log("DATA:", data)
            return {
                type: "ifc",
                header: data[3],
                data: data[5]
            };
        }},
    {"name": "header_section$ebnf$1$subexpression$1", "symbols": ["_", {"literal":" "}]},
    {"name": "header_section$ebnf$1", "symbols": ["header_section$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "header_section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "header_section", "symbols": ["tag_header", "header_section$ebnf$1", "_", "tag_end_sec"], "postprocess":  (data) => { 
            return {
                type: "section",
                name: "header",
                children: []
            }
        }},
    {"name": "data_section$ebnf$1$subexpression$1", "symbols": ["_", {"literal":" "}]},
    {"name": "data_section$ebnf$1", "symbols": ["data_section$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "data_section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_section", "symbols": ["tag_data", "data_section$ebnf$1", "_", "tag_end_sec"], "postprocess":  (data) => { 
            return {
                type: "section",
                name: "data",
                children: []
            }
        }},
    {"name": "tag_header", "symbols": [(newlexer.has("headertag") ? {type: "headertag"} : headertag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": (data) => data[0]},
    {"name": "tag_data", "symbols": [(newlexer.has("datatag") ? {type: "datatag"} : datatag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": (data) => data[0]},
    {"name": "tag_end_sec", "symbols": [(newlexer.has("endtag") ? {type: "endtag"} : endtag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": (data) => data[0]},
    {"name": "tag_iso_open", "symbols": [(newlexer.has("isotag") ? {type: "isotag"} : isotag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess":  
        (data) => createTag('iso-open', data[0]) 
        },
    {"name": "tag_iso_close", "symbols": [(newlexer.has("isoclosetag") ? {type: "isoclosetag"} : isoclosetag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": 
        (data) => createTag('iso-close', data[0])
        },
    {"name": "dotted_word", "symbols": [{"literal":"."}, "word", {"literal":"."}], "postprocess": data => { return data[1]}},
    {"name": "star", "symbols": [(newlexer.has("star") ? {type: "star"} : star)], "postprocess": function(data){ return { type: "star", value: "*"}}},
    {"name": "dollar", "symbols": [(newlexer.has("dollar") ? {type: "dollar"} : dollar)], "postprocess": function(data){ return { type: "dollar", value: "$"}}},
    {"name": "word$subexpression$1", "symbols": [(newlexer.has("word") ? {type: "word"} : word)], "postprocess": (data)=>data[0].value},
    {"name": "word$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":"_"}, (newlexer.has("word") ? {type: "word"} : word)]},
    {"name": "word$subexpression$1$ebnf$1", "symbols": ["word$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "word$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "word$subexpression$1", "symbols": [(newlexer.has("word") ? {type: "word"} : word), "word$subexpression$1$ebnf$1"], "postprocess": extractArray},
    {"name": "word", "symbols": ["word$subexpression$1"], "postprocess": function(data){ return { type: "string", value: data[0] }}},
    {"name": "number$subexpression$1", "symbols": [(newlexer.has("number") ? {type: "number"} : number)]},
    {"name": "number$subexpression$1", "symbols": [{"literal":"-"}, (newlexer.has("number") ? {type: "number"} : number)]},
    {"name": "number$ebnf$1", "symbols": [{"literal":"."}], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$subexpression$1", "number$ebnf$1"], "postprocess": function(d) { return parseFloat(d[0].join("")) }},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(newlexer.has("space") ? {type: "space"} : space)], "postprocess": function(d) { return null; }},
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
  , ParserStart: "main_section"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
