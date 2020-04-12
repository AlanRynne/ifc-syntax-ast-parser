import fs from 'fs'
import * as nearley from 'nearley'
import dir from 'node-dir'
import path from 'path'
import readline from 'readline'
import { ASTVisitor } from "./ast/visitor/ASTVisitor"
import ifcGrammar from './main'


const INDIR = "examples"
const OUTDIR = "results"

var files = dir.files(INDIR, { sync: true })
var ifcFiles = files.filter((file) => path.extname(file) === ".ifc")

describe("IFC files line by line", () => {
    ifcFiles.forEach((file) => {
        let name = path.basename(file, ".ifc")
        let outFile = path.join(OUTDIR, name) + ".json"
        it(file, async () => {
            const results = await ParseIFCLineByLine(file, outFile);
            return expect(results.length).toBe(1);
        }, 10000)
    })
});

// describe("IFC files as string", () => {
//     ifcFiles.forEach((file) => {
//         let name = path.basename(file, ".ifc")
//         let outFile = path.join(OUTDIR, name) + ".json"
//         it(file, async () => {
//             const results = await ParseIFCLineByLine(file, outFile);
//             return expect(results.length).toBe(1);
//         }, 10000)
//     })
// });

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
    let currLine = 1;
    const stream = fs.createReadStream(path)
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    const ifcParser = new nearley.Parser(ifcGrammar, { keepHistory: true })
    let lastState = ifcParser.save()
    return new Promise<boolean>(resolve => {
        stream.once('error', _ => resolve(false))

        rl.on('line', (line) => {
            // line.trim()
            // If feeding fails, roll back
            try {
                // if (ifcParser.lexerState) {
                //     ifcParser.lexerState.line = currLine
                //     ifcParser.lexerState.col = 0
                //     lastState = ifcParser.save()
                // }
                ifcParser.feed(line + '\n')
                // if (ifcParser.lexerState.line != currLine) throw new Error('Error counting line numbers!!')
                // console.log('line', ifcParser.lexerState.line)
                lastState = ifcParser.save()
            } catch (error) {
                console.error(`Error on file ${path} line ${currLine}`, error.message)
                throw error
                ifcParser.restore(lastState)
            }
            currLine++
        });

        rl.on('close', _ => {
            console.timeEnd('byline')
            writeToPath(ifcParser.results, outPath);
            resolve(ifcParser.results)
        });
    });
}