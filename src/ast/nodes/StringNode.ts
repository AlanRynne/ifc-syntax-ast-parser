import { ASTType, ASTNode, ASTLocation } from "../index";

export class StringNode extends ASTNode {
    text: string

    /**
     * Constructs an AST String node
     * @param text 
    **/
    constructor(text: string, location: ASTLocation) {
        super(ASTType.String, location);
        this.text = text
    }
}

