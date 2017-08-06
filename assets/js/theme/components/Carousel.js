import _ from 'lodash';
import Flickity from 'flickity';
import isElementInViewport from './Inview';

export default class Carousel {

  constructor(opts = {}) {
    this.options = $.extend({
      el: '[data-carousel-slides]',
      delay: '100',
      nav: '[data-carousel-pagination]',
    }, opts);

    if ($(this.options.el).length) {
      this._init();
    }
  }

  _init() {
    this.flickity = new Flickity(this.options.el, {
      prevNextButtons: true,
      pageDots: true,
      wrapAround: true,
      autoPlay: this.options.delay,
      imagesLoaded: true,
      accessibility: false,
    });

    this._bindEvents();
  }

  _bindEvents() {
    // Reset slider's max-height on window resize
    $(window).on('resize', _.debounce(() => {
      this._slideHeight();
    }, 200));

    // Play / Pause slider when in / out of viewport
    $(window).on('scroll', _.debounce(() => {
      if (isElementInViewport($(this.options.el)[0])) {
        this._playSlider();
      } else {
        this._pauseSlider();
      }
    }, 200));

    // Stop the player from firing a bunch in the background
    $(window).on('blur', () => {
      this._pauseSlider();
    });

    $(window).on('focus', () => {
      this._playSlider();
    });

    // Dynamically set slider heights based on content
    this.flickity.on('select', () => {
      //Set the scope of `this` out of `flickity` and to the class
      $(this.$element).closest(this.options.el).trigger('select');
    });

    $(this.options.el).on('cellSelect', () => {
      this._slideHeight();
    });
  }

  _slideHeight() {
    const $slideMaxHeight = $(this.options.el).find('.is-selected').height();
    $(this.options.el).find('.flickity-viewport').css({
      'max-height': $slideMaxHeight,
    });
  }

  _pauseSlider() {
    if (this.flickity.player.isPlaying) {
      this.flickity.deactivatePlayer();
    }
  }

  _playSlider() {
    if (!this.flickity.player.isPlaying) {
      this.flickity.activatePlayer();
    }
  }
}
