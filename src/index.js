const parser = require("@babel/parser");
const types = require("@babel/types");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");

// console.log("result:", n * n);
const code = `function square() {
    console.log("result:");
}`;

const ast = parser.parse(code);
// console.log(JSON.stringify(ast, null, 2));

traverse.default(ast, {
  enter(path) {
    // console.log(JSON.stringify(path, null, 2));
    console.log(path.node.type);
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});

const newCode = generator.default(ast, {}, code);

console.log(newCode.code);
