const assert = require ('assert');

const {json2ast} = require ('../index.js');

describe ('amorph', () => {
  describe ('~ json2ast', () => {
    it ('empty', () => {
      const ast = {type: 'object', value: []};
      const json = {};
      assert.deepStrictEqual (ast, json2ast (json));
    });
    it ('string', () => {
      const json = {
        name: 'Hello world!!!',
      };
      const ast = {
        type: 'object',
        value: [
          {
            type: 'pair',
            value: [
              {type: 'key', value: {type: 'string', value: 'name'}},
              {type: 'value', value: {type: 'string', value: 'Hello world!!!'}},
            ],
          },
        ],
      };
      assert.deepStrictEqual (ast, json2ast (json));
    });
    it ('number', () => {
      const json = {
        id: 12345,
      };
      const ast = {
        type: 'object',
        value: [
          {
            type: 'pair',
            value: [
              {type: 'key', value: {type: 'string', value: 'id'}},
              {type: 'value', value: {type: 'number', value: 12345}},
            ],
          },
        ],
      };
      assert.deepStrictEqual (ast, json2ast (json));
    });
    it ('boolean', () => {
      const json = {
        isActive: true,
      };
      const ast = {
        type: 'object',
        value: [
          {
            type: 'pair',
            value: [
              {type: 'key', value: {type: 'string', value: 'isActive'}},
              {type: 'value', value: {type: 'boolean', value: true}},
            ],
          },
        ],
      };
      assert.deepStrictEqual (ast, json2ast (json));
    });
    it ('array', () => {
      const json = {list: ['monday', 1, true, 77, false]};
      const ast = {
        type: 'object',
        value: [
          {
            type: 'pair',
            value: [
              {type: 'key', value: {type: 'string', value: 'list'}},
              {
                type: 'value',
                value: {
                  type: 'array',
                  value: [
                    {type: 'string', value: 'monday'},
                    {type: 'number', value: 1},
                    {type: 'boolean', value: true},
                    {type: 'number', value: 77},
                    {type: 'boolean', value: false},
                  ],
                },
              },
            ],
          },
        ],
      };
      assert.deepStrictEqual (ast, json2ast (json));
    });
    it ('object', () => {
      const json = {
        object: {
          name: 'gap',
        },
      };
      const ast = {
        type: 'object',
        value: [
          {
            type: 'pair',
            value: [
              {type: 'key', value: {type: 'string', value: 'object'}},
              {
                type: 'value',
                value: {
                  type: 'object',
                  value: [
                    {
                      type: 'pair',
                      value: [
                        {type: 'key', value: {type: 'string', value: 'name'}},
                        {type: 'value', value: {type: 'string', value: 'gap'}},
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      };
      assert.deepStrictEqual (ast, json2ast (json));
    });
  });
});
