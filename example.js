const {json2ast, ast2json, transform} = require ('./index.js');

const json = {
  hello1: 'hello world',
  hello2: ['hello', 2, true],
  hellonested: {
    nested1: 'nested',
    nested2: ['world', 7, false],
  },
};

const ast = json2ast (json);
const json2 = ast2json (ast);

console.log ('JSON => AST => JSON');
console.log ('ORIGINAL: %O', json);
console.log ('AST: %O', ast);
console.log ('COPY: %O', json2);
console.log ('-------------------');

function pluginKeyReverse (api) {
  return {
    [api.AstType.key]: node => {
      node.value.value = node.value.value.split ('').reverse ().join ('');
    },
  };
}
function pluginNotBoolean (api) {
  return {
    [api.AstType.boolean]: node => {
      node.value = !node.value;
    },
  };
}

const result = transform (json, [pluginKeyReverse, pluginNotBoolean]);
console.log ('TRANSFORM:');
console.log ('ORIGINAL: %O', json);
console.log ('NEW JSON: %O', result.json);
console.log ('NEW AST: %O', result.ast);
console.log ('-------------------');
