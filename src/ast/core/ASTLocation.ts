export class ASTLocation {
    start: number;
    end: number;
    /**
     * Constructs a new instance of AST Location.
    **/
    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}
