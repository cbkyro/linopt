export default class EvenHeights {
  constructor(el, cell) {
    this.$el = $(el);
    this.$cells = $(cell, this.$el);
  }

  resetHeights(cells = false) {
    if (cells) {
      $(cells).each((i, el) => {
        $(el).css('height', '');
      });
    } else {
      this.$cells.css('height', '');
    }
  }

  setHeights(comparators) {
    this.resetHeights();

    let sectionHeight = 0;

    $(comparators).each((i, el) => {
      $(el).each((i, el) => {
        const itemHeight = $(el).outerHeight();
        sectionHeight = (itemHeight > sectionHeight) ? itemHeight : sectionHeight;
      });
    });

    $(comparators).each((i, el) => {
      $(el).height(Math.ceil(sectionHeight));
    });
  }
}
