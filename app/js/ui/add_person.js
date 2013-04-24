'use strict';

define(
  [
    'flight/component'
  ],

  function (defineComponent) {
    return defineComponent(addPerson)

    function addPerson() {
      var ENTER_KEY = 13

      this.defaultAttrs({
        newName: '#add-person-name',
        addPersonBtn: '#add-person-btn'
      })

      this.enterName = function(e) {
        if (e.which !== ENTER_KEY) {
          return
        }
        this.addPerson()
      }

      this.addPerson = function () {
        var $el = $(this.attr.newName),
            name = $el.val().trim()

        if (!name) {
          return
        }
        this.trigger('uiAddPersonRequested', {
          name: name
        })

        $el.val('');
      }

      this.after('initialize', function () {
        this.on('keydown', { 'newName': this.enterName })
        this.on('click', { 'addPersonBtn': this.addPerson })
      })
    }
  }
)
