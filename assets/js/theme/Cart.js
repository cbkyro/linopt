import PageManager from '../PageManager';
import Loading from 'bc-loading';
import CartUtils from './cart/CartUtils';
import CouponCodes from './cart/CouponCodes';
import GiftCertificates from './cart/GiftCertificates';
import GiftWrapping from './cart/GiftWrapping';
import ShippingCalculator from './cart/ShippingCalculator';
import EvenHeights from './utils/EvenHeights';
import FormValidator from './utils/FormValidator';

export default class Cart extends PageManager {
  constructor() {
    super();
    this.$pageHeader = $('[data-main-header]');
    this.evenHeights = new EvenHeights('[data-cart-totals-row]', '.cart-total-cell');

    if (window.ApplePaySession && $('.dev-environment').length) {
      $(document.body).addClass('apple-pay-supported');
    }

    this._bindEvents();
  }

  _bindEvents() {
    $(document).on('form-validation', () => {
      new FormValidator(this.context).initGlobal();
    });

    $(document).on('cart-initialize-modules', () => {
      this._initCart();
    });
  }

  loaded(next) {
    this.$scopeContent = $('[data-cart-content]');
    this.$scopeTotals = $('[data-cart-totals]');

    const cartOverlay = new Loading();

    new FormValidator(this.context).initGlobal();

    const sharedCallbacks = {
      willUpdate: () => {
        cartOverlay.show();
      },
      didUpdate: () => {
        cartOverlay.hide();
      },
    };

    const cartCallback = {
      willUpdate: () => {
        cartOverlay.show();
      },
      didUpdate: () => {
        this.$pageHeader.trigger('quick-cart-update');
        cartOverlay.hide();
      },
    };

    this.ShippingCalculator = new ShippingCalculator('[data-shipping-calculator]', {
      context: this.context,
      visibleClass: 'visible',
      callbacks: sharedCallbacks,
    });

    this.CouponCodes = new CouponCodes('[data-coupon-codes]', {
      context: this.context,
      scope: this.$scopeTotals,
      visibleClass: 'visible',
      callbacks: sharedCallbacks,
    });

    this.GiftCertificates = new GiftCertificates('[data-gift-certificates]', {
      context: this.context,
      scope: this.$scopeTotals,
      visibleClass: 'visible',
      callbacks: sharedCallbacks,
    });

    new GiftWrapping({
      context: this.context,
      scope: this.$scopeContent,
    });

    this.CartUtils = new CartUtils({
      callbacks: cartCallback,
    });

    this._bindEvents();
    next();
  }

  _initCart(){
    this.CouponCodes.init();
    this.GiftCertificates.init();
  }
}
