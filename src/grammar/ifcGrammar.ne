@include "mooTokens.ne"
@lexer lexer

main -> line:+ {% id %}

line -> content _ ";" _ {% (data) => data[0] %}

content -> (headTags | entity | headEntity ) {% (data) => data[0][0] %}

entity -> ifcRef _ "=" _ ifcClass ifcInput {%
    function(data){
        return {
            type: "ifcEntity",
            ref: data[0].value,
            class: data[4],
            input: data[5]
        }
    }
%}

headEntity -> "FILE" "_" word ifcInput {% 
    function(data) {
        return {
            type: data[2],
            value: data[3]
        }
    }
%}

ifcInput -> "(":? ifcInputList ")":? {% (data) => data[1] %}

ifcInputList -> "(" _ ifcInputType ( _ "," _ ifcInputType):* _ ")" {% extractArray %}

ifcInputType -> (
    star
    | dollar
    | dotWord
    | sqstring 
    | ifcRef
    | number {% function(data) {return[{type:"number",value:data[0]}]}%}
    | ifcClass ifcInput {% function(data) {return[{type:"ifcEntity", ref: null, class:data[0], input: data[1]}]}%}
    | parenIfcInputType
    | ifcInputList
    | "(" ")"
) {% (data) => data[0][0]%}

parenIfcInputType -> "(" ifcInputType ")" {% (data) => data[1] %}

ifcClass -> "IFC" word {% function(data){ return data[0] + data[1].value;} %}

ifcRef -> "#" %number {% function(d) { return { type: "ifcRef", value: parseFloat(d[1].value) } } %}



fileTags -> 
    (%fileDescription
    | %fileName
    | %fileSchema) {% id.text %}

headTags -> 
    ( %header
    | %data
    | %endSec ) {% function (data) {
        return {
            type: 'tag',
            name: data[0][0].type
        }
    } %}
    | ( isoTag
    | endIsoTag ) {% (data) => data[0][0] %}


endIsoTag -> "END" "-" isoTag {%
    function (data) {
        return {
            type: 'tag',
            name: 'endIso',
            main: data[2].main,
            sub: data[2].sub
        }
    }
%}

isoTag -> "ISO" "-" number "-" number {%
    function (data) {
        return {
            type: 'tag',
            name: 'iso',
            main: data[2],
            sub: data[4]
        }
    }
%}

# Basics
dotWord -> "." word "." {% data => { return data[1]} %}

star -> %star {% function(data){ return { type: "star", value: "*"}} %}

dollar -> %dollar {% function(data){ return { type: "dollar", value: "$"}} %}

word -> (%word {% (data)=>data[0].value %}| %word ("_" %word):? {% extractArray %}) {% function(data){ return { type: "string", value: data[0] }} %}

number -> (%number|"-" %number) ".":? {% function(d) { return parseFloat(d[0].join("")) } %}

_ -> null | %space {% function(d) { return null; } %}

sqstring -> "'"  sstrchar:* "'"  {% function(d) {return { type: "string", value: d[1].join("") } } %}

sstrchar -> [^\\'\n] {% id %}
    | "\\" strescape
        {% function(d) { return JSON.parse("\""+d.join("")+"\""); } %}
    | "\\'"
        {% function(d) {return "'"; } %}
    | "/"
        {% function(d) {return "/"; } %}

strescape -> ["\\/bfnrt] {% id %}
    | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {%
    function(d) {
        return d.join("");
    }
%}

@{%

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

%}