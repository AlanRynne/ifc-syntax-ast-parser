// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

let lexer = moo.states({
    // Rules that apply to every state.
    $all: {
        space: { match: /\s+/, lineBreaks: true },
        eol: { match: /;\s*/, lineBreaks: true },
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
        word: { match: /[A-Z\_0-9]+/ },
        lparen: { match: /\(/, push: 'input' },
    },
    // "DATA" section
    data: {
        include: ['endsec'],
        ref: { match: /#\d+/, value: x=> x.slice(1) },
        assign: { match: "=", push: 'entity'}
    },
    // IFC entity declaration
    entity: {
        word: { match: /\w+/ },
        lparen: { match: /\(/, push: 'input' },
        eol: { match: /;\s*/, pop: true },
    },
    // Resolves anything inside the constructor parenthesis, including nested parenthesis.
    input: {
        number: /(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:\.[eE][-+]?[0-9]+)?\b/,
        word: { match: /\w+/ },
        ".": { match: /\./ },
        "-": "-",
        separator: { match: /,/ },
        dollar: { match: "$", value: x => null },
        star: { match: "*", value: x => null },
        ref: { match: /#\d+/, value: x=> x.slice(1) },
        quote: { match: /\'|\"/, push: 'string' },
        lparen: { match: "(", push: 'input' },
        rparen: { match: ")", pop: true },
    },
    // Resolves anything inside a parenthesis that is not the constructor parenthesis.
    // Close section tag "ENDSEC"
    endsec: {
        endtag: { match: /ENDSEC/, pop: true },
    },
    // Resolves anything inside single or double quotes.
    string: {
        quote: { match: /\'|\"/, pop: true },
        string: { match: /[^\"|\']+/, lineBreaks: true }
    }
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
    Lexer: lexer,
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
    {"name": "header_section$ebnf$1", "symbols": ["header_tags"], "postprocess": id},
    {"name": "header_section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "header_section", "symbols": ["tag_header", "_", "header_section$ebnf$1", "_", "tag_end_sec"], "postprocess":  (data) => {
            let headerObj = {
                type: "sec",
                name: "header",
                start: data[0].offset,
                end: data[4].offset + data[4].text.length,
                children: data[2] ? data[2] : null
            }
            return headerObj;
        }},
    {"name": "header_tags$ebnf$1", "symbols": []},
    {"name": "header_tags$ebnf$1", "symbols": ["header_tags$ebnf$1", "header_tag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "header_tags", "symbols": ["header_tags$ebnf$1"]},
    {"name": "header_tag", "symbols": [(lexer.has("word") ? {type: "word"} : word), (lexer.has("lparen") ? {type: "lparen"} : lparen), "header_inputs", (lexer.has("rparen") ? {type: "rparen"} : rparen), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess":  (data) => {
            return {
                type: "head_tag",
                name: data[0],
                start: data[1].offset,
                end: data[4].offset + data[4].text.length,
                children: data[2]
            }
        }},
    {"name": "header_inputs$ebnf$1", "symbols": []},
    {"name": "header_inputs$ebnf$1$subexpression$1", "symbols": [(lexer.has("separator") ? {type: "separator"} : separator), "_", "header_input"]},
    {"name": "header_inputs$ebnf$1", "symbols": ["header_inputs$ebnf$1", "header_inputs$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "header_inputs", "symbols": ["header_input", "_", "header_inputs$ebnf$1"], "postprocess":  (data) => {
            var d = [data[0]]
            for(let i in data[2]){
                d.push(data[2][i][2])
            }
            return d;
        } },
    {"name": "header_input$ebnf$1", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen)], "postprocess": id},
    {"name": "header_input$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "header_input$ebnf$2", "symbols": [(lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": id},
    {"name": "header_input$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "header_input", "symbols": ["header_input$ebnf$1", "string", "header_input$ebnf$2"], "postprocess": (data) => data[1]},
    {"name": "data_section$ebnf$1$subexpression$1", "symbols": ["data_entities"]},
    {"name": "data_section$ebnf$1", "symbols": ["data_section$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "data_section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_section", "symbols": ["tag_data", "_", "data_section$ebnf$1", "_", "tag_end_sec"], "postprocess":  (data) => {
            let dataObj = {
                type: "sec",
                name: "data",
                start: data[0].offset,
                end: data[4].offset + data[4].text.length,
                children: data[2] ? data[2][0] : null
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
    {"name": "data_entity", "symbols": [(lexer.has("ref") ? {type: "ref"} : ref), "_", (lexer.has("assign") ? {type: "assign"} : assign), "_", "data_entity_constructor", (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess":  (data) => {
            data[0].type = "var";
            return {
                type: "assign",
                left: data[0],
                right: data[4]
            }
        } },
    {"name": "data_entity_constructor", "symbols": [(lexer.has("word") ? {type: "word"} : word), (lexer.has("lparen") ? {type: "lparen"} : lparen), "constructor_values", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess":  (data) => {
            return {
                type: 'ctor',
                name: data[0],
                input: data[2]
            }
        }},
    {"name": "constructor_values$ebnf$1", "symbols": ["constructor_value"], "postprocess": id},
    {"name": "constructor_values$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "constructor_values", "symbols": ["constructor_values$ebnf$1"]},
    {"name": "constructor_values$ebnf$2$subexpression$1", "symbols": [(lexer.has("separator") ? {type: "separator"} : separator), "_", "constructor_value"]},
    {"name": "constructor_values$ebnf$2", "symbols": ["constructor_values$ebnf$2$subexpression$1"]},
    {"name": "constructor_values$ebnf$2$subexpression$2", "symbols": [(lexer.has("separator") ? {type: "separator"} : separator), "_", "constructor_value"]},
    {"name": "constructor_values$ebnf$2", "symbols": ["constructor_values$ebnf$2", "constructor_values$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "constructor_values", "symbols": ["constructor_value", "_", "constructor_values$ebnf$2"], "postprocess":  (data) => {
            var d = [data[0]];
            for(let i in data[2]) {
                d.push(data[2][i][2])
            }
            return d;
        }},
    {"name": "constructor_value$subexpression$1", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar)]},
    {"name": "constructor_value$subexpression$1", "symbols": ["string"]},
    {"name": "constructor_value$subexpression$1", "symbols": [(lexer.has("ref") ? {type: "ref"} : ref)]},
    {"name": "constructor_value$subexpression$1", "symbols": [(lexer.has("star") ? {type: "star"} : star)]},
    {"name": "constructor_value$subexpression$1", "symbols": ["dotted_word"]},
    {"name": "constructor_value$subexpression$1", "symbols": ["number"]},
    {"name": "constructor_value$subexpression$1", "symbols": ["data_entity_constructor"]},
    {"name": "constructor_value", "symbols": ["constructor_value$subexpression$1"], "postprocess": (data) => data[0][0]},
    {"name": "constructor_value", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "constructor_values", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": (data) => data[1]},
    {"name": "tag_header", "symbols": [(lexer.has("headertag") ? {type: "headertag"} : headertag), (lexer.has("eol") ? {type: "eol"} : eol), "_"], "postprocess": first},
    {"name": "tag_data", "symbols": [(lexer.has("datatag") ? {type: "datatag"} : datatag), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "tag_end_sec", "symbols": [(lexer.has("endtag") ? {type: "endtag"} : endtag), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "tag_iso_open", "symbols": [(lexer.has("isotag") ? {type: "isotag"} : isotag), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "tag_iso_close", "symbols": [(lexer.has("isoclosetag") ? {type: "isoclosetag"} : isoclosetag), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": first},
    {"name": "string$ebnf$1", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "string$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "string", "symbols": [(lexer.has("quote") ? {type: "quote"} : quote), "string$ebnf$1", (lexer.has("quote") ? {type: "quote"} : quote)], "postprocess": (data) => data[1]? data[1] : { type: "string", value: null, text: ''}},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": function(d) { return null; }},
    {"name": "dotted_word", "symbols": [{"literal":"."}, (lexer.has("word") ? {type: "word"} : word), {"literal":"."}], "postprocess": data => { data[1].type = "dotword"; return data[1]}},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$1", "symbols": ["number$subexpression$1$ebnf$1", (lexer.has("number") ? {type: "number"} : number)]},
    {"name": "number$ebnf$1", "symbols": [{"literal":"."}], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$subexpression$1", "number$ebnf$1"], "postprocess":  (data) => { 
        var value = parseFloat(data[0].join(""));
        var num = data[0][1];
        num.value = value;
        num.text = `${value}`
        return num;
        }}
]
  , ParserStart: "main_section"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
