import Loading from 'bc-loading';
import PageAlert from './PageAlert';
import utils from '@bigcommerce/stencil-utils';

export default class QuickCart {
  constructor() {
    this.$scope = $('[data-main-header]');
    this.pageAlerts = new PageAlert();
    this.pageOverlay = new Loading();
    this.quickCart = '[data-quick-cart]';
    this.quickCartContent = '[data-quick-cart-content]';
    this.$quickCartCount = $('[data-cart-preview-count]', this.$scope);

    this.cartAddHooks = [
      'cart-item-add-remote', 'cart-item-update-remote', 'cart-item-remove-remote',
    ];

    this._bindEvents();
  }

  _bindEvents() {
    this.$scope.on('click', '[data-quick-cart-item-remove]', (event) => {
      event.preventDefault();
      this._removeCartItem(event);
    });

    // -- Main cart updating does not emit a call back -- //
    this.$scope.on('quick-cart-update', () => {
      this._refreshQuickCart();
    });

    // -- Iterates through each standard cart emit -- //
    this.cartAddHooks.forEach((hook) => {
      utils.hooks.on(hook, () => {
        this._refreshQuickCart();
      });
    });
  }

  // -- Similar to main cart functionality. Removes from cart -- //
  _removeCartItem(event) {
    this.pageOverlay.show();
    const itemId = $(event.currentTarget).closest('[data-quick-cart-item]').data('item-id');

    utils.api.cart.itemRemove(itemId, (err, response) => {
      if (response.data.status === 'succeed') {
        this._refreshQuickCart(() => {
          this.pageOverlay.hide();
        });
      } else {
        this.pageAlerts.alert(response.data.errors.join('\n'), 'error');
        this.pageOverlay.hide();
      }
    });
  }

  // -- Toggles a wrapper for a smaller quick-cart if empty -- //
  _updateCartQuantity(callback) {
    const $quickCart = $(this.quickCartContent);

    if ($quickCart.find('.quick-cart-item').length) {
      $(this.quickCartContent).removeClass('quick-cart-empty');
    } else {
      $(this.quickCartContent).addClass('quick-cart-empty');
    }

    if (callback) {
      callback();
    }
  }

  // -- Main portion. Refreshes sub-total and quick-cart content -- //
  _refreshQuickCart(callback = false) {
    this.pageAlerts.clear();

    utils.api.cart.getContent({template: 'header/dropdown-quick-cart'}, (error, response) => {
      if (response) {
        const $newQuickCart = $(response);
        $(this.quickCart, this.$scope).html($newQuickCart);

        const count = parseInt($newQuickCart.data('cart-count'), 10);
        this.$quickCartCount.text(`(${count})`);

        if (count > 0) {
          this.$quickCartCount.removeClass('hidden');
        } else {
          this.$quickCartCount.addClass('hidden');
        }

        this._updateCartQuantity(callback);
      }
    });
  }
}
