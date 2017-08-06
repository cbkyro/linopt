import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Alert from '../utils/Alert';
import scrollTarget from '../utils/scrollTarget';
import refreshContent from './refreshContent';
import QuantityWidget from '../components/QuantityWidget';

export default class CartUtils {
  constructor(options) {
    this.$cartContent = $('[data-cart-content]');
    this.$cartTotals = $('[data-cart-totals]');
    this.$cartAlerts = new Alert($('[data-cart-errors]'), {
      callbacks: {
        willUpdate: ($el) => {
          this._goToMessage($el);
        },
      },
    });

    this.quantityControl = new QuantityWidget({scope: this.$cartContent});

    this.callbacks = $.extend({
      willUpdate: () => {},
      didUpdate: () => {},
    }, options.callbacks);

    this._bindEvents();
  }

  _bindEvents() {
    const updateItem = _.debounce(this._updateCartItem, 1000).bind(this);

    this.$cartContent.on('change', '[data-quantity-control-input]', (evt) => {
      const $target = $(evt.target);
      const itemId = $target.closest('[data-quantity-control]').data('quantity-control');
      const newQuantity = parseInt($target.val(), 10);

      updateItem(itemId, newQuantity);
    });

    this.$cartContent.on('click', '[data-cart-item-remove]', (event) => {
      event.preventDefault();
      this._removeCartItem(event);
    });
  }

  _goToMessage($el){
    $el.revealer('show');
    scrollTarget('[data-cart-errors]');
  }

  _removeCartItem(event) {
    const itemId = $(event.currentTarget).closest('[data-cart-item]').data('item-id');

    this.callbacks.willUpdate();

    utils.api.cart.itemRemove(itemId, (err, response) => {
      if (response.data.status === 'succeed') {
        refreshContent(this.callbacks.didUpdate, true);
      } else {
        this.$cartAlerts.error(response.data.errors.join('\n'), true);

        this.callbacks.didUpdate();
      }
    });
  }

  _updateCartItem(productId, quantity) {
    this.$cartAlerts.clear();
    this.callbacks.willUpdate();

    utils.api.cart.itemUpdate(productId, quantity, (error, response) => {
      if (error || response.data.status !== 'succeed') {
        this.$cartAlerts.error(response.data.errors.join('\n'), true);
        this.callbacks.didUpdate();
        return;
      }

      const remove = quantity < 1;
      refreshContent(this.callbacks.didUpdate, remove);
    });
  }
}
