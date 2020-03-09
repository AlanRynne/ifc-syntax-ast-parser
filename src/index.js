// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

let newlexer = moo.states({
    // Rules that apply to every state.
    $all: {
        eol: { match: /;\s?/, error: true},
    },
    // Main rules
    main: {
        isotag: { match: /ISO-\d{5}-\d{2}/, value: x=> x.slice(4) },
        isoclosetag: { match: /END-ISO-\d{5}-\d{2}/, value: x=> x.slice(8) },
        headertag: { match: /HEADER/, push: 'header' },
        datatag: { match: /DATA/, push: 'data' },
    },
    // "HEADER" section
    header: {
        include: ['endsec'],
    },
    // "DATA" section
    data: {
        include: ['endsec'],
        ref: { match: /#\d+/, value: x=> x.slice(1) },
        assign: { match: "=", push: 'entity'}
    },
    // IFC entity declaration
    entity: {
        entity_name: { match: /\w+/ },
        lparen: { match: /\(/, push: 'constructor' },
        eol: { match: /;\s+/, pop: true },
    },
    // Resolves anything inside the constructor parenthesis, including nested parenthesis.
    constructor: {
        separator: { match: /,/ },
        dollar: { match: "$", value: x => null },
        string: { match: /(?:'|").*(?:'|")/, value: x => x.slice(1,-1)},
        ref: { match: /#\d+/, value: x=> x.slice(1) },
        rparen: { match: /\)/, pop: true }
    },
    // Resolves anything inside a parenthesis that is not the constructor parenthesis.
    parens: {
        rparen: { match: /\)/, pop: true }
    },
    // Close section tag "ENDSEC"
    endsec: {
        endtag: { match: /ENDSEC/, pop: true },
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

function first(d) { return d[0] };

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
    {"name": "main_section$ebnf$1", "symbols": ["header_section"], "postprocess": id},
    {"name": "main_section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main_section$ebnf$2", "symbols": ["data_section"], "postprocess": id},
    {"name": "main_section$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main_section", "symbols": ["tag_iso_open", "_", "main_section$ebnf$1", "_", "main_section$ebnf$2", "_", "tag_iso_close"], "postprocess":  (data) => {
            return {
                type: "step",
                version: data[0].value,
                start: data[0].offset,
                end: data[6].offset + data[6].text.length,
                children: [data[2], data[4]]
            } 
        }},
    {"name": "header_section", "symbols": ["tag_header", "tag_end_sec"], "postprocess":  (data) => {
            let headerObj = {
                type: "sec",
                name: "header",
                start: data[0].offset,
                end: data[1].offset + data[1].text.length,
                children: []
            }
            return headerObj;
        }},
    {"name": "data_section$ebnf$1$subexpression$1", "symbols": ["data_entities"]},
    {"name": "data_section$ebnf$1", "symbols": ["data_section$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "data_section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_section", "symbols": ["tag_data", "_", "data_section$ebnf$1", "_", "tag_end_sec"], "postprocess":  (data) => {
            let dataObj = {
                type: "sec",
                name: "data",
                start: data[0].offset,
                end: data[4].offset + data[4].text.length,
                children: data[2][0]
            }
            return dataObj;
        }},
    {"name": "data_entities$ebnf$1", "symbols": []},
    {"name": "data_entities$ebnf$1$subexpression$1", "symbols": ["_", "data_entity"]},
    {"name": "data_entities$ebnf$1", "symbols": ["data_entities$ebnf$1", "data_entities$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "data_entities", "symbols": ["data_entity", "data_entities$ebnf$1"], "postprocess":  (data) => {
            var d = [data[0]]
            for(let i in data[1]){
                d.push(data[1][i][1])
            }
            return d;
        } },
    {"name": "data_entity", "symbols": [(newlexer.has("ref") ? {type: "ref"} : ref), (newlexer.has("assign") ? {type: "assign"} : assign), "data_entity_constructor", (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess":  (data) => {
            return {
                type: "var",
                left: data[0],
                right: data[2]
            }
        } },
    {"name": "data_entity_constructor", "symbols": [(newlexer.has("entity_name") ? {type: "entity_name"} : entity_name), (newlexer.has("lparen") ? {type: "lparen"} : lparen), "constructor_values", (newlexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess":  (data) => {
            return {
                type: 'ctor',
                name: data[0],
                input: data[2]
            }
        }},
    {"name": "constructor_values$ebnf$1", "symbols": []},
    {"name": "constructor_values$ebnf$1$subexpression$1", "symbols": [(newlexer.has("separator") ? {type: "separator"} : separator), "constructor_value"]},
    {"name": "constructor_values$ebnf$1", "symbols": ["constructor_values$ebnf$1", "constructor_values$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "constructor_values", "symbols": ["constructor_value", "constructor_values$ebnf$1"], "postprocess":  (data) => {
            var d = [data[0][0]];
            for(let i in data[1]) {
                d.push(data[1][i][1][0])
            }
            return d;
        }},
    {"name": "constructor_value$subexpression$1", "symbols": [(newlexer.has("dollar") ? {type: "dollar"} : dollar)]},
    {"name": "constructor_value$subexpression$1", "symbols": [(newlexer.has("string") ? {type: "string"} : string)]},
    {"name": "constructor_value$subexpression$1", "symbols": [(newlexer.has("ref") ? {type: "ref"} : ref)]},
    {"name": "constructor_value", "symbols": ["constructor_value$subexpression$1"], "postprocess": first},
    {"name": "tag_header", "symbols": [(newlexer.has("headertag") ? {type: "headertag"} : headertag), (newlexer.has("eol") ? {type: "eol"} : eol), "_"], "postprocess": first},
    {"name": "tag_data", "symbols": [(newlexer.has("datatag") ? {type: "datatag"} : datatag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "tag_end_sec", "symbols": [(newlexer.has("endtag") ? {type: "endtag"} : endtag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "tag_iso_open", "symbols": [(newlexer.has("isotag") ? {type: "isotag"} : isotag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "tag_iso_close", "symbols": [(newlexer.has("isoclosetag") ? {type: "isoclosetag"} : isoclosetag), (newlexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(newlexer.has("space") ? {type: "space"} : space)], "postprocess": function(d) { return null; }}
]
  , ParserStart: "main_section"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
