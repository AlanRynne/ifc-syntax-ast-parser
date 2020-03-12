import { ASTType, ASTNode, ASTLocation } from "../index";
export class SectionNode extends ASTNode {
    name: string;
    children: Array<ASTNode>;
    constructor(name: string, children: Array<ASTNode>, location: ASTLocation) {
        super(ASTType.Section, location);
        this.name = name;
        this.children = children;
    }
}
