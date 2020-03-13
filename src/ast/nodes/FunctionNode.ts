import { ASTType, ASTNode, ASTLocation } from "../index";

export class FunctionNode extends ASTNode {
    name: ASTNode;
    args: Array<ASTNode>;

    /**
     * Constructs a new ASTNode representing a constructor function
     * @param name Name node of the constructor
     * @param loc Location range of the constructor
     * @param args Argument nodes of the constructor
     */
    constructor(name: ASTNode, args: Array<ASTNode>, loc: ASTLocation) {
        super(ASTType.Function, loc);
        this.name = name;
        this.args = args;
    }
}
