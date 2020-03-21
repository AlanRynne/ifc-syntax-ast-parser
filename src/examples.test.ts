
import path from 'path';
import dir from 'node-dir';

const directory = "examples"
var files = dir.files(directory, { sync: true })
var ifcFiles = files.filter((file) => path.extname(file) === ".ifc")


describe("IFC test files", () => {
    ifcFiles.forEach((file) => {
        it(path.relative(directory, file), () => {
            console.log(file)
            expect(true).toBe(true)
        })
    })
});