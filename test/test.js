const nearley = require("/usr/local/lib/node_modules/nearley");
const grammar = require("../src/index");
const fs = require('fs')
// const readline = require('readline');


let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
// let arr = [];

let ifc = `ISO-10303-21;
HEADER;
ENDSEC;
DATA;
#1=IFCPERSON($,$,'Name',$,$,$,$,$);
#2=IFCORGANIZATION($,'Org',$,$,$);
#3=IFCPERSONANDORGANIZATION(#1,#2,$);
ENDSEC;
END-ISO-10303-21;`

parser.feed(ifc);
console.log(parser.results)
writeToPath(parser.results[0], 'test/out/ast.json');


// const rl = readline.createInterface({
//   input: fs.createReadStream('examples/TestIFC-001.ifc'),
//   crlfDelay: Infinity
// });

// rl.on('line', (line) => {
//   // console.log(line);
//   parser.feed(line);
//   if (parser.results.length != 0) {
//     arr.push(parser.results[0]);
//     parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
//   } else if (parser.results.length != 0) {
//     console.log("AMBIGUOUS LINE! Line: " + line);
//   } else {
//     console.log('NO MATCH FOUND! Line: ' + line);
//   }
// });

// rl.on('close', () => {
//   console.log(`Closed`);
//   writeToPath(arr, 'test/out/testIFC-001.json');
// });

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