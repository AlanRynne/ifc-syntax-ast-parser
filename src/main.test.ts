import fs from 'fs'
import dir from 'node-dir'
import path from 'path'
import readline from 'readline'
import { Ifc2Ast } from './main'
import { DocumentNode } from './ast/nodes'


const INDIR = "examples"
const OUTDIR = "results"

var files = dir.files(INDIR, { sync: true })
var ifcFiles = files.filter((file) => path.extname(file) === ".ifc")

describe("IFC files line by line", () => {
    ifcFiles.forEach((file) => {
        it(file, async () => {
            const results = await readLines(file);
            return expect(results).toBeInstanceOf(DocumentNode);
        }, 10000)
    })
});

async function readLines(path: string) {
    const stream = fs.createReadStream(path)
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    let lines = await new Promise<string[]>((resolve, reject) => {
        let lines: string[] = []
        stream.once('error', (err) => reject(err))
        rl.on('line', (line) => {
            lines.push(line)
        });
        rl.on('close', _ => {
            console.timeEnd('byline')
            resolve(lines)
        });
    })
    let astParser = new Ifc2Ast()
    return astParser.parseIfcFile(lines, true)
        .then((node) => {
            return node
        }).catch((err) => {
            throw err
        })
}