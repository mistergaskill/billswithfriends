/*global define */
'use strict';

define(
  [
    'flight/component',
    '../storage/people'
],

function (defineComponent, dataStore) {
  return defineComponent(people)

  function people() {
    var filter

    this.addPerson = function (e, data) {
      var person = dataStore.save({
        name: data.name
      })

      this.trigger('dataPersonAdded', { person: person })
    }

    this.all = function (e) {
      this.trigger('dataPeopleLoaded', {
        people: dataStore.all()
      })
    }

    this.deleteAll = function () {
      dataStore.destroyAll();
      this.trigger('dataPeopleLoaded', {
        people: []
      });
    }


    this.after('initialize', function () {
      this.on(document, 'uiLoadAllPeopleRequested', this.all);
      this.on(document, 'uiAddPersonRequested', this.addPerson);
      this.on(document, 'uiResetAllRequested', this.deleteAll);
    })
  }
}
)
