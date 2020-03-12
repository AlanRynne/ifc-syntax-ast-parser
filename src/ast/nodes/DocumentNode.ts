import { ASTType, ASTNode, ASTLocation } from "@/ast/index";

export class DocumentNode extends ASTNode {
    version: string;
    header: any;
    data: any;
    constructor(version: string, header: any, data: any, location: ASTLocation) {
        super(ASTType.Document, location);
        this.version = version;
        this.header = header;
        this.data = data;
    }
}


