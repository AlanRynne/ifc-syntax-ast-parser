import { ASTType, ASTNode, ASTLocation } from "../index";
import { IVisitor } from "../visitor/IVisitor";

export class NumberNode extends ASTNode {

    value: number

    /**
     * Constructs an AST String node
     * @param text 
    **/
    constructor(value: number, location: ASTLocation) {
        super(ASTType.Number, location);
        this.value = value
    }

    public accept(v: IVisitor) {
        v.visit(this)
    }
}

