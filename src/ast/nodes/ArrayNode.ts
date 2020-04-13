import { ASTType, ASTNode, ASTLocation } from "../index";

export class ArrayNode extends ASTNode {
    items: Array<ASTNode>;

    /**
     * Constructs a new ASTNode representing a constructor function
     * @param name Name node of the constructor
     * @param loc Location range of the constructor
     * @param args Argument nodes of the constructor
     */
    constructor(items: Array<ASTNode>, loc: ASTLocation) {
        super(ASTType.Array, loc);
        this.items = items;
    }
}
