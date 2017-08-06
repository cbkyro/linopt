import PageManager from '../PageManager';
import SelectWrapper from './components/SelectWrapper';
import FormValidator from './utils/FormValidator';
import MainHeader from './components/MainHeader';
import ShareList from './components/ShareList';
import QuickShop from './components/QuickShop';
import ThemeInit from './utils/ThemeInit';
import scrollTarget from './utils/scrollTarget';

export default class Global extends PageManager {
  constructor() {
    super();

    this._bindEvents();
  }

  _bindEvents() {
    const $select = $('select');
    if ($select.length) {
      $select.each((i, el) => {
        new SelectWrapper(el);
      });
    }

    $(document).on('click', '[data-scroll-top]', (event) => {
      event.preventDefault();
      scrollTarget('body');
    });
  }

  loaded() {
    new MainHeader('[data-main-header]', this.context);
    new ShareList();
    new ThemeInit();

    if ($('[data-quick-shop]').length) {
      new QuickShop(this.context);
    }

    this.validator = new FormValidator(this.context);
    this.validator.initGlobal();
  }
}
