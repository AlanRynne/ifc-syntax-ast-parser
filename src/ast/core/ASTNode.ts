import { IVisitable } from "../visitor/IVisitable";
import { IVisitor } from "../visitor/IVisitor";
import { ASTType } from "./ASTType";
import { ASTLocation } from "./ASTLocation"


export class ASTNode implements IVisitable {

    readonly type: ASTType
    readonly loc: ASTLocation
    comment?: ASTNode
    errors?: Error[]

    /**
     * Constructs a Base AST Node
    **/
    constructor(type: ASTType, location: ASTLocation) {
        this.type = type
        this.loc = location

    }

    /** 
     * Visiting pattern method
    **/
    public accept(v: IVisitor): void {
        v.visit(this)
    }
}
