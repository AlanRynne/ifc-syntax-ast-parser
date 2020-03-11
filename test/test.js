const nearley = require("/usr/local/lib/node_modules/nearley");
const grammar = require("../src/index");
const fs = require('fs')

var content = fs.readFileSync("examples/TestIFC-001.ifc", "utf8");
let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
parser.feed(content);
writeToPath(parser.results, 'test/out/ast.json');


// Helper functions

function writeToPath(jsObj, path) {
  fs.writeFile(
    path,
    JSON.stringify(jsObj, null, 4),
    (err) => {
      // In case of a error throw err. 
      if (err) throw err;
    })
}