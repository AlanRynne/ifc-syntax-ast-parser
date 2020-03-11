import { ASTNode } from "./ASTNode";

export interface IVisitor {
    visit(node: ASTNode): any;
}

export interface IVisitable {
    accept(v: IVisitor): any;
}


export class ASTVisitor implements IVisitor {
    visit(node: ASTNode) {
        throw new Error("Method not implemented.");
    }
}