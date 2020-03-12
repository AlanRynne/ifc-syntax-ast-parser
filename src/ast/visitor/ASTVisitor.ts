import { ASTNode } from "../core/ASTNode";
import { StringNode } from "../nodes/StringNode";
import { IVisitor } from "./IVisitor";

export class ASTVisitor implements IVisitor {
    visit(node: ASTNode) {
        if (node instanceof StringNode) {
            console.log("String node:", node)
        } else {
            console.log("Other node:", node)
        }
    }
}