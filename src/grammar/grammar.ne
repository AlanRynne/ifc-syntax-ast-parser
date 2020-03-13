@preprocessor typescript

@{% 
import { lexer } from './tokens'
import { first } from './functions'
import { DocumentNode, SectionNode, AssignmentNode, ConstructorNode, StringNode, NumberNode, EnumMemberNode, NullNode, VariableNode, FunctionNode, KeywordNode } from "@/ast/nodes";
import { ASTType, ASTNode, ASTLocation } from "@/ast/index";
%}

@lexer lexer


# ----
# MAIN
# ----

# Resolves the complete IFC file
main_section -> tag_iso_open _ header_section:? _ data_section:? _ tag_iso_close {% (data: any) => {
    return new DocumentNode(
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
header_section -> tag_header _ header_entities:? _ tag_end_sec {% (data) => {
    return new SectionNode(
        data[0],
        data[2],
        new ASTLocation(
            data[0].loc.start,
            data[4].loc.end
        )
    )
}%}


# Resolves a collection of header entities
header_entities -> header_entity:*


# Resolves a header entity declaration
header_entity -> %word %lparen header_inputs %rparen %eol {% (data) => {
    return new FunctionNode(
        data[0].value,
        data[2],
        new ASTLocation(data[1].offset,data[4].offset + data[4].text.length)
        )
}%}


# Unfolds the nested list of header inputs into a single list
header_inputs -> header_input _ (%separator _ header_input):* {% data => {
    var d = [data[0]]
    for(let i in data[2]){
        d.push(data[2][i][2])
    }
    return d;
} %}


# Resolves all valid header inputs (currently just strings?)
header_input -> %lparen:? string %rparen:? {% data =>  data[1] %}


# ----
# DATA SECTION
# ----


# Resolves the complete data section of the IFC file
data_section -> tag_data _ data_entities:? _ tag_end_sec {% (data) => {
    return new SectionNode(
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
    return new AssignmentNode(
        data[0],
        data[4],
        new ASTLocation(data[0].loc.start,data[6].offset + data[6].text.length)
        )
} %}


# Resolves an IFC constructor function
data_entity_constructor -> %word %lparen constructor_values %rparen {% (data) => {
    return new ConstructorNode(data[0].value,data[2],new ASTLocation(data[0].offset,data[3].offset + data[3].text.length))
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
    return new VariableNode(data[0].value,new ASTLocation(data[0].offset,data[0].offset+data[0].text.length))
}%}

null_node -> (%dollar | %star) {% data => {
    return new NullNode(data[0][0].text, new ASTLocation(data[0][0].offset,data[0][0].offset+1))
}%}

# ----
# TAGS
# ----

tag_header -> %headertag %eol _ {% (data) => {
    return new KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}

tag_data -> %datatag %eol {% (data) => {
    return new KeywordNode(
        data[0].value,
        new ASTLocation(
            data[0].offset, 
            data[1].offset + data[1].text.length))
} %}


tag_end_sec -> %endtag %eol {% (data) => {
    return new KeywordNode(
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


string -> %quote %string:? %quote {% data => { 
    return new StringNode(data[1]?data[1].text:null, new ASTLocation(data[0].offset,data[2].offset + data[2].text.length)) 
}%}


enum_member -> "." %word "." {% data => { 
    return new EnumMemberNode(data[1].value, new ASTLocation(data[0].offset, data[2].offset + data[2].text.length))
}%}


number -> ("-":? %number) ".":? {% (data) => { 
    var value = parseFloat(data[0].join(""));
    let start = data[0][0]? data[0][0].offset : data[0][1].offset
    let end = data[1]? data[1].offset + 1 : data[0][1].offset + data[0][1].text.length
    return new NumberNode(value, new ASTLocation(start, end))
}%}


_ -> null | %space {% function(d) { return null; } %}
