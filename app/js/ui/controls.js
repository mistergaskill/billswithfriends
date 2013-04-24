'use strict';

define(
  [
    'flight/component'
  ],

  function (defineComponent) {
    function controls() {
      this.defaultAttrs({
        resetBtnSel: '.reset-button',
      });

      this.resetAll = function () {
        this.trigger('uiResetAllRequested', {});
      };

      this.after('initialize', function () {
        this.on('click', { resetBtnSel: this.resetAll });
      });
    }
    return defineComponent(controls);

  }
)
