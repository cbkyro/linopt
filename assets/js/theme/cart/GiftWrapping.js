import utils from '@bigcommerce/stencil-utils';
import Modal from 'bc-modal';
import pageAlert from '../components/pageAlert';
import SelectWrapper from '../components/SelectWrapper';

export default class GiftWrapping {
  constructor(options = {}) {
    this.itemId = null;
    this.$spinner = $('<span class="loading-spinner"></span>');

    this.options = $.extend({
      scope: '[data-cart-content]',
      trigger: '[data-item-giftwrap]',
      remove: '[data-giftwrap-remove]',
    }, options);

    this.$cartContent = $(this.options.scope);
    this.context = options.context;
    this.pageAlert = new pageAlert();

    this._initialize();
  }

  _initialize() {
    this.GiftWrapModal = new Modal({
      modalClass: 'giftwrap-modal',
      afterShow: ($modal) => {
        this._modalLoadingState($modal);
        this._getForm($modal);
      },
    });

    this._bindPageEvents();
  }

  // Bind functionality to giftwrap links.
  _bindPageEvents() {
    this.$cartContent.on('click', this.options.trigger, (event) => {
      event.preventDefault();
      const $target = $(event.currentTarget);
      this.itemId = $target.data('item-giftwrap');

      this.pageAlert.clear();
      this.GiftWrapModal.open();
    });

    this.$cartContent.on('click', this.options.remove, (event) => {
      if(!confirm(this.context.removeGiftWrap)) {
        event.preventDefault();
      }
    });
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

  // Run once the modal has been opened..
  _getForm($modal) {
    const options = { template: 'cart/giftwrap-modal' };

    utils.api.cart.getItemGiftWrappingOptions(this.itemId, options, (err, response) => {
      if (response) {
        $modal.toggleClass('loading');
        $modal.find('.modal-content').append(response.content);
        this._bindModalEvents($modal);

        // Style selects
        const $select = $('select', $modal);
        if ($select.length) {
          $select.each((i, el) => {
            new SelectWrapper(el);
          });
        }

        // reposition modal with content
        this.GiftWrapModal.position();

        // Class added to display the modal once content is available
        $modal.toggleClass('loading').toggleClass('loaded');
      } else {
        this.GiftWrapModal.close();
      }
    });
  }

  _bindModalEvents($modal) {
    $modal.on('change', () => {
      this.GiftWrapModal.position();
    });

    // Select giftwrapping individually or together
    $modal.find('[data-giftwrap-type]').on('change', (event) => {
      this._toggleSingleMultiple($modal, event.currentTarget.value);
    });

    // Select the type of gift wrapping for a particular item
    $('[data-giftwrap-select]').change((event) => {
      const $select = $(event.target);
      const index = $select.data('index');
      const id = $select.val();

      if (!id) { return; }
      const allowMessage = $select.find(`option[value=${id}]`).data('allow-message');

      $(`[data-giftwrap-image-${index}]`).addClass('hidden');
      $(`[data-giftwrap-image-${index}="${id}"]`).removeClass('hidden');

      if (allowMessage) {
        $(`[data-giftwrap-message-${index}]`).removeClass('hidden');
      } else {
        $(`[data-giftwrap-message-${index}]`).addClass('hidden');
      }
    });

    $('[data-giftwrap-select]').trigger('change');
  }

  // Toggles displaying single / multiple wrap options
  _toggleSingleMultiple($modal, value) {
    const $singleForm = $modal.find('[data-giftwrap-single]');
    const $multiForm  = $modal.find('[data-giftwrap-multiple]');

    if (value === 'different') {
      $singleForm.addClass('hidden');
      $multiForm.removeClass('hidden');
    }  else {
      $singleForm.removeClass('hidden');
      $multiForm.addClass('hidden');
    }
  }
}
