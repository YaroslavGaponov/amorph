const assert = require ('assert');

const {transform} = require ('../index.js');

describe ('amorph', () => {
  describe ('~ transform', () => {
    it ('simple 1', () => {
      const json1 = {
        gap: 'Yaroslav Gaponov',
      };
      const json2 = {
        pag: 'Yaroslav Gaponov',
      };
      function pluginKeyReverse (api) {
        return {
          [api.AstType.key]: node => {
            node.value.value = node.value.value.split ('').reverse ().join ('');
          },
        };
      }
      assert.deepStrictEqual (
        json2,
        transform (json1, [pluginKeyReverse]).json
      );
    });
    it ('simple 2', () => {
      const json1 = {
        gap: 'Yaroslav Gaponov',
      };
      const json2 = {
        pag: 'vonopaG valsoraY',
      };
      function pluginKeyReverse (api) {
        return {
          [api.AstType.string]: node => {
            node.value = node.value.split ('').reverse ().join ('');
          },
        };
      }
      assert.deepStrictEqual (
        json2,
        transform (json1, [pluginKeyReverse]).json
      );
    });
  });
});
