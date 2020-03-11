import { ASTVisitor } from "./ASTVisitor.js";

export class ASTNode {
  constructor (type, children) {
    this.type = type
    this.children = children
  }
  visit() {
  }
}
