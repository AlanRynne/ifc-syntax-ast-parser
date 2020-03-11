import { IVisitor, IVisitable } from "./ASTVisitor.js";

export class ASTNode implements IVisitable {
    accept(v: IVisitor) {
        throw new Error("Method not implemented.");
    }

}
