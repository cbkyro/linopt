import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import QuantityWidget from '../components/QuantityWidget';
import initFormSwatch from '../core/formSelectedValue';
import fitVideos from '../utils/fitVideos';
import Tabs from 'bc-tabs';

export default class ProductUtils {
  constructor(el, options) {
    this.$el = (el instanceof $ ? el : $(el));
    this.productId = this.$el.find('[data-product-id]').val();
    this.$productMessage = this.$el.find('[data-product-message]');
    this.fitVidsInitialized = false;

    this.options = $.extend({
      tabSelector: '[data-product-tab-title]',
      buttonDisabledClass: 'button-disabled',
    }, options);

    this.callbacks = $.extend({
      willUpdate: () => {},
    }, options.callbacks);

    this.tabs = new Tabs({
      moduleSelector: this.$el.find('[data-tabs]'),
      titleSelector: $(this.options.tabSelector),
      afterSetup: (tabId) => {
        this._initVids(tabId);
        this._clearLoadingTab();
      },
      afterChange: (tabId) => {
        this._initVids(tabId);
      },
    });

    this.quantityControl = new QuantityWidget({scope: '[data-cart-item-add]'});
    this._bindEvents();
  }

  _bindEvents() {
    this.$el.on('click', `${this.options.tabSelector.selector} a`, (event) => {
      event.preventDefault();
      this.tabs.displayTabContent($(event.currentTarget).attr('href'));
    });
  }

  _getViewModel($el) {
    return {
      $price: $('[data-product-price-wrapper="without-tax"]', $el),
      $priceWithTax: $('[data-product-price-wrapper="with-tax"]', $el),
      $saved: $('[data-product-price-saved]', $el),
      $sku: $('[data-product-sku]', $el),
      $weight: $('[data-product-weight]', $el),
      $addToCart: $('[data-button-purchase]', $el),
      $buttonText: $('[data-button-text]', $el),
      stock: {
        $selector: $('[data-product-stock]', $el),
        $level: $('[data-product-stock-level]', $el),
      },
    };
  }

  init(context) {
    this.context = context;
    const productAttributesData = window.BCData.product_attributes || {};

    this._bindProductOptionChange();

    if (this.$el.hasClass('page-content')) {
      this._updateAttributes(productAttributesData);
      this._updateView(productAttributesData);
    } else {
      // Trigger a change event so the values are correct for pre-selected options
      utils.hooks.emit('product-option-change');
    }

    this.$el.on('click', '[data-button-purchase]', (event) => {
      const $quantityInput = $('[name="qty[]"]', this.$el);
      if($quantityInput.length && parseInt($quantityInput.val(), 10) === 0){
        event.preventDefault();
      }
    });

    this._addProductToCart();
    initFormSwatch();
  }

  /**
   *
   * Handle product options changes
   *
   */
  _bindProductOptionChange() {
    utils.hooks.on('product-option-change', (event, changedOption) => {
      const $changedOption = $(changedOption);
      const $form = $changedOption.parents('form');

      // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
      if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
        return;
      }

      utils.api.productAttributes.optionChange(this.productId, $form.serialize(), (err, response) => {
        const data = response ? response.data : {};

        const optionsCount = parseInt(this.$el.find('[data-product-options-count]'), 10);
        if (optionsCount < 1) {
          return;
        }

        this._updateAttributes(data);
        this._updateView(data);
      });
    });
  }

  _updateView(data) {
    const viewModel = this._getViewModel(this.$el);

    if(_.isEmpty(data)) {
      return false;
    }

    if (viewModel.$sku.length && data.sku) {
      viewModel.$sku.html(data.sku);
    }

    if (viewModel.$weight.length && _.isObject(data.weight)) {
      viewModel.$weight.html(data.weight.formatted);
    }

    if (viewModel.$price.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        excludingTax: this.context.productExcludingTax,
      };
      viewModel.$price.html(this.options.priceWithoutTaxTemplate(priceStrings));
    }

    if (viewModel.$priceWithTax.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        includingTax: this.context.productIncludingTax,
      };
      viewModel.$priceWithTax.html(this.options.priceWithTaxTemplate(priceStrings));
    }

    if (viewModel.$saved.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        savedString: this.context.productYouSave,
      };
      viewModel.$saved.html(this.options.priceSavedTemplate(priceStrings));
    }

    if (data.stock) {
      viewModel.stock.$selector.removeClass('product-details-hidden');
      viewModel.stock.$level.text(data.stock);
    } else {
      viewModel.stock.$selector.addClass('product-details-hidden');
    }

    this.callbacks.switchImage(data.image);

    this.callbacks.willUpdate();

    if (data.purchasing_message) {
      this.callbacks.didUpdate('info', data.purchasing_message);
    } else if (data.purchasable) {
      this.callbacks.didUpdate(null);
    }

    const notPurchasable = typeof data.purchaseable !== 'undefined' && !data.purchasable;
    const notInStock = typeof data.instock !== 'undefined' && !data.instock;

    if (notPurchasable || notInStock) {
      viewModel.$addToCart
        .addClass(this.options.buttonDisabledClass)
        .prop('disabled', true);

      viewModel.$buttonText.text(this.context.soldOut);

    } else {
      let buttonText = this.context.addToCart;
      if (viewModel.$addToCart.is('[data-button-preorder]')) {
        buttonText = this.context.preOrder;
      }

      viewModel.$addToCart
        .removeClass(this.options.buttonDisabledClass)
        .prop('disabled', false);

      viewModel.$buttonText.text(buttonText);
    }
  }

  _initVids(tabId) {
    if (tabId === '#product-tab-videos' && !this.fitVidsInitialized) {
      fitVideos('.product-videos-list');
      this.fitVidsInitialized = true;
    }
  }

  _clearLoadingTab() {
    this.$el.find('[data-loading-tab]').toggleClass('active');
  }

  /**
   *
   * Add a product to cart
   *
   */
  _addProductToCart() {
    //TODO: Add JS validation prior to click
    utils.hooks.on('cart-item-add', (event, form) => {
      // Do not do AJAX if browser doesn't support FormData
      if (window.FormData === undefined || this.context.disableProductAjax) {
        return;
      }

      event.preventDefault();

      this.callbacks.willUpdate($(form));

      // Add item to cart
      utils.api.cart.itemAdd(new FormData(form), (err, response) => {
        let isError = false;

        if (err || response.data.error) {
          isError = true;
          response = err || response.data.error;
        }

        if(!isError){
          response = this.context.addSuccess
            .replace('*product*', this.options.productTitle)
            .replace('*cart_link*', `<a href=${this.context.urlsCart}>${this.context.cartLink}</a>`)
            .replace('*continue_link*', `<a href='/'>${this.context.homeLink}</a>`)
            .replace('*checkout_link*', `<a href=${this.context.urlsCheckout}>${this.context.checkoutLink}</a>`);
        }

        const messageType = (isError ? 'error' : 'success');

        this.callbacks.didUpdate(messageType, response);
      });
    });
  }

  // -- Product Stock Callbacks -- //
  _updateAttributes(data) {
    if (data === undefined) { return; }

    const behavior = data.out_of_stock_behavior;
    const inStockIds = data.in_stock_attributes;
    const outOfStockMessage = ` (${data.out_of_stock_message})`;

    if (behavior !== 'hide_option' && behavior !== 'label_option') {
      return;
    }

    $('[data-product-attribute-value]', this.$el).each((i, attribute) => {
      const $attribute = $(attribute);
      const attrId = parseInt($attribute.data('product-attribute-value'), 10);

      if (inStockIds.indexOf(attrId) !== -1) {
        this._enableAttribute($attribute, behavior, outOfStockMessage);
      } else {
        this._disableAttribute($attribute, behavior, outOfStockMessage);
      }
    });
  }

  _disableAttribute($attribute, behavior, outOfStockMessage) {
    if (behavior === 'hide_option') {
      $attribute.hide();

      if (this._getAttributeType($attribute) === 'set-select') {
        $attribute.attr('disabled', true);
      }
    } else {
      if (this._getAttributeType($attribute) === 'set-select') {
        $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
      } else {
        $attribute.addClass('option-unavailable');
      }
    }
  }

  _enableAttribute($attribute, behavior, outOfStockMessage) {
    if (behavior === 'hide_option') {
      $attribute.show();

      if (this._getAttributeType($attribute) === 'set-select') {
        $attribute.removeAttr('disabled');
      }
    } else {
      if (this._getAttributeType($attribute) === 'set-select') {
        $attribute.html($attribute.html().replace(outOfStockMessage, ''));
      } else {
        $attribute.removeClass('option-unavailable');
      }
    }
  }

  _getAttributeType($attribute) {
    const $parent = $attribute.closest('[data-product-attribute]');
    return $parent ? $parent.data('product-attribute') : null;
  }
}
