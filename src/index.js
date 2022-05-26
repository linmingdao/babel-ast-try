const parser = require("@babel/parser");
const types = require("@babel/types");
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
  Identifier(path) {
    // 变量需要为 num
    if (path.node.name !== "num") return;
    // 父级需要为函数
    if (path.parent.type !== "FunctionDeclaration") return;
    // 函数名需要为 square
    if (path.parent.id.name !== "square") return;

    // 找到对应的引用
    const referencePaths = path.scope.bindings["num"].referencePaths;
    // 修改引用值
    referencePaths.forEach((path) => (path.node.name = "number"));
    // 修改自身的值
    path.node.name = "number";
  },
  //   FunctionDeclaration(path) {
  //     if (path.node.id.name === "square") {
  //       const referencePaths = path.scope.bindings["square"].references;
  //       console.log(referencePaths);
  //       // 修改引用值
  //       //   referencePaths.forEach((path) => (path.node.name = "execSquare"));
  //       //   path.node.id.name = "execSquare";
  //     }
  //   },
  //   enter(path) {
  //     // console.log(JSON.stringify(path, null, 2));
  //     // console.log(path.node.type);
  //     if (
  //       path.parent.type === "FunctionDeclaration" &&
  //       path.parent.id.name === "square1" &&
  //       path.isIdentifier({ name: "n" })
  //     ) {
  //     //   console.log(path.parent.type);
  //       path.node.name = "x";
  //     }
  //   },
  //   FunctionDeclaration(path) {
  //     // console.log(path.node.type);
  //     if (path.node.id.name === "square1") {
  //       // console.log(path.node);
  //       // path.node.name = "x";
  //       // path.node.params[0].name = "x";
  //     }
  //   },
});

const newCode = generator.default(ast, {}, code);

console.log(newCode.code);
