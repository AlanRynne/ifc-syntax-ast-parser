import { ASTNode } from "../core/ASTNode";
import { StringNode } from "../nodes/StringNode";

export interface IVisitor {
    visit(node: IVisitable): any;
}

export interface IVisitable {
    accept(v: IVisitor): any;
}


export class ASTVisitor implements IVisitor {
    visit(node: ASTNode) {
        if (node instanceof StringNode) {
            console.log("String node:", node)
        } else {
            console.log("Other node:", node)
        }
    }
}