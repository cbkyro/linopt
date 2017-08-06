import utils from '@bigcommerce/stencil-utils';
import Modal from 'bc-modal';
import Alert from '../utils/Alert';
import refreshContent from './refreshContent';
import updateState from './updateState';
import SelectWrapper from '../components/SelectWrapper';

export default class ShippingCalculator {
  constructor(el, options) {
    this.el = el;

    this.options = $.extend({
      scope: $('[data-cart-totals]'),
      context: {},
      visibleClass: 'visible',
    }, options);

    this.callbacks = $.extend({
      willUpdate: () => {},
      didUpdate: () => {},
    }, options.callbacks);

    this.$modalContent = $('#modal-shipping-form');

    this.ShippingModal = new Modal({
      el: this.$modalContent,
      modalClass: 'modal-cart-shipping',
      afterShow: ($modal) => {
        this._initModal($modal);
      },
    });

    this._bindEvents();
  }

  _bindEvents() {
    this.options.scope.on('click', '[data-shipping-calculator-toggle]', (event) => {
      event.preventDefault();
      this.ShippingModal.open();
    });
  }

  _initModal($modal) {
    this.ShippingAlerts = new Alert($('[data-shipping-alerts]'), $modal);
    this.$calculator = $('[data-shipping-calculator]', $modal);
    this.$calculatorForm = this.$calculator.children('form');
    this.$shippingQuotes = $('[data-shipping-quotes]', $modal);
    this.ShippingModal.position();

    this._bindModal($modal);
  }

  _bindModal($modal) {
    $modal.on('submit', '[data-shipping-calculator] form', (event) => {
      event.preventDefault();
      this._calculateShipping();
    });

    $modal.on('change', '[data-field-type="Country"]', (event) => {
      updateState(event, this.options.context, true, ($el) => {
        new SelectWrapper($el);
      });
    });
  }

  _calculateShipping() {
    this.callbacks.willUpdate();

    /* eslint-disable camelcase*/
    const params = {
      country_id: $('[name="shipping-country"]', this.$calculatorForm).val(),
      state_id: $('[name="shipping-state"]', this.$calculatorForm).val(),
      zip_code: $('[name="shipping-zip"]', this.$calculatorForm).val(),
    };

    utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {

      if (response.data.quotes) {
        this.ShippingAlerts.clear();
        this.$shippingQuotes.html(response.content);
        this.ShippingModal.position();
      } else {
        this.ShippingAlerts.error(response.data.errors.join('\n'));
      }

      this.callbacks.didUpdate();

      // bind the select button
      this.$shippingQuotes.find('.button').on('click', (event) => {
        event.preventDefault();

        this.callbacks.willUpdate();

        const quoteId = $('[data-shipping-quote]:checked').val();

        utils.api.cart.submitShippingQuote(quoteId, () => {
          refreshContent(this.callbacks.didUpdate);
          this.ShippingModal.close();
        });
      });
    });
  }
}
