const assert = require ('assert');

const {json2ast, ast2json} = require ('../index.js');

describe ('amorph', () => {
  describe ('~ ast2json', () => {
    it ('empty', () => {
      const json = {};
      assert.deepStrictEqual (json, ast2json (json2ast (json)));
    });
    it ('string', () => {
      const json = {name: 'hello world!!!'};
      assert.deepStrictEqual (json, ast2json (json2ast (json)));
    });
    it ('number', () => {
      const json = {id: 123456};
      assert.deepStrictEqual (json, ast2json (json2ast (json)));
    });
    it ('boolean', () => {
      const json = {isTrue: false};
      assert.deepStrictEqual (json, ast2json (json2ast (json)));
    });
    it ('array', () => {
      const json = {list: ['Hello', 1, true, false, 77]};
      assert.deepStrictEqual (json, ast2json (json2ast (json)));
    });
    it ('object', () => {
      const json = {object: {name: 'gap'}};
      assert.deepStrictEqual (json, ast2json (json2ast (json)));
    });
  });
});
