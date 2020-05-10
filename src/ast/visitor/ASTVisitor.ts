import { ASTNode } from "../core/ASTNode";
import { IVisitor } from "./IVisitor";
import * as nodes from "../nodes";
import { ASTPosition } from '../core/ASTPosition';

export class ASTDefinitionFinderVisitor implements IVisitor {

    visit(node: ASTNode, refNum: number): any {
        if (node instanceof nodes.AssignmentNode) {
            if (node.name.accept(this, refNum) == true)
                return node
        } else if (node instanceof nodes.DocumentNode) {
            let secs: any[] = []
            node.sections.forEach(sec => {
                let sectionResult = sec.accept(this, refNum)
                if (sectionResult) secs.push(...sectionResult)
            })
            return secs
        } else if (node instanceof nodes.VariableNode) {
            if (node.id == refNum) {
                return true
            }
        } else if (node instanceof nodes.SectionNode) {
            let keyword = node.name.accept(this, refNum)
            if (keyword == "DATA") {
                let result: any[] = []
                node.children.forEach(child => {
                    let d = child.accept(this, refNum)
                    if (d) result.push(d)
                })
                return result
            }
        } else {
            console.log("Other node: " + node.constructor.name)
        }
    }
}

export class ASTDefinitionVisitor implements IVisitor {

    visit(node: ASTNode): nodes.AssignmentNode[] | void {
        if (node instanceof nodes.AssignmentNode) {
            return [node]
        } else if (node instanceof nodes.DocumentNode) {
            let secs: any[] = []
            node.sections.forEach(sec => {
                let sectionResult = sec.accept(this)
                if (sectionResult) secs.push(...sectionResult)
            })
            return secs
        } else if (node instanceof nodes.SectionNode) {
            let name: any = node.name
            if (name.text == "DATA") {
                let result: any[] = []
                node.children.forEach(child => {
                    let d = child.accept(this)
                    if (d) result.push(...d)
                })
                return result
            }
        } else {
            // console.log("Other node: " + node.constructor.name)
        }
    }
}
export class ASTPositionVisitor implements IVisitor {
    visit(node: ASTNode, position: ASTPosition): any {
        if (node.loc.contains(position))
            if (node instanceof nodes.AssignmentNode) {
                if (node.name.accept(this, position) == true)
                    return node
            } else if (node instanceof nodes.DocumentNode) {
                node.loc.contains(position)
                let secs: any[] = []
                node.sections.forEach(sec => {
                    let sectionResult = sec.accept(this, position)
                    if (sectionResult) secs.push(...sectionResult)
                })
                return secs
            } else if (node instanceof nodes.VariableNode) {

            } else if (node instanceof nodes.KeywordNode) {
                return node.text
            } else if (node instanceof nodes.SectionNode) {
                let keyword = node.name.accept(this, position)
                if (keyword == "DATA") {
                    let result: any[] = []
                    node.children.forEach(child => {
                        let d = child.accept(this, position)
                        if (d) result.push(d)
                    })
                    return result
                }
            } else {
                console.log("Other node: " + node.constructor.name)
            }
    }
}