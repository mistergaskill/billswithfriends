/*global define */
'use strict';

define(
  [
    'flight/component',
    '../storage/items'
],

function (defineComponent, dataStore) {

  function items() {
    var filterByOwner = function (id) {
      return function (item) {
        return ($.inArray(id, item.ownerIds) !== -1)
      }
    };

    this.addItem = function (e, data) {
      var item = dataStore.save(this.itemTransform({
        name: data.name,
        price: data.price,
        ownerIds: data.ownerIds
      }));
      this.trigger('dataItemAdded', {item: item});
    };

    this.itemTransform = function (item) {
      item.priceToPay = (parseFloat(item.price) / item.ownerIds.length).toFixed(2);
      item.hasMultipleOwners = (item.ownerIds.length > 1);
      return item;
    };

    this.itemArrayTransform = function (items) {
      var r = [];
      items.forEach(function (item) {
        r.push(this.itemTransform(item));
      }, this);
      return r;
    };

    this.findByPerson = function(e, data) {
      var items = dataStore.find(filterByOwner(data.personId));
      this.trigger('dataPersonalItemsLoaded', {
        items: this.itemArrayTransform(items),
        personId: data.personId
      });
    };

    this.deleteAll = function () {
      dataStore.destroyAll();
      this.trigger('dataItemsLoaded');
    }

    this.after('initialize', function () {
      this.on(document, 'uiLoadItemsRequested', this.findByPerson);
      this.on(document, 'uiAddItemRequested', this.addItem);
      this.on(document, 'uiResetAllRequested', this.deleteAll);
    });
  }

  return defineComponent(items);
}
)
