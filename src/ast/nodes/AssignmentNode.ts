import { ASTType, ASTNode, ASTLocation } from "../index";

export class AssignmentNode extends ASTNode {

    name: ASTNode;
    value: ASTNode;

    constructor(name: ASTNode, value: ASTNode, location: ASTLocation) {
        super(ASTType.Assignment, location);
        this.name = name;
        this.value = value;
    }
}
