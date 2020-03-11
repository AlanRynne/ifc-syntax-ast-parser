import fs from 'fs'
import * as nearley from 'nearley'
import ifcGrammar from './grammar/ifc' // Nearley generated file, not commited to source code!!


var content = fs.readFileSync("examples/TestIFC-001.ifc", "utf8");

const ifcParser = new nearley.Parser(nearley.Grammar.fromCompiled(ifcGrammar))

ifcParser.feed(content)

writeToPath(ifcParser.results, './results/ast.json');


function writeToPath(jsObj: any, path: string) {
    fs.writeFile(
        path,
        JSON.stringify(jsObj, null, 4),
        (err) => {
            // In case of a error throw err. 
            if (err) throw err;
        })
}