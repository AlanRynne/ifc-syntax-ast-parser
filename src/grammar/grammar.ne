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
main_section -> tag_iso_open _ header_section _ data_section _ tag_iso_close {% (data: any) => {
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
        data[2],
        new ASTLocation(
            data[0].loc.start,
            data[4].loc.end
        )
    )
}%}


# Resolves a collection of header entities
header_entities -> header_entity (_ header_entity):* {% (data) => {
    var d = [data[0]]
    for(let i in data[1]){
        d.push(data[1][i][1])
    }
    return d;
}%}


# Resolves a header entity declaration
header_entity -> comment _ newline {% first %} 
                | %word _ %lparen newline:? _ header_inputs _ %rparen %eol newline {% (data) => {
                        return new Nodes.FunctionNode(
                            data[0].value,
                            data[5],
                            new ASTLocation(data[2].offset,data[7].offset + data[7].text.length)
                            )
                    }%}


# Unfolds the nested list of header inputs into a single list
header_inputs -> header_input (spls:? _ %separator spls:? _ header_input):* {% data => {
    var d = [data[0]]
    for(let i in data[1]){
        d = d.concat(data[1][i][5])
    }
    return d;
} %}

header_input -> singleline_cmnt _ header_input_raw {% (data) => [data[0],data[2]] %}
                | header_input_raw {% first %}

# Resolves all valid header inputs (currently just strings?)
# TODO: Fix resolver
header_input_raw -> %lparen spls:? _ header_input (spls:? _ %separator spls:? _ header_input):* spls:? _ %rparen 
                    | null_node {% first %}
                    | string {% first %}


# One or many lines with leading space
spls -> spl:+
# Line char with leading space
spl -> _ %newline

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
data_entity -> var _ %assign _ data_entity_constructor %eol (_ singleline_cmnt):? _ newline {% (data) => {
    return new Nodes.AssignmentNode(
        data[0],
        data[4],
        new ASTLocation(data[0].loc.start,data[5].offset + data[5].text.length)
    )
} %} | comment _ newline


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
constructor_value -> singleline_cmnt _ constructor_value_raw | constructor_value_raw
# TODO: i thinks the memory leak is the circular reference between constructor_values and constructor_value
# TODO: Check solution in head and do the same (step by step rules)
# Resolves all valid values inside a constructor
constructor_value_raw -> (  null_node 
                            | string
                            | var 
                            | enum_member 
                            | number 
                            | data_entity_constructor 
                         ) {% (data) => data[0][0] %}
                        |%lparen constructor_values %rparen {% (data) => data[1] %}
                     

var -> %ref {% data => {
    return new Nodes.VariableNode(data[0].value,new ASTLocation(data[0].offset,data[0].offset+data[0].text.length))
}%}

null_node -> (%dollar | %star) {% data => {
    return new Nodes.NullNode(data[0][0].text, new ASTLocation(data[0][0].offset,data[0][0].offset+1))
}%}

# ----
# TAGS
# ----

tag_header -> %headertag %eol newline {% (data) => {
    return new Nodes.KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}

tag_data -> %datatag %eol newline {% (data) => {
    return new Nodes.KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}


tag_end_sec -> %endtag %eol newline {% (data) => {
    return new Nodes.KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}


tag_iso_open -> %isotag %eol newline {% first %}

tag_iso_close -> %isoclosetag %eol newline {% first %}


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

comment -> multiline_cmnt | singleline_cmnt {% first %}
# {% (data) =>  {
#     let commnt = data[1].map(val => val[0].text ? val[0].text + val[1].text : val[1].text).join('')
#     return new Nodes.CommentNode(commnt,new ASTLocation(data[0].offset, data[3].offset + data[3].text.length))
# } %}

multiline_cmnt -> %cmnt_strt newline (cmnt_content newline):* %cmnt_end

singleline_cmnt -> %cmnt_strt _ cmnt_content _ %cmnt_end {% (data) => {
    return new Nodes.CommentNode(
        data[2],
        new ASTLocation(data[0].offset, data[4].offset + data[4].text.length)
    )
} %}

cmnt_content -> %cmnt_line (_ %cmnt_line):* {%
    (data) => {
        var d = [data[0].text]
        for(let i in data[1]){
            if(data[1][i][0] == null) d.push(' ')
            d.push(data[1][i][1].text)
        }
        return d.join('');
    }
%}

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

int -> %int 
{% 
    ([token]) => new Nodes.NumberNode(parseFloat(token.value),new ASTLocation(token.offset,token.offset+token.text.length)) 
%}


newline -> %newline (_ %newline):*
_ -> null | %space:+ {% function(d) { return null; } %} 
