import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Flickity from 'flickity'; // eslint-disable-line no-unused-vars
import baguetteBox from 'baguettebox.js';
import imagesLoaded from 'imagesloaded';

export default class ProductImages {
  constructor($scope, context, callbacks = {}) {
    this.context = context;
    this.$el = $scope.find('[data-product-images]');
    this.showZoom = context.productImageZoom;
    this.$scope = $scope;
    this.$viewPort = null;
    this.variantLoaded = false;
    this.imageSlideTemplate = _.template(`
      <div class='product-slideshow-image' data-image-position='0'<% if (showZoom) { %>data-variation-lightbox<% } %>>
        <img src='<%= largeImgSrc %>' alt='<%= imgObj.alt %>'>

        <% if (showZoom) { %>
          <a href="<%= largeImgSrc %>" class="product-image-zoom">
              <svg role="img"><use xlink:href="#icon-enlarge"></use></svg>
            </a>
        <% } %>
      </div>
    `);

    this.paginationTemplate = _.template(`
      <span
        class='product-thumbnail'
        style="background-image: url('<%= smallImgSrc  %>');"
        data-image-position='0'
        data-high-res='<%= largeImgSrc %>'
        data-product-thumbnail>
        <img class='show-for-sr' src='<%= smallImgSrc  %>' alt='<%= imgObj.alt %>'>
      </span>`);

    this.callbacks = $.extend({
      willUpdate: () => {},
      didUpdate: () => {},
    }, callbacks);

    this._setupSlides();
    this._bindEvents();
  }

  _bindEvents() {
    $('body').on('click', '.product-thumbnail', (event) => {
      event.preventDefault();
      this._switchProductImage(event);
    });

    if (this.showZoom) {
      this._imageZoom();
    }
  }

  _setupSlides() {
    const flickityOptions = {
      cellSelector: '.product-slideshow-image',
      prevNextButtons: true,
      contain: false,
      accessibility: false,
      pageDots: true,
      freeScroll: false,
      wrapAround: true,
      resize: true,
      initialIndex: this.$el.data('slideshow-position'),
    };

    imagesLoaded(this.$el[0], () => {
      this.flickity = new Flickity(this.$el[0], flickityOptions);
      this.$viewPort = this.$scope.find(this.flickity.viewport);

      this._slidesHeight();
      this._bindSlideshow();

      this.callbacks.didUpdate();
    });
  }

  _bindSlideshow() {
    this.flickity.on('select', () => {
      this._slidesHeight();
    });

    $(window).on('resize', _.debounce(() => {
      this._slidesHeight();
    }, 200));
  }

  _slidesHeight() {
    const slide = this.flickity.selectedElement;

    imagesLoaded(slide, () => {
      const sliderHeight = $(slide).height();
      this.$viewPort.animate({
        height: sliderHeight,
        complete: () => {
          this.callbacks.didUpdate();
        },
      });
    });
  }

  _switchProductImage(event) {
    const $thumbnail = $(event.target);
    const index = $thumbnail.index();

    $thumbnail
      .addClass('active')
      .siblings()
      .removeClass('active');

    this.flickity.select(index);
  }

  removeFirst() {
    this.flickity.remove(this.flickity.getCellElements()[0]);
    this.$scope.find('.product-thumbnails .product-thumbnail').first().remove();
  }

  restoreImage() {
    if (!this.variantLoaded) return;

    this.removeFirst();
    this.variantLoaded = false;
  }

  newImage(imgObj = {}) {
    const largeImgSrc = utils.tools.image.getSrc(imgObj.data, this.context.themeImageSizes['1024']);
    const smallImgSrc = utils.tools.image.getSrc(imgObj.data, this.context.themeImageSizes['200']);

    const $largeNewImage = $(this.imageSlideTemplate({
      largeImgSrc,
      imgObj,
      showZoom: this.showZoom
    }));

    const $smallNewImage = $(this.paginationTemplate({
      largeImgSrc,
      smallImgSrc,
      imgObj
    }));

    if (this.variantLoaded) {
      this.removeFirst();
    } else {
      this.variantLoaded = true;
    }

    this.flickity.prepend($largeNewImage);

    this.$scope.find('.product-thumbnails').prepend($smallNewImage);

    this.$scope.find('.product-thumbnail').each(function(i) {
      $(this).attr('data-image-position', i);
    });

    this.$scope.find('.product-slideshow-image').each(function(i) {
      $(this).attr('data-image-position', i);
    });

    this.flickity.select(0);

    baguetteBox.run('[data-variation-lightbox]', {});

    this.callbacks.didUpdate();
  }

  _imageZoom() {
    baguetteBox.run('.product-slideshow-images', {});
  }
}
