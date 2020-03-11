import fs from 'fs'
import ifcGrammar from './index'
import * as nearley from 'nearley'

describe('Unambiguity test', function () {
    it('TestIFC-001.ifc', () => mainIfcParserTest("examples/TestIFC-001.ifc", "./results/ast-testifc.json"))
    it('Model_001.ifc', () => mainIfcParserTest("examples/Model_001.ifc", "./results/ast-testifc.json"))
    it('Model_002.ifc', () => mainIfcParserTest("examples/Model_002.ifc", "./results/ast-testifc.json"))
})

function mainIfcParserTest(path: string, outPath: string) {
    var content = fs.readFileSync(path, "utf8");
    const ifcParser = new nearley.Parser(nearley.Grammar.fromCompiled(ifcGrammar))
    ifcParser.feed(content)
    expect(ifcParser.results.length).toBe(1);
    writeToPath(ifcParser.results, outPath);
}

function writeToPath(jsObj: any, path: string) {
    fs.writeFile(
        path,
        JSON.stringify(jsObj, null, 4),
        (err) => {
            // In case of a error throw err. 
            if (err) throw err;
        })
}