@{%
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

%}