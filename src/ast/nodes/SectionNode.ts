import { ASTType, ASTNode, ASTLocation } from "../index";

export class SectionNode extends ASTNode {
    name: ASTNode;
    children: Array<ASTNode>;
    constructor(name: ASTNode, children: Array<ASTNode>, location: ASTLocation) {
        super(ASTType.Section, location);

        this.name = name;
        this.children = children;
    }
}
