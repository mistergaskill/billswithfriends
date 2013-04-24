'use strict';

define(
  [
    'depot'
  ],

  function (depot) {
    return depot('items', { idAttribute: 'id' });
  }
);
