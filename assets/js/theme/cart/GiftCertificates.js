import utils from '@bigcommerce/stencil-utils';
import Alert from '../utils/Alert';
import refreshContent from './refreshContent';

export default class GiftCertificates {
  constructor(el, options) {
    this.$el = $(el);

    this.options = $.extend({
      context: {},
      scope: $('[data-cart-totals]'),
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
    this.$certificateAlerts = new Alert($('[data-gift-certificate-errors]', this.$el));
  }

  _bindEvents() {
    this.options.scope.on('click', '[data-gift-certificate-toggle]', (event) => {
      event.preventDefault();
      this._toggle(event);
    });

    this.options.scope.on('blur', '[data-gift-certificate-input]', (event) => {
      if (event.currentTarget.value.length > 0) {
        this._addCode();
      }
    });

    this.options.scope.on('submit', '[data-gift-certificate-form]', (event) => {
      event.preventDefault();
      this._addCode();
    });
  }

  _toggle(event) {
    const $target = $(event.currentTarget);
    const $form = $('[data-gift-certificate-form]', this.options.scope);
    const $label = $('[data-gift-certificate-toggle-label]', this.options.scope);

    $form.toggleClass(this.options.visibleClass);

    if ($form.hasClass(this.options.visibleClass)) {
      $label.text($target.data('gift-certificate-cancel'));
      $label.parent().addClass('active');
    } else {
      $label.text($target.data('gift-certificate-toggle'));
      $label.parent().removeClass('active');
    }
  }

  _addCode() {
    const code = $('[data-gift-certificate-input]').val();

    this.$certificateAlerts.clear();
    this.callbacks.willUpdate();

    if (! this._isValidCode(code)) {
      this.$certificateAlerts.error(this.options.context.giftCertificateInputEmpty);
      return this.callbacks.didUpdate();
    }

    utils.api.cart.applyGiftCertificate(code, (err, response) => {
      if (response.data.status === 'success') {
        refreshContent(this.callbacks.didUpdate);
      } else {
        this.$certificateAlerts.error(response.data.errors.join('\n'));
        this.callbacks.didUpdate();
      }
    });
  }

  _isValidCode(code) {
    if (typeof code !== 'string') {
      return false;
    }

    return /^[A-Z0-9]{3}\-[A-Z0-9]{3}\-[A-Z0-9]{3}\-[A-Z0-9]{3}$/.exec(code);
  }
}
