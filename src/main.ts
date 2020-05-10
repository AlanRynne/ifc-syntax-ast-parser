import ifcGrammar from './grammar/ifc' // Nearley generated file, not commited to source code!!
import * as nearley from 'nearley'
import { ASTNode } from './ast';
import { DocumentNode } from './ast/nodes';

// The compiled nearley grammar
export default ifcGrammar;

// The class that does all the heavy lifting.
export class Ifc2Ast {
 
    private lastState: any
    private parser: any

    constructor() {
        this.reset()
    }

    public reset() {
        this.lastState = null
        this.parser = new nearley.Parser(ifcGrammar, { keepHistory: true })
    }

    public parseIfcFile(
        lines: string[],
        addTrailingNewLine: boolean,
    ) {
        return new Promise<DocumentNode>((resolve, reject) => {
            lines.forEach(line => {
                try {
                    let txt = addTrailingNewLine ? line + '\n' : line
                    this.parser.feed(txt)
                    this.lastState = this.parser.save()
                } catch (error) {
                    reject(error)
                }
            })
            resolve(this.parser.results[0])
        })
    }
}