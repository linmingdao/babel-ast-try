const parser = require("@babel/parser");
const types = require("@babel/types");
const template = require("@babel/template");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");

const code = `
function square1(n) {
    console.log("result:", n * n);
}
function square(num) {
    console.log("result:", num * num);
    return num * num;
}
function square_2(n) {
    console.log("result:", n * n);
}
console.log(square(window.num));
`;

const ast = parser.parse(code);
// console.log(JSON.stringify(ast, null, 2));

traverse.default(ast, {
  FunctionDeclaration(path) {
    if (path.node.id.name === "square") {
      path.node.id.name = "execSquare";
    }
  },
  CallExpression(path) {
    if (path.node.callee.name === "square") {
      path.node.callee.name = "execSquare";
    }
  },
  Identifier(path) {
    // 变量需要为 num
    if (path.node.name !== "num") return;
    // 父级需要为函数
    if (path.parent.type !== "FunctionDeclaration") return;
    // 函数名需要为 square
    if (path.parent.id.name !== "execSquare") return;

    // 找到对应的引用
    const referencePaths = path.scope.bindings["num"].referencePaths;
    // 修改引用值
    referencePaths.forEach((path) => (path.node.name = "number"));
    // 修改自身的值
    path.node.name = "number";
  },
});

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
