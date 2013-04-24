'use strict';

define(
  [
    'depot'
  ],

  function (depot) {
    return depot('people', { idAttribute: 'id' });
  }
);
