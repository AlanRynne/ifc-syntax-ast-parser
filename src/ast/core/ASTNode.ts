import { IVisitor, IVisitable } from "../visitor/ASTVisitor.js";
import { ASTType } from "./ASTType";
import { ASTLocation } from "./ASTLocation"


export class ASTNode implements IVisitable {

    type: ASTType
    loc: ASTLocation

    /**
     * Constructs a Base AST Node
    **/
    constructor(type: ASTType, location: ASTLocation) {
        this.type = type
        this.loc = location

    }

    public accept(v: IVisitor): void {
        v.visit(this)
    }
}
