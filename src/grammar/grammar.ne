@include "tokens.ne"
@lexer newlexer


# Main rule - Resolves the complete IFC file
main_section -> tag_iso_open _ header_section:? _ data_section:? _ tag_iso_close {% (data) => {
    return {
        type: "step",
        version: data[0].value,
        start: data[0].offset,
        end: data[6].offset + data[6].text.length,
        children: [data[2], data[4]]
    } 
}%}

# ----
# Header section
# ----

# Resolves the complete header of the IFC file
header_section -> tag_header _ header_tags:? _ tag_end_sec {% (data) => {
    let headerObj = {
        type: "sec",
        name: "header",
        start: data[0].offset,
        end: data[4].offset + data[4].text.length,
        children: data[2] ? data[2] : null
    }
    return headerObj;
}%}

header_tags -> header_tag:*
header_tag -> %word %lparen header_inputs %rparen %eol {% (data) => {
    return {
        type: "head_tag",
        name: data[0],
        start: data[1].offset,
        end: data[4].offset + data[4].text.length,
        children: data[2]
    }
}%}

header_inputs -> header_input _ (%separator _ header_input):* {% (data) => {
    var d = [data[0]]
    for(let i in data[2]){
        d.push(data[2][i][2])
    }
    return d;
} %}
header_input -> %lparen:? string %rparen:? {% (data) => data[1] %}

# ----
# Data section
# ----

# Resolves the complete data section of the IFC file
data_section -> tag_data _ (data_entities):? _ tag_end_sec {% (data) => {
    let dataObj = {
        type: "sec",
        name: "data",
        start: data[0].offset,
        end: data[4].offset + data[4].text.length,
        children: data[2] ? data[2][0] : null
    }
    return dataObj;
}%}

data_entities -> data_entity (_ data_entity):* {% (data) => {
    var d = [data[0]]
    for(let i in data[1]){
        d.push(data[1][i][1])
    }
    return d;
} %}

data_entity -> %ref _ %assign _ data_entity_constructor %eol {% (data) => {
    data[0].type = "var";
    return {
        type: "assign",
        left: data[0],
        right: data[4]
    }
} %}

data_entity_constructor -> %word %lparen constructor_values %rparen {% (data) => {
    return {
        type: 'ctor',
        name: data[0],
        input: data[2]
    }
}%}

constructor_values -> constructor_value:? | constructor_value _ (%separator _ constructor_value):+ {% (data) => {
    var d = [data[0]];
    for(let i in data[2]) {
        d.push(data[2][i][2])
    }
    return d;
}%}

constructor_value -> ( %dollar 
                     | string
                     | %ref 
                     | %star 
                     | dotted_word 
                     | number 
                     | data_entity_constructor 
                     ) {% (data) => data[0][0] %}
                     | %lparen constructor_values %rparen {% (data) => data[1] %}

# ----
# Tags
# ----

tag_header -> %headertag %eol _ {% first %}

tag_data -> %datatag %eol {% first %}

tag_end_sec -> %endtag %eol {% first %}

tag_iso_open -> %isotag %eol {% first %}

tag_iso_close -> %isoclosetag %eol {% first %}

# ----
# Basics
# ----

string -> %quote %string:? %quote {% (data) => data[1]? data[1] : { type: "string", value: null, text: ''} %}

_ -> null | %space {% function(d) { return null; } %}

dotted_word -> "." %word "." {% data => { data[1].type = "dotword"; return data[1]} %}

# star -> %star {% function(data){ return { type: "star", value: "*"}} %}

# dollar -> %dollar {% function(data){ return { type: "dollar", value: "$"}} %}

# word -> (%word {% (data)=>data[0].value %}| %word ("_" %word):? {% extractArray %}) {% function(data){ return { type: "string", value: data[0] }} %}

number -> ("-":? %number) ".":? {% (data) => { 
    var value = parseFloat(data[0].join(""));
    var num = data[0][1];
    num.value = value;
    num.text = `${value}`
    return num;
    }%}


# sqstring -> "'"  sstrchar:* "'"  {% function(d) {return { type: "string", value: d[1].join("") } } %}

# sstrchar -> [^\\'\n] {% id %}
#     | "\\" strescape
#         {% function(d) { return JSON.parse("\""+d.join("")+"\""); } %}
#     | "\\'"
#         {% function(d) {return "'"; } %}
#     | "/"
#         {% function(d) {return "/"; } %}

# strescape -> ["\\/bfnrt] {% id %}
#     | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {%
#     function(d) {
#         return d.join("");
#     }
# %}

# ----
# Helper JS functions
# ----

@{%


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

%}