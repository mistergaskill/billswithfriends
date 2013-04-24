'use strict';

define(
  [
    'flight/component',
    './person',
  ],

  function (defineComponent, Person) {
    return defineComponent(personList)

    function personList() {

      this.renderList = function (e, data) {
        this.$node.html('')
        data.people.forEach(function (i) {
          this.renderPersonHolder(e, {person: i})
        }, this)
        this.trigger('uiResetTotals');
      }

      this.renderPersonHolder = function (e, data) {
        var n = $('<li></li>').addClass('person').attr('data-person-id', data.person.id).prependTo(this.$node);
        Person.attachTo(n[0])
        this.trigger('uiRenderPersonRequested', data)
      }

      this.after('initialize', function () {
        this.on(document, 'dataPeopleLoaded', this.renderList)
        this.on(document, 'dataPersonAdded', this.renderPersonHolder)

        this.trigger('uiLoadAllPeopleRequested')
      })
    }
  }
)
