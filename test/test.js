const nearley = require("/usr/local/lib/node_modules/nearley");
const grammar = require("../out/ifcGrammar");
const fs = require('fs')
const readline = require('readline');


let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
let arr = [];
const rl = readline.createInterface({
  input: fs.createReadStream('examples/Model_002.ifc'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  // console.log(line);
  parser.feed(line);
  if (parser.results.length != 0) {
    arr.push(parser.results[0][0]);
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  } else if (parser.results.length != 0) {
    console.log("AMBIGUOUS LINE! Line" + line);
  } else {
    console.log('NO MATCH FOUND! Line' + line);
  }
});

rl.on('close', () => {
  console.log(`Closed`);
  writeToPath(arr, 'test/out/testIFC2.json');
  linkReferences(arr);
});
// Create a Parser object from our grammar.

// Parse something!
// parser.feed(text);


// Write data in 'Output.txt' . 

function filterIFC(name) {
  let ifcObject = arr.find((data) => data.name = name);
  console.log(JSON.stringify(ifcObject));
}

// Helper functions

function linkReferences(expressObject) {
  expObj = expressObject.slice([0]);
  expObj.forEach(element => {
    if (element.type == "ifcEntity" && element.input) {
      element.isReferenced = false;
      let newInput = [];
      element.input.forEach(inputObj => {
        if (inputObj.type == "ifcRef") {
          expObj.find(element => element.ref == inputObj.value).isReferenced = true;
          newInput.push(expObj.find(element => element.ref == inputObj.value));
        }
        else if (inputObj.type == "dollar") {
          newInput.push(null);
        } else if (inputObj.type == "string") {
          newInput.push(inputObj.value);
        } else if (inputObj.type == "number") {
          newInput.push(inputObj.value);
        }
        else if (Array.isArray(inputObj)) {
          console.log("array found");
          let newInputArr = [];
          inputObj.forEach(arrayElement => {
            if (arrayElement.type == "ifcRef") {
              let refArrObj = expObj.find(element => element.ref == arrayElement.value);
              refArrObj.isReferenced = true;
              newInputArr.push(refArrObj);
            } else if (arrayElement.type == "dollar") {
              newInputArr.push(null);
            } else if (arrayElement.type == "string") {
              newInputArr.push(arrayElement.value);
            } else if (arrayElement.type == "number") {
              newInputArr.push(arrayElement.value);
            } else {
              newInputArr.push(arrayElement);
            }
          });
          newInput.push(newInputArr);
          // newInput.push(inputObj);
        } else {
          newInput.push(inputObj);
        }
      })
      element.input = newInput;
    }
  });
  // expObj = expObj.filter(element => element.isReferenced == false);
  // writeToPath(expObj, 'ifcParser/out/unreferenced.json');
}

function valueCheck(arrayElement, expObj, element) {
  if (arrayElement.type == "ifcRef") {
    let refArrObj = expObj.find(element => element.ref == arrayElement.value);
    refArrObj.isReferenced = true;
    newInputArr.push(refArrObj);
  } else if (arrayElement.type == "dollar") {
    newInputArr.push(null);
  } else if (arrayElement.type == "string") {
    newInputArr.push(arrayElement.value);
  } else if (arrayElement.type == "number") {
    newInputArr.push(arrayElement.value);
  } else if (Array.isArray(inputObj)) {
    newInputArr.push(processArray(inputObj));
  }
  else {
    newInputArr.push(arrayElement);
  }
}

function processArray(array) {
  let newInputArr = [];
  array.forEach(arrayElement => {
    if (arrayElement.type == "ifcRef") {
      let refArrObj = expObj.find(element => element.ref == arrayElement.value);
      refArrObj.isReferenced = true;
      newInputArr.push(refArrObj);
    } else if (arrayElement.type == "dollar") {
      newInputArr.push(null);
    } else if (arrayElement.type == "string") {
      newInputArr.push(arrayElement.value);
    } else if (arrayElement.type == "number") {
      newInputArr.push(arrayElement.value);
    } else if (Array.isArray(inputObj)) {
      newInputArr.push(processArray(inputObj));
    }
    else {
      newInputArr.push(arrayElement);
    }
    newInput.push(newInputArr);
  });
  return newInputArr;
}
function writeToPath(jsObj, path) {
  fs.writeFile(
    path,
    JSON.stringify(jsObj, null, 4),
    (err) => {
      // In case of a error throw err. 
      if (err) throw err;
    })
}