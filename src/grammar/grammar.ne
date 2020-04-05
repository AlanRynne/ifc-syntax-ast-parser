@preprocessor typescript

@{% 
import { lexer } from './tokens'
import { first } from './functions'
import * as Nodes from "@/ast/nodes";
import { ASTType, ASTNode, ASTLocation } from "@/ast/index";
%}

@lexer lexer


# ----
# MAIN
# ----

# Resolves the complete IFC file
main_section -> tag_iso_open _ header_section:? _ data_section:? _ tag_iso_close {% (data: any) => {
    return new Nodes.DocumentNode(
        data[0].value,
        [data[2], data[4]], 
        new ASTLocation(
            data[0].offset, 
            data[6].offset + data[6].text.length
            )
        )
}%}

# ----
# HEADER SECTION
# ----

# Resolves the complete header of the IFC file
header_section -> tag_header _ header_entities _ tag_end_sec {% (data) => {
    return new Nodes.SectionNode(
        data[0],
        data[2][0],
        new ASTLocation(
            data[0].loc.start,
            data[4].loc.end
        )
    )
}%}


# Resolves a collection of header entities
header_entities -> header_entity (_ header_entity):*


# Resolves a header entity declaration
header_entity -> %word _ %lparen _ header_inputs _ %rparen %eol {% (data) => {
    return new Nodes.FunctionNode(
        data[0].value,
        data[4],
        new ASTLocation(data[2].offset,data[7].offset + data[7].text.length)
        )
}%} | comment


# Unfolds the nested list of header inputs into a single list
header_inputs -> header_input (_ %separator _ header_input):* {% data => {
    var d = [data[0]]
    for(let i in data[2]){
        d.push(data[2][i][3])
    }
    return d;
} %}

header_input -> comment _ header_input_raw | header_input_raw
# Resolves all valid header inputs (currently just strings?)
# TODO: Fix resolver
header_input_raw -> %lparen _ header_input (_ %separator _ header_input):* _ %rparen | %dollar | string


# ----
# DATA SECTION
# ----


# Resolves the complete data section of the IFC file
data_section -> tag_data _ data_entities:? _ tag_end_sec {% (data) => {
    return new Nodes.SectionNode(
        data[0],
        data[2],
        new ASTLocation(
            data[0].loc.start,
            data[4].loc.end))
}%}


# Unfolds a nested list of entities into a single list
data_entities -> data_entity (_ data_entity):* {% (data) => {
    var d = [data[0]]
    for(let i in data[1]){
        d.push(data[1][i][1])
    }
    return d;
} %}


# Resolves an IFC entity declaration
data_entity -> var _ %assign _ data_entity_constructor _ %eol {% (data) => {
    return new Nodes.AssignmentNode(
        data[0],
        data[4],
        new ASTLocation(data[0].loc.start,data[6].offset + data[6].text.length)
        )
} %} | comment {% first %}


# Resolves an IFC constructor function
data_entity_constructor -> %word _ %lparen constructor_values %rparen {% (data) => {
    return new Nodes.ConstructorNode(data[0].value,data[3],new ASTLocation(data[0].offset,data[4].offset + data[4].text.length))
}%}


# Resolves the arguments of a constructor function (but could be any function if need be)
constructor_values -> constructor_value:? 
                    | constructor_value _ (%separator _ constructor_value):+ {% (data) => {
    var d = [data[0]];
    for(let i in data[2]) {
        d.push(data[2][i][2])
    }
    return d;
}%}

# TODO: i thinks the memory leak is the circular reference between constructor_values and constructor_value
# TODO: Check solution in head and do the same (step by step rules)
# Resolves all valid values inside a constructor
constructor_value -> (    null_node 
                        | string
                        | var 
                        | enum_member 
                        | number 
                        | data_entity_constructor 
                     ) {% (data) => data[0][0] %}
                     | %lparen constructor_values %rparen {% (data) => data[1] %}

var -> %ref {% data => {
    return new Nodes.VariableNode(data[0].value,new ASTLocation(data[0].offset,data[0].offset+data[0].text.length))
}%}

null_node -> (%dollar | %star) {% data => {
    return new Nodes.NullNode(data[0][0].text, new ASTLocation(data[0][0].offset,data[0][0].offset+1))
}%}

# ----
# TAGS
# ----

tag_header -> %headertag %eol _ {% (data) => {
    return new Nodes.KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}

tag_data -> %datatag %eol {% (data) => {
    return new Nodes.KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}


tag_end_sec -> %endtag %eol {% (data) => {
    return new Nodes.KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}


tag_iso_open -> %isotag %eol {% first %}

tag_iso_close -> %isoclosetag %eol {% first %}


# ----
# BASICS
# ----

string -> single_quote_string | double_quote_string

double_quote_string -> %dblquote %string:? %dblquote {% data => { 
    return new Nodes.StringNode(data[1]?data[1].text:null, new ASTLocation(data[0].offset,data[2].offset + data[2].text.length)) 
}%}

single_quote_string -> %snglquote %string:? %snglquote {% data => { 
    return new Nodes.StringNode(data[1]?data[1].text:null, new ASTLocation(data[0].offset,data[2].offset + data[2].text.length)) 
}%}

comment -> %cmnt_strt (_ %cmnt_line):* _ %cmnt_end {% (data) =>  {
    return new Nodes.CommentNode(data[1],new ASTLocation(data[0].offset, data[3].offset + data[3].text.length))
} %}

enum_member -> "." %word "." {% data => { 
    return new Nodes.EnumMemberNode(data[1].value, new ASTLocation(data[0].offset, data[2].offset + data[2].text.length))
}%}

number -> "-":? (scinum | decimal | int) {% (data) => {
    let numAST = data[1][0]
    if(data[0]) numAST.value = -numAST.value
    return numAST
}%}

# Only positive numbers

scinum -> decimal %scisuff {% ([dec, suf]) => {
    let txt = dec.value + suf.value
    let num: number = +txt
    dec.value = num;
    dec.loc.end += suf.text.length
    return dec
}%}

decimal -> int "." int:? {% (data) => {
    let dec: string = data[2]? data[2].value : ""
    let text: string = data[0].value + "." + dec
    return new Nodes.NumberNode(parseFloat(text),new ASTLocation(data[0].loc.start,data[2]?data[2].loc.end:data[0].loc.end+1))
}%}

int -> %int {% ([token]) => new Nodes.NumberNode(parseFloat(token.value),new ASTLocation(token.offset,token.offset+token.text.length)) %}

_ -> null | %space {% function(d) { return null; } %}
