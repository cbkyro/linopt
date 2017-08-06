import _ from 'lodash';

export default class ImageZoom {
  constructor(el, $offset = false) {
    this.$el = $(el);
    this.$el.addClass('product-image-zoom');

    this.$offset = $offset ? $offset : this.$el;

    this._init();
    this._bindEvents();
    this._bindResize();
  }

  _bindEvents() {
    this.$el.on('mousemove', (event) => {
      this._zoomImage(event);
    });

    this.$el.on('mouseout', (event) => {
      this._resetImage(event);
    });
  }

  _bindResize() {
    $(window).on('resize', _.debounce(() => {
      this._init();
    }, 100));
  }

  _init() {
    this.image = {
      offset: this.$offset.offset(),
      width: this.$el.innerWidth(),
      height: this.$el.innerHeight(),
    };
  }

  _zoomImage(event) {
    const top = ((event.pageY || event.clientY) - this.image.offset.top) / this.image.height * 100;
    const left = ((event.pageX || event.clientX) - this.image.offset.left) / this.image.width * 100;

    this.$el.css('background-position', `${left}% ${top}%`);
  }

  _resetImage(){
    this.$el.css('background-position', '');
  }
}
