import { ASTNode } from "../core/ASTNode";
import { StringNode } from "../nodes/StringNode";
import { IVisitor } from "./IVisitor";
import { ConstructorNode, AssignmentNode, DocumentNode, EnumMemberNode, FunctionNode, KeywordNode, NullNode, NumberNode, SectionNode, VariableNode } from "../nodes";

export class ASTVisitor implements IVisitor {
    visit(node: ASTNode): void {
        if (node instanceof AssignmentNode) {
            console.log(node.type)
        } else if (node instanceof ConstructorNode) {
            console.log(node.type)
        } else if (node instanceof DocumentNode) {
            console.log(node.type)
            node.sections.forEach(sec => sec.accept(this))
        } else if (node instanceof EnumMemberNode) {
            console.log(node.type)
        } else if (node instanceof FunctionNode) {
            console.log(node.type)
        } else if (node instanceof KeywordNode) {
            console.log(node.type)
        } else if (node instanceof NullNode) {
            console.log(node.type)
        } else if (node instanceof NumberNode) {
            console.log(node.type)
        } else if (node instanceof SectionNode) {
            console.log(node.type)
        } else if (node instanceof StringNode) {
            console.log(node.type)
        } else if (node instanceof VariableNode) {
            console.log(node.type)
        } else {
            console.log("Other node:", node)
        }
    }
}