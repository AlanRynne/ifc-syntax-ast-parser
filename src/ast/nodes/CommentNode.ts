import { ASTType, ASTNode, ASTLocation } from "../index";

export class CommentNode extends ASTNode {
    content: string;

    /**
     * Constructs a new ASTNode representing a constructor function
     * @param name Name node of the constructor
     * @param loc Location range of the constructor
     * @param args Argument nodes of the constructor
     */
    constructor(content: string, loc: ASTLocation) {
        super(ASTType.Comment, loc);
        this.content = content;
    }
}
