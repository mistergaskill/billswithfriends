/*global define */
'use strict';

define(
  [
    './data/people',
    './data/items',
    './ui/person_list',
    './ui/add_person',
    './ui/controls',
    './ui/totals'
  ],

  function (
    PeopleData,
    ItemsData,
    PersonList,
    AddPerson,
    Controls,
    Totals) {

    var initialize = function () {
      Totals.attachTo('#totals');
      PeopleData.attachTo(document);
      ItemsData.attachTo(document);
      PersonList.attachTo('#receipt');
      AddPerson.attachTo('#add-person');
      Controls.attachTo('#header-controls');
    };

    return {
      initialize: initialize
    }
  }
)
