Amorph [![Build Status](https://travis-ci.org/YaroslavGaponov/amorph.svg?branch=master)](https://travis-ci.org/YaroslavGaponov/amorph)
=======================
Convert JSON to AST, AST to JSON and transformation


# Example  #1 [example.js]

```javascript
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

```

```bash
[gap@localhost amorph]$ npm run demo

> amorph@0.0.1 demo /home/gap/projects/amorph
> node ./example.js

JSON => AST => JSON
ORIGINAL: { hello1: 'hello world',
  hello2: [ 'hello', 2, true ],
  hellonested: { nested1: 'nested', nested2: [ 'world', 7, false ] } }
AST: { type: 'object',
  value: 
   [ { type: 'pair', value: [Array] },
     { type: 'pair', value: [Array] },
     { type: 'pair', value: [Array] } ] }
COPY: { hello1: 'hello world',
  hello2: [ 'hello', 2, true ],
  hellonested: { nested1: 'nested', nested2: [ 'world', 7, false ] } }
-------------------
TRANSFORM:
ORIGINAL: { hello1: 'hello world',
  hello2: [ 'hello', 2, true ],
  hellonested: { nested1: 'nested', nested2: [ 'world', 7, false ] } }
NEW JSON: { '1olleh': 'hello world',
  '2olleh': [ 'hello', 2, false ],
  detsenolleh: { '1detsen': 'nested', '2detsen': [ 'world', 7, true ] } }
NEW AST: { type: 'object',
  value: 
   [ { type: 'pair', value: [Array] },
     { type: 'pair', value: [Array] },
     { type: 'pair', value: [Array] } ] }
-------------------

```


# Example #2 [simple.sj]

Convert from some general user search request to Elasticsearch Query DSL format

From 
```json
{"prompt":"Hello world","offset":5,"limit":15,"language":"en"}

```

To
```json
{"query":{"query_string":{"query":"Hello world"}},"from":5,"size":15,"type":"en_document"}
```

Source
```javascript
const Amorph = require ('./index.js');

const UserSearchRequest = {
  prompt: 'Hello world',
  offset: 5,
  limit: 15,
  language: 'en',
};

function pluginPagination (api) {
  return {
    [api.AstType.key]: key => {
      switch (api.getKeyName (key)) {
        case 'offset':
          key.value = api.createString ('from');
          break;
        case 'limit':
          key.value = api.createString ('size');
          break;
      }
    },
  };
}

function pluginLanguage (api) {
  return {
    [api.AstType.pair]: pair => {
      const kv = api.parsePair (pair);
      if (kv.key === 'language') {
        pair.value = [
          api.createKey ('type'),
          api.createValue (api.createString (kv.value + '_document')),
        ];
      }
    },
  };
}

function pluginPrompt (api) {
  return {
    [api.AstType.pair]: pair => {
      const kv = api.parsePair (pair);
      if (kv.key === 'prompt') {
        pair.value = [
          api.createKey ('query'),
          api.createValue (
            api.createObject ([
              api.createPair (
                'query_string',
                api.createObject ([
                  api.createPair ('query', api.createString (kv.value)),
                ])
              ),
            ])
          ),
        ];
      }
    },
  };
}

const ElasticSearchRequest = Amorph.transform (UserSearchRequest, [
  pluginPagination,
  pluginLanguage,
  pluginPrompt,
]);

console.log ();
console.log (JSON.stringify (UserSearchRequest));
console.log ();
console.log (JSON.stringify (ElasticSearchRequest.json));
console.log ();

```