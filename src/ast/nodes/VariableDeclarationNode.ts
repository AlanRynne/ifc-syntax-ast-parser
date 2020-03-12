import { ASTType, ASTNode, ASTLocation } from "../index";

export class VariableDeclarationNode extends ASTNode {
    name: ASTNode;
    value: ASTNode;
    constructor(name: ASTNode, value: ASTNode, location: ASTLocation) {
        super(ASTType.Variable, location);
        this.name = name;
        this.value = value;
    }
}
