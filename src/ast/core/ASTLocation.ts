export class ASTLocation {
    start: number;
    startLine?: number
    end: number;
    endLine?: number
    /**
     * Constructs a new instance of AST Location.
    **/
    constructor(start: number, end: number, startLine?: number, endLine?: number) {
        this.start = start;
        this.end = end;
        this.startLine = startLine
        this.endLine = endLine != startLine ? endLine : undefined
    }
}
