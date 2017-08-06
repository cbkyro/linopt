import _ from 'lodash';
import Modal from 'bc-modal';
import FormValidator from '../utils/FormValidator';
import scrollTarget from '../utils/scrollTarget';
import QuickCart from '../components/QuickCart';

export default class MainHeader {
  constructor(el, context) {
    this.$el = $(el);
    this.context = context;
    this.$body = $(document.body);
    this.$window = $(window);
    this.searchForms = [
      $('[data-validated-form-search]'), $('[data-validated-form-search-mobile]'),
    ];

    this.$navToggle = $('[data-open-submenu]');
    this.dropDown = '[data-dropdown-menu]';
    this.windowWidth = null;

    this.optionsNavigation = {
      $toggle: $('[data-toggle-mobile-nav]', this.$el),
      $icon: $('[data-toggle-mobile-nav] [data-toggle-icon] use', this.$el),
      defaults: {
        label: this.context.headerNavMenu,
        icon: '#icon-menu',
        bodyClass: 'navigation-open',
      },
    };

    this.optionsSearch = {
      $modal: $('[data-modal-search]'),
      $toggle: $('[data-modal-search-toggle]', this.$el),
      $input: $('[data-validated-form-search] .form-input'),
      defaults: {
        label: this.context.headerNavSearch,
        icon: '#icon-search',
        bodyClass: 'search-open',
      },
    };

    this.searchModal = new Modal({
      el: this.optionsSearch.$modal,
      modalClass: 'modal-header-search',
    });

    new QuickCart();
    this._bindEvents();
  }

  _bindEvents() {
    this.$body.on('click', (event) => {
      if (!$(event.target).closest('.has-active-dropdown').length || !$(event.target).closest('.dropdown-active').length) {
        this._closeDropDowns();
      }
    });

    $('[data-dropdown-toggle]', this.$el).on('click', (event) => {
      event.preventDefault();
      this._toggleDropDown(event);
    });

    this.optionsNavigation.$toggle.on('click', (event) => {
      event.preventDefault();
      this._closeDropDowns();
      this._toggleMobileMenu();
    });

    this.optionsSearch.$toggle.on('click', (event) => {
      event.preventDefault();
      this._closeDropDowns();
      this.searchModal.open();
      this.optionsSearch.$input.focus();
    });

    this.$window.on('resize', _.debounce(() => {
      const $windowWidth = this.$window.width();

      if (this.windowWidth === $windowWidth) {
        return;
      }

      this.windowWidth = $windowWidth;

      this._closeMobileMenu();
    }, 200));

    this.$navToggle.on('click', (event) => {
      const $toggle = $(event.currentTarget);
      const $subMenu = $toggle.next('.submenu');
      $toggle.css('height', $toggle.outerHeight(true));
      $toggle.toggleClass('active');

      if ($subMenu.is(':visible')) {
        this._hideSubMenu($subMenu);
      } else {
        this._hideAdjacentMenu($toggle);
        this._showSubMenu($subMenu);
      }
    });

    this._searchValidation();
    this._bindCloseDropdowns();
  }

  _toggleMobileMenu() {
    if (this.$body.hasClass('mobile-nav-open')) {
      this._closeMobileMenu();
    } else {
      this._openMobileMenu();
    }
  }

  _openMobileMenu() {
    this.windowWidth = this.$window.width();
    this.$body.css('width', this.$body.outerWidth(true));
    this.optionsNavigation.$icon.attr('xlink:href', '#icon-close');
    this.$body.removeClass('mobile-nav-closed').addClass('mobile-nav-open scroll-locked');
    scrollTarget(document.body);
  }

  _closeMobileMenu() {
    this.$body.css('width', '');
    this.$body.removeClass('mobile-nav-open scroll-locked').addClass('mobile-nav-closed');
    this.optionsNavigation.$icon.attr('xlink:href', '#icon-menu');
  }

  /**
   * Binds the search form to the validation library
   * @private
   */
  _searchValidation() {
    this.searchForms.forEach(($searchForm) => {
      new FormValidator(this.context).initSingle($searchForm, {realTime: true});
    });
  }

  /**
   * Close any open drop downs on `escape`
   */
  _bindCloseDropdowns() {
    this.$body.on('keyup', (event) => {
      if (event.keyCode === 27 && this.$el.hasClass('has-active-dropdown')) {
        event.preventDefault();
        this._closeDropDowns();
      }
    });
  }

  // -------------------------- Drop Downs -------------------------- //
  /**
   * Opens a drop down on click, closes on click. Chains to a method to close other drop downs
   * @param event
   * @private
   */
  _toggleDropDown(event) {
    const $target = $(event.target);
    const $parent = $target.closest('li');

    if ($parent.hasClass('dropdown-active')) {
      $parent.removeClass('dropdown-active').find(this.dropDown).revealer('hide');
      this.$el.removeClass('has-active-dropdown');
    } else if (!$parent.hasClass('dropdown-active')) {
      this._closeDropDowns();
      $parent.addClass('dropdown-active').find(this.dropDown).revealer('show');
      this.$el.addClass('has-active-dropdown');
    }
  }

  /**
   * Closes all active drop downs
   * @private
   */
  _closeDropDowns() {
    this._hideAllSubMenus();
    this.$el.removeClass('has-active-dropdown').find('.dropdown-active').removeClass('dropdown-active').find(this.dropDown).revealer('hide');
  }

// -------------------------- Sub Menus -------------------------- //

  /**
   * Retrieve the native height of a menu item without showing it,
   * add it as a data attribute
   *
   * @private
   * @param {jQuery} $menu - a ul.submenu element
   */
  _setMenuHeight($menu) {
    $menu.css({
      position: 'absolute',
      left: -9999,
      display: 'block',
      height: 'auto',
    });

    $menu.data('height', $menu.height());
    $menu.removeAttr('style');
  }

  /**
   * Shows the submenu
   *
   * @private
   * @param {jQuery} $menu - the ul.submenu element we want to show
   */
  _showSubMenu($menu) {
    this._setMenuHeight($menu);
    $menu.revealer('show');
    $menu.one('revealer-animating', () => {
      $menu.css('min-height', $menu.data('height'));
    });
  }

  /**
   * Hides the submenu
   *
   * @private
   * @param {jQuery} $menu - the ul.submenu element we want to hide
   */
  _hideSubMenu($menu) {
    $menu.height(0);
    $menu.revealer('hide');
    $menu.one('revealer-hide', () => {
      $menu.removeAttr('style');
    });
  }

  /**
   * Hides the adjacent menus
   *
   * @private
   * @param {jQuery} $toggle - the [data-open-submenu] that was clicked
   */
  _hideAdjacentMenu($toggle) {
    const $openMenus = $toggle.parent('li').siblings('li').find('> .submenu:visible');

    $openMenus.each((i, el) => {
      $(el).prev('[data-open-submenu]').trigger('click');
    });
  }

  /**
   * Finds all sub-menus and closes them
   * @private
   */
  _hideAllSubMenus($selector = this.$el) {
    const $openMenus = $selector.find('.submenu:visible');

    $openMenus.each((i, el) => {
      $(el).prev('[data-open-submenu]').trigger('click');
    });
  }
}
