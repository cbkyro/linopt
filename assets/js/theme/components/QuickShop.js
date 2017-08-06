import utils from '@bigcommerce/stencil-utils';
import ProductUtils from '../product/ProductUtils';
import ProductImages from '../product/ProductImages';
import priceTemplates from '../product/priceTemplates';
import SelectWrapper from './SelectWrapper';
import Alert from '../utils/Alert';
import ThemeUtils from '../utils/ThemeUtilities';

import Modal from 'bc-modal';
import imagesLoaded from 'imagesloaded';

export default class QuickShop {
  constructor(context) {
    this.utils = new ThemeUtils();
    this.context = context;
    this.id = null;
    this.$spinner = $('<span class="loading-spinner"></span>');

    this.QuickShopModal = new Modal({
      el: $('<div id="quick-shop-modal">'),
      modalClass: 'modal-quick-shop',
      afterShow: ($modal) => {
        this._modalLoadingState($modal);
        this._fetchProduct($modal, this.id);
      },
    });

    this._bindEvents();
  }

  /**
   * Show spinner
   */
  _modalLoadingState($modal, show = true) {
    if (show) {
      $modal.append(this.$spinner);
    } else {
      $modal.find(this.$spinner).remove();
    }
  }

  /**
   * Launch quickshop modal on click and set up id variable
   */
  _bindEvents() {
    $('body').on('click', '[data-quick-shop]', (event) => {
      event.preventDefault();
      this.id = $(event.currentTarget).data('product-id');

      if (!this.id) {
        return;
      }

      this.QuickShopModal.open();
    });
  }

  /**
   * Listens to events / triggers from within the Modal object for callbacks.
   * @private
   */
  _bindModal($modal) {
    const $alerts = $('[data-quickshop-messages]', $modal);

    $modal.on('click', '[data-product-tab-title]', () => {
      this._centerModal();
    });
  }

  _centerModal(){
    this.QuickShopModal.position();
  }

  /**
   * Run ajax fetch of product and add to modal. Bind product functionality and show the modal
   * @param {integer} id - product id
   */
  _fetchProduct($modal, id) {
    utils.api.product.getById(id, {template: 'product/quick-shop'}, (err, response) => {

      $modal.toggleClass('loading');
      $modal.find('.modal-content').append(response);

      this._initProduct($modal);
      this.utils.truncate($modal.find('.product-description.has-excerpt'));
    });
  }

  _initProduct($modal) {
    this.$alertBox = $('[data-quickshop-messages]', $modal);
    this.alert = new Alert(this.$alertBox);

    imagesLoaded($modal, () => {
      this.QuickShopModal.position();

      const quickShopCallbacks =  {
        didUpdate: () => {
          this._centerModal();
        },
      };

      this.productImages = new ProductImages($modal, this.context, quickShopCallbacks);

      new ProductUtils($modal.find('[data-quickshop-details]'), {
        priceWithoutTaxTemplate: priceTemplates.withoutTax,
        priceWithTaxTemplate: priceTemplates.withTax,
        priceSavedTemplate: priceTemplates.saved,
        productTitle: $modal.find('[data-quickshop-details]').data('product-title'),
        tabSelector: '.tab-link',
        buttonDisabledClass: 'button-disabled',
        callbacks: {
          willUpdate: () => {
            this._centerModal();
          },
          didUpdate: (messageType, response) => {
            this.updateMessage(messageType, response);
          },
          switchImage: (data) => {
            if (data) {
              this.productImages.newImage(data);
            } else {
              this.productImages.restoreImage()
            }
          },
        },
      }).init(this.context);

      const $select = $modal.find('select');
      if ($select.length) {
        $select.each((i, el) => {
          new SelectWrapper(el);
        });
      }

      this._bindModal($modal);

      $modal.toggleClass('loading').toggleClass('loaded');
      this._modalLoadingState($modal, false);
    });
  }

  /**
   * Updates the QuickShop message to notify users of success/failure
   *  Note: If is not public, it loses ability to be act as a call back
   * @param messageType
   * @param response
   */
  updateMessage(messageType, response) {
    if (messageType) {
      const existingText = this.$alertBox.find('.alert-message').text().trim();
      if (existingText !== response) {
        this.alert.message(response, messageType, true);
      }

      $('.modal-quick-shop [data-product-add] .spinner').removeClass('visible');
    } else {
      this.alert.clear();
    }

    this._centerModal();

    if(messageType) {
      $('.modal-quick-shop').animate({
        scrollTop: 0,
      }, 400, 'linear');
    }
  }
}
