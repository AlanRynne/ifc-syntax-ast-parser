import fs from 'fs'
import readline from 'readline'
import dir from 'node-dir'
import * as nearley from 'nearley'
import path from 'path'
import ifcGrammar from './main'
import { ASTVisitor } from "./ast/visitor/ASTVisitor";


const INDIR = "examples"
const OUTDIR = "results"

var files = dir.files(INDIR, { sync: true })
var ifcFiles = files.filter((file) => path.extname(file) === ".ifc")

describe("IFC files", () => {
    ifcFiles.forEach((file) => {
        let name = path.basename(file, ".ifc")
        let outFile = path.join(OUTDIR, name) + ".json"
        it(file, async () => {
            const results = await ParseIFCLineByLine(file, outFile);
            return expect(results.length).toBe(1);
        })
    })
});

function mainIfcParserTest(path: string, outPath: string) {
    console.time('alltext');
    var content = fs.readFileSync(path, "utf8");
    const ifcParser = new nearley.Parser(nearley.Grammar.fromCompiled(ifcGrammar), { keepHistory: true })
    ifcParser.feed(content)
    console.timeEnd('alltext')
    writeToPath(ifcParser.results, outPath);
    let v = new ASTVisitor()
    v.visit(ifcParser.results[0])
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
export async function ParseIFCLineByLine(path: string, outPath: string): Promise<any> {
    return readLines(path, outPath)
}

async function readLines(path: string, outPath: string): Promise<any> {
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
            writeToPath(ifcParser.results, outPath);
            resolve(ifcParser.results)
        });
    });
}