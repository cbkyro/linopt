import _ from 'lodash';
import PageManager from '../PageManager';
import breakpoint from './utils/breakpoint';

export default class Compare extends PageManager {
  constructor() {
    super();

    this._setSectionHeights();
    this._bindEvents();
  }

  _bindEvents() {
    $(window).on('resize', _.debounce(() => {
      this._setSectionHeights();
    }, 200));
  }

  _setSectionHeights() {
    const comparators = [
      '[data-comparison-title]',
      '[data-comparison-image]',
      '[data-comparison-price]',
      '[data-comparison-brand]',
      '[data-comparison-main]',
      '[data-comparison-description]',
      '[data-comparison-rating]',
      '[data-comparison-availability]',
    ];

    for (const comparator of comparators) {
      $(comparator).height('auto');

      // -- Unless is smaller than small, even out the heights -- //
      if (!breakpoint('xs') && !breakpoint('s')) {
        let sectionHeight = 0;
        $(comparator).each((i, el) => {
          const itemHeight = $(el).height();
          sectionHeight = (itemHeight > sectionHeight) ? itemHeight : sectionHeight;
        });
        $(comparator).height(sectionHeight);
      }
    }
  }
}
