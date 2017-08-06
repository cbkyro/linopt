import _ from 'lodash';
import PageManager from '../PageManager';
import PageAlert from './components/pageAlert';
import ProductUtils from './product/ProductUtils';
import priceTemplates from './product/priceTemplates';
import ProductReviews from './product/Reviews';
import ProductImages from './product/ProductImages';
import ThemeUtils from './utils/ThemeUtilities';
import scrollTarget from './utils/scrollTarget';

export default class Product extends PageManager {
  constructor() {
    super();

    this.el = '[data-product-container]';
    this.$el = $(this.el);
    this.$descriptionLink = this.$el.find('[data-description-link]');
    this.loadMoreLink = '[data-load-more-reviews]';
    this.$loadMoreLink = $(this.loadMoreLink);
    this.utils = new ThemeUtils();

    $(document).ready(() => {
      this._truncateExcerpts();
    });

    this._bindEvents();
  }

  loaded() {
    this.pageAlert = new PageAlert();

    new ProductReviews(this.context);
    this.productImages = new ProductImages(this.$el, this.context);

    this.ProductUtils = new ProductUtils(this.el, {
      priceWithoutTaxTemplate: priceTemplates.withoutTax,
      priceWithTaxTemplate: priceTemplates.withTax,
      priceSavedTemplate: priceTemplates.saved,
      productTitle: this.$el.find('[data-product-details]').data('product-title'),
      callbacks: {
        willUpdate: () => {
          this.pageAlert.clear();
        },
        didUpdate: (messageType, response) => {
          this._updateMessage(messageType, response);
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
  }

  _bindEvents() {
    this.$descriptionLink.on('click', (event) => {
      scrollTarget('[data-tabs]');
    });

    this.$loadMoreLink.on('click', (event) => {
      this._showMore(this.$loadMoreLink, event);
    });
  }

  _truncateExcerpts() {
    const $excerpts = $('.has-excerpt');

    $excerpts.each((i, el) => {
      const $excerpt = $(el);

      this.utils.truncate($excerpt);
    });
  }

  _showMore($el, event) {
    event.preventDefault();
    const requestUrl = $el.attr('href');
    const reviewSelector = '.review-item';

    $.ajax({
      url: requestUrl,
      type: 'GET',
      success: (data) => {
        const reviews = $(data).find(reviewSelector);
        const $loadMoreButton = $(data).find(this.loadMoreLink);

        $(reviews).css('opacity', '0').insertAfter($('.review-item').last());
        scrollTarget($(reviews).first());
        $(reviews).css('opacity', '1');

        if($loadMoreButton.attr('href') === ''){
          $el.parent('.product-column-row').css('display', 'none');
        } else {
          $el.attr('href', $loadMoreButton.attr('href'));
        }
      },
    });
  }

  _updateMessage(messageType, response) {
    if(!$('.modal').length){
      if (messageType) {
        this.pageAlert.alert(response, messageType, true);
        this.$el.find('[data-product-add] .spinner').removeClass('visible');
      } else {
        this.pageAlert.clear();
      }
    }
  }
}
