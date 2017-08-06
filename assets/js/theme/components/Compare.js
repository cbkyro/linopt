import _ from 'lodash';

export default class Compare {
  constructor(options = {}, context = {}) {

    this.options = $.extend({
      bindSelector: '[data-compare-wrapper]',
      compareTrigger: '[data-compare-bar-item]',
      compareSubmit: '[data-compare-bar-submit]',
      compareHeightToggle: '[data-compare-bar-toggle]',
      maxItems: 4,
      compareBar: '[data-compare-bar]',
    }, options);

    this.context = context;
    this.$compareSubmit = $(this.options.compareSubmit);
    this.$compareHeightToggle = $(this.options.compareHeightToggle);

    // -- jQuery Dom Objects -- //
    this.$compareWrapper = $(this.options.bindSelector);
    this.$compareTrigger = $(this.options.compareTrigger);
    this.$compareBar = $(this.options.compareBar);
    this.$compareContent = $('[data-compare-bar-preview]', this.options.compareBar);
    this.$compareTitle = $('[data-compare-title]', this.options.compareBar);

    // -- Provide a template to match each compare item to -- //
    this.itemTemplate = _.template(`
      <div class="compare-bar-item">
        <div class="compare-bar-image" style="background-image: url(<%= imgSource %>);">
          <a href="#" class="compare-bar-item-remove" title="${this.context.compareAdd}" data-compare-bar-item-remove="<%= id %>">
            <svg role="presentation">
              <use xlink:href="#icon-close"></use>
            </svg>
          </a>
        </div>
      </div>`);

    // -- A template for if 1 to 3 items are selected to fill the rest of the space -- //
    this.noItemTemplate = `
    <div class="compare-bar-item compare-item-border">
      <div class="compare-bar-item-add">
        <span class="compare-bar-item-text">${this.context.compareAdd}</span>
      </div>
    </div>`;

    // -- List of elements that are checked for comparing -- //
    this.compareList = [];
    this.compareItems = {};

    this._bindEvents();
    this._toggleButtons();
  }

  _bindEvents() {
    // -- Evaluate the status of checked compare boxes -- //
    this.$compareWrapper.on('check-compare', () => {
      this._initChecked();
    });

    // -- Bind "change" event on checkboxes elements -- //
    this.$compareWrapper.on('change', this.$compareTrigger, (event) => {
      this._toggleItem(event);
      this._toggleButtons();
    });

    // -- Bind the height toggle button -- //
    this.$compareBar.on('click', this.options.compareSubmit, (event) => {
      if (this.compareList.length <= 1) {
        event.preventDefault();
      }
    });

    // -- Bind the height toggle button -- //
    this.$compareBar.on('click', this.options.compareHeightToggle, (event) => {
      event.preventDefault();
      if (this.compareList.length) {
        this._toggleCompareBarHeight(event);
      }
    });

    // -- Bind the compare item removal -- //
    this.$compareBar.on('click', '[data-compare-bar-item-remove]', (event) => {
      event.preventDefault();
      const itemIndex = $(event.target).eq();
      this._removeCompareItemByIndex(itemIndex);
      this._updatecompareBar();
    });

    this.$compareWrapper.trigger('check-compare');
  }

  /**
   * On initialisation of method, will check to see if any objects are already
   * selected to be compared. Usefull if the data carries over through pagination.
   * @private
   */
  _initChecked() {
    this.$compareTrigger.each((index, element) => {
      if (element.checked) {
        this._toggleItem(this.$compareTrigger[index]);
      }
    });
  }

  /**
   * Adds or removed an item from the compare row
   * @param event
   * @private
   */
  _toggleItem(event) {
    const $checkbox = $(event.target);
    const $product = $checkbox.closest('.product-item');
    const productId = parseInt($checkbox.val(), 10);
    const productData = this._getProductData($product, productId);

    if (productId in this.compareItems) {
      this._removeCompareItemById(productId);
    } else {
      this._addCompareItem(productData);

      // if we're at the max number of items, remove the first item
      if (this.compareList.length > this.options.maxItems) {
        this._removeCompareItemByIndex(0);
      }
    }

    this._updatecompareBar();
  }

  /**
   * Disabled / Enabled the Max/Min and Submit button
   * @private
   */
  _toggleButtons() {
    if (this.compareList.length) {
      this.$compareSubmit.prop('disabled', false);
      this.$compareHeightToggle.prop('disabled', false);
    } else {
      this.$compareSubmit.prop('disabled', true);
      this.$compareHeightToggle.prop('disabled', true);
    }

    if (this.compareList.length >= 1) {
      this.$compareSubmit.revealer('show');
    } else {
      this.$compareSubmit.revealer('hide');
    }
  }

  /**
   * Updates the compare bar with the objects to compare
   * @private
   */
  _updatecompareBar() {
    // Show / hide the compare box itself.
    if (this.compareList.length < 1) {
      this.$compareBar.revealer('hide');
      this._compareBarMinimize();
    } else {
      this.$compareBar.revealer('show');
    }

    if (this.compareList.length === 4) {
      this.$compareContent.addClass('row-of-4');
    } else {
      this.$compareContent.removeClass('row-of-4');
    }

    // Set the compareBox message
    if (this.compareList.length <= 1) {
      this.$compareTitle.text(this.context.compareProducts);
    } else {
      const compareMessage = this.context.compareItems.replace('*num*', this.compareList.length);
      this.$compareTitle.text(compareMessage);
    }

    // Show the selected products in the compareBar
    this.$compareContent.html('');
    this.compareList.forEach((item) => {
      this.$compareContent.append(this.itemTemplate(this.compareItems[item]));
    });

    // If 2 or less products, show a placeholder template
    for (let i = 0; i < (this.options.maxItems - this.compareList.length); i++) {
      this.$compareContent.append(this.noItemTemplate);
    }
  }

  /**
   * Opens / Closes the compare bar
   * @param event
   * @private
   */
  _toggleCompareBarHeight(event) {
    event.preventDefault();

    if (this.$compareBar.hasClass('is-opened')) {
      this._compareBarMinimize();
    } else {
      this._compareBarMaximize();
    }
  }

  _compareBarMaximize() {
    this.$compareBar.addClass('is-opened');
    this.$compareHeightToggle.text(this.context.compareClose);
  }

  _compareBarMinimize() {
    this.$compareBar.removeClass('is-opened');
    this.$compareHeightToggle.text(this.context.compareOpen);
  }

  /**
   * create an object of relevant product data from product element.
   * @param $product {jQuery} - product item object
   * @param productId {number} - ID of product
   * @returns {object}
   */
  _getProductData($product, productId) {
    const imgSource = $product.find('[data-product-compare-image]').data('product-compare-image');

    return {
      id: productId,
      imgSource,
    };
  }

  // ---------------------- Adding & removing compare items --------------------- //

  /**
   * append product to end of compared products list
   * @param productData {object} - object containing product id, title and image
   */
  _addCompareItem(productData) {
    this.compareList.push(productData.id);
    this.compareItems[productData.id] = productData;
  }

  /**
   * remove product from compared products list
   * @param productId {number} - ID of product we want to remove
   */
  _removeCompareItemById(productId) {
    _.pull(this.compareList, productId);
    delete this.compareItems[productId];

    this._uncheckCompare(productId);
  }

  /**
   * remove product from compared products list
   * @param index {number} - index within compared product list of product we want to remove
   */
  _removeCompareItemByIndex(index) {
    const productId = this.compareList[index];
    this.compareList.splice(index, 1);
    delete this.compareItems[productId];

    this._uncheckCompare(productId);
  }

  /**
   * Uncheck a compare checkbox
   * @param id {number} - id of product within grid to be unchecked
   */
  _uncheckCompare(id) {
    $(`#compare-${id}`).prop('checked', false);
  }
}
