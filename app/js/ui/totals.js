'use strict';

define(
  [
    'flight/component',
    '../utils',
    'text!app/templates/person_total.html'
  ],

  function (defineComponent, utils, totalTmpl) {
    function totals() {
      var ptTmpl = utils.tmpl(totalTmpl);

      this.defaultAttrs({
        peopleHolder: '.person-totals',
        totalSel: '.total', 
        pricesSel: '.person-totals .price',
        realTotal: '.total-total .price'
      });

      this.getPersonEl = function (personId) {
        var $el = this.$node.find('.person-total[data-person-id="'+personId+'"]');
        if ($el.length == 0) {
          return false;
        }
        return $el;
      }

      this.resetTotals = function () {
        this.$node.hide();
        this.select('peopleHolder').html('');
        this.select('realTotal').text('');
      }

      this.updateTotals = function (e, data) {
        console.log("updating people totals", data);
        var $person = this.getPersonEl(data.personId);
        if (!$person) {
          console.log('going to append', this.select('peopleHolder'), ptTmpl(data));
          this.select('peopleHolder').append(ptTmpl(data));
        } else {
          $person.find(this.attr['totalSel']).text(data.total);
        }
        this.updateTotalTotal();
        this.$node.show();
      }

      this.updateTotalTotal = function () {
        var total = 0;
        $.each(this.select('pricesSel'), function () {
          total = total + parseFloat($(this).text());
        });
        this.select('realTotal').text(total.toFixed(2));
      };

      this.after('initialize', function () {
        this.on(document, 'uiUpdateTotal', this.updateTotals);
        this.on(document, 'uiResetTotals', this.resetTotals);
      });
    }
    return defineComponent(totals);

  }
)
