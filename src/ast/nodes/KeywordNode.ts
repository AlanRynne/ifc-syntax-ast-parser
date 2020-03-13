import { ASTType, ASTNode, ASTLocation } from "../index";
import { IVisitor } from "../visitor/IVisitor";

export class KeywordNode extends ASTNode {

    text: string

    /**
     * Constructs an AST String node
     * @param text 
    **/
    constructor(text: string, location: ASTLocation) {
        super(ASTType.Keyword, location);
        this.text = text
    }

    public accept(v: IVisitor) {
        v.visit(this)
    }
}

