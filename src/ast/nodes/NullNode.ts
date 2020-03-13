import { ASTType, ASTNode, ASTLocation } from "../index";
import { IVisitor } from "../visitor/IVisitor";

export class NullNode extends ASTNode {

    value: string

    /**
     * Constructs an AST String node
     * @param text 
    **/
    constructor(value: string, location: ASTLocation) {
        super(ASTType.Null, location);
        this.value = value
    }

    public accept(v: IVisitor) {
        v.visit(this)
    }
}

