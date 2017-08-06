export default class ShareList {
  constructor() {
    this.$body = $(document.body);
    this.$mainSelector = $('[data-share-buttons]');
    this.$wrapper = $('[data-share-list]');
    this.$outer = $('[data-share-button-outer]');

    if (this.$outer.length) {
      this._bindEvents();
    }
  }

  _bindEvents() {
    this.$mainSelector.on('click', (event) => {
      event.preventDefault();
      if (!this.$mainSelector.hasClass('disabled') && !this.$mainSelector.hasClass('active')) {
        this._openShareDropdown();
      } else if (!this.$mainSelector.hasClass('disabled')) {
        this._closeShareDropdown();
      }
    });

    this.$wrapper.on('click', '[data-share-print]', (event) => {
      event.preventDefault();
      window.print();
    });

    this.$body.on('keyup', (event) => {
      if (event.keyCode === 27 && this.$mainSelector.hasClass('active')) {
        this._closeShareDropdown();
      }
    });

    this.$body.on('click', (event) => {
      if (this.$mainSelector.hasClass('active')) {
        if (!$(event.target).closest(this.$wrapper).length) {
          this._closeShareDropdown();
        }
      }
    });
  }

  _openShareDropdown() {
    this.$mainSelector.addClass('disabled');
    this.$wrapper.removeClass('hidden').revealer('toggle').one('trend', () => {
      this.$mainSelector.addClass('active').removeClass('disabled');
    });
  }

  _closeShareDropdown(){
    this.$mainSelector.addClass('disabled');
    this.$wrapper.addClass('hidden').revealer('toggle').one('trend', () => {
      this.$mainSelector.removeClass('active').removeClass('disabled');
    });
  }
}
