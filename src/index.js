const assert = require ('assert');
const util = require ('util');

const AstType = Object.freeze ({
  object: 'object',
  array: 'array',
  pair: 'pair',
  key: 'key',
  value: 'value',
  boolean: 'boolean',
  string: 'string',
  number: 'number',
});

function createNode (type, value) {
  assert (type in AstType);
  return {
    type,
    value,
  };
}

function createString (s) {
  assert (s);
  assert (util.isString (s));
  return createNode (AstType.string, s);
}

function createNumber (n) {
  assert (util.isNumber (n));
  return createNode (AstType.number, n);
}

function createBoolean (b) {
  assert (util.isBoolean (b));
  return createNode (AstType.boolean, b);
}

function createKey (s) {
  assert (s);
  assert (util.isString (s));
  return createNode (AstType.key, createString (s));
}

function createValue (v) {
  return createNode (AstType.value, v);
}

function createPair (key, value) {
  return createNode (AstType.pair, [createKey (key), createValue (value)]);
}

function createArray (e) {
  return createNode (AstType.array, e);
}

function createObject (pairs) {
  return createNode (AstType.object, pairs);
}

function getKeyName(key) {
  assert(key);
  assert(key.type == AstType.key);
  assert(key.value.type === AstType.string);
  return key.value.value;
}
function parsePair (pair) {
  assert (pair);
  assert (pair.type === AstType.pair);
  let key, value;
  for (let i = 0; i < pair.value.length; i++) {
    switch (pair.value[i].type) {
      case AstType.key:
        key = pair.value[i].value.value;
        break;
      case AstType.value:
        value = pair.value[i].value.value;
        break;
    }
  }
  return {key, value};
}

function json2ast (value) {
  if (util.isArray (value)) {
    return createArray (value.map (element => json2ast (element)));
  } else if (util.isObject (value)) {
    return createObject (
      Object.keys (value).map (key => createPair (key, json2ast (value[key])))
    );
  } else if (util.isBoolean (value)) {
    return createBoolean (value);
  } else if (util.isString (value)) {
    return createString (value);
  } else if (util.isNumber (value)) {
    return createNumber (value);
  }
}

function ast2json (ast) {
  assert (ast);
  assert (ast.type in AstType);

  const type = ast.type;
  const value = ast.value;

  switch (type) {
    case AstType.object:
      const o = {};
      for (let i = 0; i < value.length; i++) {
        let pair = value[i];
        assert.strictEqual (AstType.pair, pair.type);
        pair = ast2json (pair);
        o[pair.key] = pair.value;
      }
      return o;

    case AstType.array:
      return value.map (v => ast2json (v));

    case AstType.pair:
      let k, v;
      for (let i = 0; i < value.length; i++) {
        switch (value[i].type) {
          case AstType.key:
            k = ast2json (value[i]);
            break;
          case AstType.value:
            v = ast2json (value[i]);
            break;
        }
      }
      assert (util.isString (k));
      return {
        key: k,
        value: v,
      };

    case AstType.key:
      assert (AstType.string, value.type);
      return ast2json (value);

    case AstType.value:
      return ast2json (value);

    case AstType.boolean:
    case AstType.string:
    case AstType.number:
      return value;
  }
}

function walk (callback) {
  return function _walk (ast) {
    assert (ast);
    assert (ast.type in AstType);

    callback (ast);

    switch (ast.type) {
      case AstType.object:
      case AstType.array:
      case AstType.pair:
        return ast.value.map (v => _walk (v));

      case AstType.key:
      case AstType.value:
        return _walk (ast.value);

      case AstType.boolean:
      case AstType.string:
      case AstType.number:
        return;
    }
  };
}

const API = {
  AstType,

  createString,
  createNumber,
  createBoolean,
  createKey,
  createValue,
  createPair,
  createArray,
  createObject,

  getKeyName,
  parsePair,
};

function transform (json, plugins = []) {
  assert (json);
  assert (util.isObject (json));
  assert (util.isArray (plugins));

  const handlers = {};
  for (let i = 0; i < plugins.length; i++) {
    let plugin = plugins[i] (API);
    for (let type in plugin) {
      if (type in handlers) {
        handlers[type].push (plugin[type]);
      } else {
        handlers[type] = [plugin[type]];
      }
    }
  }

  const _transform = node => {
    if (node.type in handlers) {
      const plugins = handlers[node.type];
      plugins.forEach (p => p (node));
    }
  };

  const ast = json2ast (json);
  walk (_transform) (ast);

  return {
    ast,
    json: ast2json (ast),
  };
}

module.exports = {
  json2ast,
  ast2json,
  transform,
};
