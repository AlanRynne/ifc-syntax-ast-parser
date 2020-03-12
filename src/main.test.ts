import fs from 'fs'
import readline from 'readline';
import ifcGrammar from './main'
import * as nearley from 'nearley'



describe('Unambiguity test', function () {
    it('TestIFC-001.ifc', () => mainIfcParserTest("examples/TestIFC-001.ifc", "./results/ast-testifc.json"))
    it('Model_001.ifc', () => mainIfcParserTest("examples/Model_001.ifc", "./results/ast-testifc.json"))
    it('Model_002.ifc', () => mainIfcParserTest("examples/Model_002.ifc", "./results/ast-testifc.json"))
})

describe('Line by line unambiguous test', () => {
    it('TestIFC-001', () => {
        return ParseIFCLineByLine("examples/TestIFC-001.ifc", "./results/ast-testifc.json")
            .then((results) =>
                expect(results.length).toBe(1))
    });
    it('Model_001', () => {
        return ParseIFCLineByLine("examples/Model_001.ifc", "./results/ast-testifc.json")
            .then((results) =>
                expect(results.length).toBe(1))
    });
    it('Model_002', () => {
        return ParseIFCLineByLine("examples/Model_002.ifc", "./results/ast-testifc.json")
            .then((results) =>
                expect(results.length).toBe(1))
    });
})

function mainIfcParserTest(path: string, outPath: string) {
    console.time('alltext');
    var content = fs.readFileSync(path, "utf8");
    const ifcParser = new nearley.Parser(nearley.Grammar.fromCompiled(ifcGrammar), { keepHistory: true })
    ifcParser.feed(content)
    console.timeEnd('alltext')
    writeToPath(ifcParser.results, outPath);
    expect(ifcParser.results.length).toBe(1);
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
async function ParseIFCLineByLine(path: string, outPath: string): Promise<any> {
    return readLines(path)
}

async function readLines(path: string): Promise<any> {
    const stream = fs.createReadStream(path)
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    const ifcParser = new nearley.Parser(nearley.Grammar.fromCompiled(ifcGrammar))

    return new Promise<boolean>(resolve => {
        stream.once('error', _ => resolve(false))
        rl.on('open', _ => console.time('byline'))
        rl.on('line', line =>
            ifcParser.feed(line)
        );

        rl.on('close', _ => {
            console.timeEnd('byline')
            resolve(ifcParser.results)
        }
        );
    });
}