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
