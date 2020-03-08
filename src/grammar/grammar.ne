@include "tokens.ne"
@lexer newlexer


# Main rule - Resolves the complete IFC file
main_section -> tag_iso_open _ (header_section):? _ (data_section):? _ tag_iso_close {% (data) => {
    console.log("DATA:", data)
    return {
        type: "ifc",
        header: data[3],
        data: data[5]
    };
}%}

# ----
# Header section
# ----

# Resolves the complete header of the IFC file
header_section -> tag_header (_ " "):? _ tag_end_sec {% (data) => { 
    return {
        type: "section",
        name: "header",
        children: []
    }
}%}

# ----
# Data section
# ----

# Resolves the complete data section of the IFC file
data_section -> tag_data (_ " "):? _ tag_end_sec {% (data) => { 
    return {
        type: "section",
        name: "data",
        children: []
    }
}%}

# ----
# Tags
# ----

tag_header -> %headertag %eol {% (data) => data[0] %}

tag_data -> %datatag %eol {% (data) => data[0] %}

tag_end_sec -> %endtag %eol {% (data) => data[0] %}

tag_iso_open -> %isotag %eol {% 
    (data) => createTag('iso-open', data[0]) 
%}

tag_iso_close -> %isoclosetag %eol {%
    (data) => createTag('iso-close', data[0])
%}

# ----
# Basics
# ----

dotted_word -> "." word "." {% data => { return data[1]} %}

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