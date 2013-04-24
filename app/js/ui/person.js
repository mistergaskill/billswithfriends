'use strict';

define(
  [
    'flight/component',
    '../utils',
    'text!app/templates/person.html',
    'text!app/templates/item.html',
    'components/is-js/is'
  ],

  function (defineComponent, utils, personTmpl, itemTmpl, is) {
    function person() {
      var ENTER_KEY = 13,
          pTmpl = utils.tmpl(personTmpl),
          iTmpl = utils.tmpl(itemTmpl)

      this.defaultAttrs({
        personNameSel: '.person-name', 
        itemsSelector: '.item-list',
        itemPricesSel: '.item-list .price-to-pay',
        addItemSelector: '.add-item',
        addItemBtn: '.add-item-btn',
        addItemNameSel: '.add-item .item-name',
        addItemPriceSel: '.add-item .item-price',
        gratuityPercentSel: '.gratuity-percent',
        gratuitySel: '.gratuity .price',
        subtotalSel: '.subtotal .price',
        taxSel: '.tax .price',
        taxPercentSel: '.tax-percent',
        totalSel: '.total .price'
      })

      this.renderPerson = function (e, data) {
        if (this.getId() != data.person.id) {
          return;
        }
        this.$node.html(pTmpl(data.person));
        this.trigger('uiLoadItemsRequested', { personId: data.person.id });
      };

      this.renderItem = function (e, data) {
        if ($.inArray(this.getId(), data.item.ownerIds) === -1) {
          return
        }
        this.select('itemsSelector').append(iTmpl(data.item))
        this.updateTotal();
      };

      this.renderItems = function (e, data) {
        console.log('renderItems');
        if (this.getId() != data.personId) {
          return
        }
        var $items = this.select('itemsSelector');
        $items.html('');
        data.items.forEach(function (i) {
          this.select('itemsSelector').append(iTmpl(i))
        }, this);

        this.updateTotal();
      };

      this.addItem = function (e, data) {
        var name = this.select('addItemNameSel').val(),
            price = this.select('addItemPriceSel').val();

        if (!is.numeric(price)) {
          console.log("ERROR: not numeric");
          return;
        }

        this.trigger('uiAddItemRequested', {
          name: name,
          price: price,
          ownerIds: [this.getId()]
        });

        this.select('addItemNameSel').val(''),
        this.select('addItemPriceSel').val('');
      };

      this.updateTotal = function(e, data) {
        console.log('updating total');
        this.updateSubtotal();
        this.updateTax();
        this.updateGratuity();
        var total = parseFloat(this.calcTotal()).toFixed(2);
        this.select('totalSel').text(total);
        this.triggerUpdateTotal(total);
      };

      this.broadcastTotal = function (e, data) {
        var total = this.select('totalSel').text();
        this.triggerUpdateTotal(total);
      };

      this.triggerUpdateTotal = function (total) {
        console.log('uiBroadcastTotal');
        this.trigger(document, 'uiUpdateTotal', {
          personId: this.getId(),
          personName: this.getPersonName(),
          total: total
        });
      }

      this.calcTotal = function () {
        return this.getGratuity() + this.getTax() + this.getSubtotal();
      };

      this.getGratuity = function () {
        return parseFloat(this.select('gratuitySel').text());
      };

      this.updateGratuity = function() {
        this.select('gratuitySel').text(this.calcGratuity());
      };

      this.calcGratuity = function () {
        return (this.getSubtotal() * this.getGratuityPercent()).toFixed(2);
      };

      this.getTax = function () {
        return parseFloat(this.select('taxSel').text());
      };

      this.updateTax = function() {
        this.select('taxSel').text(this.calcTax());
      };

      this.calcTax = function () {
        return (this.getSubtotal() * this.getTaxPercent()).toFixed(2);
      };

      this.updateSubtotal = function () {
        this.select('subtotalSel').text(this.calcSubtotal());
      };

      this.getSubtotal = function() {
        return parseFloat(this.select('subtotalSel').text());
      };

      this.calcSubtotal = function() {
        console.log('calcSubtotal');
        var parsePrice = function($el) {
          return parseFloat(parseFloat($el.text()).toFixed(2));
        };
        var subtotal = 0;
        this.select('itemPricesSel').each(function(){
          subtotal = subtotal + parsePrice($(this));
        });
        return subtotal.toFixed(2);
      }

      this.getTaxPercent = function() {
        return parseFloat(this.select('taxPercentSel').text()) / 100;
      };

      this.getGratuityPercent = function () {
        return (parseFloat(this.select('gratuityPercentSel').text()) / 100).toFixed(2);
      };

      this.getId = function () {
        return this.$node.attr('data-person-id');
      };

      this.getPersonName = function () {
        return this.select('personNameSel').text();
      }

      this.after('initialize', function () {
        this.on(document, 'uiUpdateTotalRequested', this.updateTotal);
        this.on(document, 'uiRenderPersonRequested', this.renderPerson);
        this.on(document, 'uiPersonTotalRequested', this.broadcastTotal);
        this.on(document, 'dataPersonalItemsLoaded', this.renderItems);
        this.on(document, 'dataPersonAdded', this.renderPerson);
        this.on(document, 'dataItemAdded', this.renderItem);
        this.on('click', { 'addItemBtn': this.addItem });
      });
    }

    return defineComponent(person)
  }
)
