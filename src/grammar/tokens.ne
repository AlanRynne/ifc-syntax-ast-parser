@{%
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

%}