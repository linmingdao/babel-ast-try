const parser = require("@babel/parser");
const types = require("@babel/types");
const template = require("@babel/template");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");

const code = `
function square(n) {
  return n * n;
}
`;

const ast = parser.parse(code);

const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramName) {
      path.node.name = "x";
    }
  },
};

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = "x";
    path.traverse(updateParamNameVisitor, { paramName });
  },
};

traverse.default(ast, MyVisitor);

const newCode = generator.default(
  ast,
  {
    retainLines: false,
    compact: "auto",
    concise: false,
    quotes: "double",
  },
  code
);

console.log(newCode.code);
