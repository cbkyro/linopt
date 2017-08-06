import utils from '@bigcommerce/stencil-utils';
import Alert from '../utils/Alert';
import refreshContent from './refreshContent';

export default class CouponCodes {
  constructor(el, options) {
    this.$el = $(el);

    this.options = $.extend({
      scope: $('[data-cart-totals]'),
      context: {},
      visibleClass: 'visible',
    }, options);

    this.callbacks = $.extend({
      willUpdate: () => {},
      didUpdate: () => {},
    }, options.callbacks);

    this._bindEvents();
    this.init();
  }

  init() {
    this.$couponAlerts = new Alert($('[data-coupon-errors]', this.options.scope));
  }

  _bindEvents() {
    this.options.scope.on('click', '[data-coupon-code-toggle]', (event) => {
      event.preventDefault();
      this._toggle(event);
    }); 
    
    this.options.scope.on('blur', '[data-coupon-code-input]', (event) => {
      if (event.currentTarget.value.length > 0) {
        this._addCode();
      }
    });

    this.options.scope.on('submit', '[data-coupon-code-form]', (event) => {
      event.preventDefault();
      this._addCode();
    });
  }

  _toggle(event) {
    const $target = $(event.currentTarget);
    const $form = $('[data-coupon-code-form]', this.options.scope);
    const $label = $('[data-coupon-code-toggle-label]', this.options.scope);

    $form.toggleClass(this.options.visibleClass);

    if ($form.hasClass(this.options.visibleClass)) {
      $label.text($target.data('coupon-code-cancel'));
      $label.parent().addClass('active');
    } else {
      $label.text($target.data('coupon-code-toggle'));
      $label.parent().removeClass('active');
    }
  }

  _addCode() {
    const code = $('[data-coupon-code-input]').val();

    this.$couponAlerts.clear();
    this.callbacks.willUpdate();

    if (!code) {
      this.$couponAlerts.error(this.options.context.couponCodeEmptyInput);
      return this.callbacks.didUpdate();
    }

    utils.api.cart.applyCode(code, (err, response) => {
      if (response.data.status === 'success') {
        refreshContent(this.callbacks.didUpdate);
      } else {
        this.$couponAlerts.error(response.data.errors.join('\n'));
        this.callbacks.didUpdate();
      }
    });
  }
}
